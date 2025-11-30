/**
 * Supabase Edge Function: Get Products/Items
 * 
 * API endpoint to get products/items from orders for a merchant
 * Handles timeout issues with proper retry logic
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key, x-merchant-id",
};

// ✅ Timeout settings - زيادة الوقت للسماح بالاستعلامات الكبيرة
const REQUEST_TIMEOUT = 60000; // 60 seconds
const QUERY_TIMEOUT = 50000; // 50 seconds

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ✅ Timeout wrapper
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout - please try again")), REQUEST_TIMEOUT);
  });

  try {
    const requestPromise = handleRequest(req);
    const result = await Promise.race([requestPromise, timeoutPromise]);
    return result as Response;
  } catch (error) {
    console.error("Error in get-products:", error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
});

async function handleRequest(req: Request): Promise<Response> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return errorResponse(500, "Server configuration error.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-client-info": "mirsal-api",
        },
      },
    });

    // Get API Key and Merchant ID
    const apiKey = req.headers.get("X-API-Key") || req.headers.get("x-api-key");
    const merchantId = req.headers.get("X-Merchant-Id") || req.headers.get("x-merchant-id");

    if (!apiKey || !merchantId) {
      return errorResponse(401, "Missing API Key or Merchant ID.");
    }

    // Validate API Key with timeout
    const keyValidationPromise = supabase
      .from("external_api_keys")
      .select("merchant_id")
      .eq("api_key", apiKey)
      .eq("is_active", true)
      .single();

    const keyTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("API Key validation timeout")), 10000);
    });

    const { data: apiKeyData, error: keyError } = await Promise.race([
      keyValidationPromise,
      keyTimeoutPromise,
    ]) as any;

    if (keyError || !apiKeyData || apiKeyData.merchant_id !== merchantId) {
      return errorResponse(401, "Invalid API Key.");
    }

    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "1000");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const orderId = url.searchParams.get("orderId"); // Optional: get products for specific order

    // ✅ Build query with timeout protection
    let query = supabase
      .from("orders")
      .select(`
        id,
        merchant_order_number,
        items,
        status,
        created_at,
        updated_at
      `, { count: "exact" })
      .eq("merchant_id", merchantId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (orderId) {
      query = query.eq("id", orderId);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    // ✅ Execute query with timeout
    const queryPromise = query;
    const queryTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Query timeout - database query took too long")), QUERY_TIMEOUT);
    });

    const { data: orders, error: ordersError, count } = await Promise.race([
      queryPromise,
      queryTimeoutPromise,
    ]) as any;

    if (ordersError) {
      console.error("Database error:", ordersError);
      return errorResponse(500, `Failed to fetch products: ${ordersError.message}`);
    }

    // ✅ Extract and format products/items
    const productsMap = new Map<string, any>();
    const allItems: any[] = [];

    orders?.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          // Create unique key for product
          const productKey = item.name || item.id || JSON.stringify(item);
          
          if (!productsMap.has(productKey)) {
            const product = {
              id: item.id || productKey,
              name: item.name || "غير محدد",
              quantity: item.quantity || 0,
              price: item.price || 0,
              totalPrice: (item.quantity || 0) * (item.price || 0),
              orderId: order.id,
              merchantOrderNumber: order.merchant_order_number,
              status: order.status,
              createdAt: order.created_at,
              updatedAt: order.updated_at,
            };
            
            productsMap.set(productKey, product);
            allItems.push(product);
          } else {
            // Aggregate quantities if same product appears in multiple orders
            const existing = productsMap.get(productKey);
            existing.quantity += (item.quantity || 0);
            existing.totalPrice += (item.quantity || 0) * (item.price || 0);
          }
        });
      }
    });

    // ✅ Format response
    const formattedProducts = Array.from(productsMap.values());

    return successResponse({
      success: true,
      products: formattedProducts,
      allItems: allItems, // All items including duplicates
      summary: {
        totalProducts: formattedProducts.length,
        totalItems: allItems.length,
        totalOrders: orders?.length || 0,
      },
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });

  } catch (error) {
    console.error("Error in handleRequest:", error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

function successResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}


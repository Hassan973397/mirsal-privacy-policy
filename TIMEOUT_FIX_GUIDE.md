# 🔧 دليل حل مشكلة Timeout في API

## المشكلة

```
Error loading products: Error: Request timeout - please try again
```

## الحل

تم إنشاء endpoint جديد `/get-products` مع إعدادات timeout محسّنة.

### 1. استخدام الـ Endpoint الجديد

**Endpoint:** `GET /functions/v1/get-products`

**مثال JavaScript:**

```javascript
async function getProducts(apiKey, merchantId, filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `https://YOUR_SUPABASE_URL/functions/v1/get-products?${params}`,
    {
      headers: {
        'X-API-Key': apiKey,
        'X-Merchant-Id': merchantId,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get products');
  }

  return await response.json();
}

// استخدام
try {
  const result = await getProducts(API_KEY, MERCHANT_ID, {
    limit: 500, // ✅ قلل limit لتجنب timeout
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  });
  
  console.log('Products:', result.products);
} catch (error) {
  console.error('Error:', error.message);
}
```

### 2. إضافة Retry Logic

```javascript
async function getProductsWithRetry(apiKey, merchantId, filters = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await getProducts(apiKey, merchantId, filters);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // تقليل limit في كل محاولة
      if (filters.limit) {
        filters.limit = Math.floor(filters.limit / 2);
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 3. نصائح لتجنب Timeout

1. **قلل `limit`**: استخدم قيم أصغر مثل 100 أو 500
2. **استخدم `startDate` و `endDate`**: لتقليل البيانات المسترجعة
3. **استخدم `orderId`**: لجلب منتجات طلب محدد فقط
4. **أضف Retry Logic**: أعد المحاولة مع exponential backoff
5. **استخدم Pagination**: اجلب البيانات على دفعات

### 4. مثال كامل مع معالجة الأخطاء

```javascript
// apiService.ts
export async function getProducts(filters = {}) {
  const apiKey = process.env.MIRSAL_API_KEY;
  const merchantId = process.env.MIRSAL_MERCHANT_ID;
  const baseUrl = process.env.MIRSAL_BASE_URL;

  // ✅ إعدادات افتراضية آمنة
  const safeFilters = {
    limit: 500, // ✅ قيمة آمنة
    offset: 0,
    ...filters,
  };

  // ✅ Retry logic
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const params = new URLSearchParams(safeFilters);
      const response = await fetch(
        `${baseUrl}/functions/v1/get-products?${params}`,
        {
          headers: {
            'X-API-Key': apiKey,
            'X-Merchant-Id': merchantId,
          },
          // ✅ Timeout على مستوى fetch
          signal: AbortSignal.timeout(55000), // 55 seconds
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get products');
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      
      // ✅ تقليل limit في كل محاولة
      if (safeFilters.limit > 100) {
        safeFilters.limit = Math.floor(safeFilters.limit / 2);
      }
      
      // ✅ Exponential backoff
      if (attempt < 2) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  throw lastError || new Error('Request timeout - please try again');
}
```

### 5. استخدام في OrderDispatch.tsx

```typescript
// OrderDispatch.tsx
import { getProducts } from './apiService';

async function loadProducts() {
  try {
    setLoading(true);
    
    // ✅ استخدام filters لتقليل البيانات
    const result = await getProducts({
      limit: 500,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // آخر 30 يوم
      endDate: new Date().toISOString(),
    });
    
    setProducts(result.products);
  } catch (error) {
    console.error('Error loading products:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
```

## Deployment

```bash
# Deploy the new function
supabase functions deploy get-products

# Test locally
supabase functions serve get-products
```

## الملفات المضافة

1. `supabase/functions/get-products/index.ts` - Edge Function الجديدة
2. `supabase/functions/get-products/deno.json` - إعدادات Deno
3. `supabase/functions/get-products/README.md` - الوثائق الكاملة

## الملفات المحدثة

1. `MIRSAL_COMPLETE_INTEGRATION_DOCUMENTATION.md` - أضيف endpoint المنتجات

---

**تم إنشاء هذا الدليل لحل مشكلة timeout في تحميل المنتجات** ✅


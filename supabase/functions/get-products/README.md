# 📦 Get Products API - Edge Function

## نظرة عامة

هذه الـ Edge Function تجلب المنتجات/العناصر من الطلبات للتاجر. تم تصميمها لحل مشاكل timeout مع إعدادات محسّنة.

## Endpoint

```
GET /functions/v1/get-products
```

## Headers المطلوبة

```
X-API-Key: YOUR_API_KEY
X-Merchant-Id: YOUR_MERCHANT_ID
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | عدد الطلبات (default: 1000) |
| `offset` | number | No | للتنقل بين الصفحات (default: 0) |
| `startDate` | string | No | تاريخ البداية (ISO format) |
| `endDate` | string | No | تاريخ النهاية (ISO format) |
| `orderId` | string | No | جلب منتجات طلب محدد |

## Response

### Success (200)

```json
{
  "success": true,
  "products": [
    {
      "id": "product-key",
      "name": "منتج 1",
      "quantity": 2,
      "price": 25000.0,
      "totalPrice": 50000.0,
      "orderId": "order-uuid",
      "merchantOrderNumber": "12345",
      "status": "delivered",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T14:20:00Z"
    }
  ],
  "allItems": [...],
  "summary": {
    "totalProducts": 50,
    "totalItems": 100,
    "totalOrders": 25
  },
  "pagination": {
    "total": 100,
    "limit": 1000,
    "offset": 0,
    "hasMore": false
  }
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid API Key."
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Request timeout - please try again"
}
```

## Timeout Settings

- **Request Timeout**: 60 seconds
- **Query Timeout**: 50 seconds

## أمثلة الاستخدام

### JavaScript/TypeScript

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
    limit: 500,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  });
  
  console.log('Products:', result.products);
  console.log('Total:', result.summary.totalProducts);
} catch (error) {
  console.error('Error:', error.message);
}
```

### PHP

```php
function getProducts($apiKey, $merchantId, $filters = []) {
    $url = 'https://YOUR_SUPABASE_URL/functions/v1/get-products';
    
    if (!empty($filters)) {
        $url .= '?' . http_build_query($filters);
    }
    
    $headers = [
        'X-API-Key: ' . $apiKey,
        'X-Merchant-Id: ' . $merchantId,
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        $error = json_decode($response, true);
        throw new Exception($error['error'] ?? 'Failed to get products');
    }
    
    return json_decode($response, true);
}
```

### Python

```python
import requests

def get_products(api_key, merchant_id, filters=None):
    url = 'https://YOUR_SUPABASE_URL/functions/v1/get-products'
    
    headers = {
        'X-API-Key': api_key,
        'X-Merchant-Id': merchant_id,
    }
    
    response = requests.get(url, headers=headers, params=filters or {})
    response.raise_for_status()
    
    return response.json()
```

## معالجة Timeout

إذا واجهت timeout:

1. **قلل `limit`**: استخدم قيم أصغر مثل 100 أو 500
2. **استخدم `startDate` و `endDate`**: لتقليل البيانات المسترجعة
3. **استخدم `orderId`**: لجلب منتجات طلب محدد فقط
4. **أضف Retry Logic**: أعد المحاولة مع exponential backoff

### مثال Retry Logic

```javascript
async function getProductsWithRetry(apiKey, merchantId, filters = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await getProducts(apiKey, merchantId, filters);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
      
      // تقليل limit في كل محاولة
      if (filters.limit) {
        filters.limit = Math.floor(filters.limit / 2);
      }
    }
  }
}
```

## Deployment

```bash
# Deploy the function
supabase functions deploy get-products

# Test locally
supabase functions serve get-products
```

## Troubleshooting

### Error: "Request timeout"
- ✅ قلل `limit`
- ✅ استخدم `startDate` و `endDate`
- ✅ أضف retry logic

### Error: "Query timeout"
- ✅ استخدم `orderId` لجلب طلب محدد
- ✅ تحقق من حجم البيانات في قاعدة البيانات
- ✅ أضف indexes على `orders.created_at` و `orders.merchant_id`

### Error: "Invalid API Key"
- ✅ تحقق من صحة API Key
- ✅ تحقق من أن API Key نشط (`is_active = true`)
- ✅ تحقق من أن Merchant ID صحيح


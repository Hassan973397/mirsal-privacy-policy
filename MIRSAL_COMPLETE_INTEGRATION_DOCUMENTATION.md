# 📚 الوثائق الكاملة لمرسال - للشركات المتكاملة

## 🎯 نظرة عامة

هذا الدليل الشامل يوضح كيفية جعل حالة الطلبات صحيحة وتظهر بشكل صحيح في الشركة المتكاملة مع مرسال. يحتوي على جميع المعلومات اللازمة للربط الصحيح.

---

## 📋 جدول المحتويات

1. [حالات الطلب الكاملة](#-حالات-الطلب-الكاملة)
2. [دورة حياة الطلب](#-دورة-حياة-الطلب)
3. [API Endpoints](#-api-endpoints)
4. [أمثلة الكود](#-أمثلة-الكود)
5. [قواعد الحالات](#-قواعد-الحالات)
6. [معالجة الأخطاء](#-معالجة-الأخطاء)

---

## 📊 حالات الطلب الكاملة

### جدول الحالات (21 حالة)

| الحالة (Status Code) | الاسم بالعربية | الوصف | متى تظهر |
|---------------------|----------------|-------|----------|
| `newOrder` | جديد | طلب جديد من التاجر | عند الإنشاء |
| `pendingReview` | قيد المراجعة | قيد المراجعة من قبل المالك | بعد الإنشاء مباشرة |
| `confirmed` | مؤكد | تم تأكيد الطلب من قبل المالك | بعد الموافقة |
| `assigned` | معيّن | تم تعيين مندوب استلام | عند إسناد المندوب |
| `pickedUp` | تم الاستلام | تم استلام الطلب من قبل مندوب الاستلام | بعد مسح الباركود |
| `warehouseReceived` | في المخزن | وصل إلى المخزن | عند وصوله للمخزن |
| `warehouseApproved` | موافق عليه | تم الموافقة عليه من المخزن | بعد التحقق |
| `warehouseRejected` | مرفوض | تم رفضه من المخزن | عند وجود مشكلة |
| `outForDelivery` | في الطريق | في الطريق للتوصيل | عند الإسناد لمندوب التوصيل |
| `delivered` | تم التسليم | تم التسليم بنجاح | بعد التسليم |
| `failed` | فشل | فشل التسليم | عند فشل التسليم |
| `deferred` | مؤجلة | مؤجل (72 ساعة) | عند طلب التأجيل |
| `partialReturn` | راجع جزئي | راجع جزئي | عند إرجاع جزئي |
| `replacement` | استبدال | استبدال | عند طلب الاستبدال |
| `returned` | راجع | راجع كامل | عند الإرجاع الكامل |
| `returnConfirmed` | راجع مؤكد | تم تأكيد الرجوع من المخزن | بعد تأكيد المخزن |
| `inProcessing` | قيد المعالجة | قيد المعالجة (بحاجة لقرار المُبلّغ) | عند الحاجة لمراجعة |
| `processed` | تمت المعالجة | تمت المعالجة من قبل المُبلّغ | بعد المعالجة |
| `settled` | مسوّى | تمت التسوية المالية | بعد الدفع |

### Mapping للبرمجة

#### JavaScript/TypeScript
```javascript
const statusMap = {
  newOrder: "جديد",
  pendingReview: "قيد المراجعة",
  confirmed: "مؤكد",
  assigned: "معيّن",
  pickedUp: "تم الاستلام",
  warehouseReceived: "في المخزن",
  warehouseApproved: "موافق عليه",
  warehouseRejected: "مرفوض",
  outForDelivery: "في الطريق",
  delivered: "تم التسليم",
  failed: "فشل",
  deferred: "مؤجلة",
  partialReturn: "راجع جزئي",
  replacement: "استبدال",
  returned: "راجع",
  returnConfirmed: "راجع مؤكد",
  inProcessing: "قيد المعالجة",
  processed: "تمت المعالجة",
  settled: "مسوّى"
};

function getStatusDisplay(status) {
  return statusMap[status] || status;
}
```

#### PHP
```php
$statusMap = [
    'newOrder' => 'جديد',
    'pendingReview' => 'قيد المراجعة',
    'confirmed' => 'مؤكد',
    'assigned' => 'معيّن',
    'pickedUp' => 'تم الاستلام',
    'warehouseReceived' => 'في المخزن',
    'warehouseApproved' => 'موافق عليه',
    'warehouseRejected' => 'مرفوض',
    'outForDelivery' => 'في الطريق',
    'delivered' => 'تم التسليم',
    'failed' => 'فشل',
    'deferred' => 'مؤجلة',
    'partialReturn' => 'راجع جزئي',
    'replacement' => 'استبدال',
    'returned' => 'راجع',
    'returnConfirmed' => 'راجع مؤكد',
    'inProcessing' => 'قيد المعالجة',
    'processed' => 'تمت المعالجة',
    'settled' => 'مسوّى'
];

function getStatusDisplay($status) {
    return $statusMap[$status] ?? $status;
}
```

#### Python
```python
STATUS_MAP = {
    "newOrder": "جديد",
    "pendingReview": "قيد المراجعة",
    "confirmed": "مؤكد",
    "assigned": "معيّن",
    "pickedUp": "تم الاستلام",
    "warehouseReceived": "في المخزن",
    "warehouseApproved": "موافق عليه",
    "warehouseRejected": "مرفوض",
    "outForDelivery": "في الطريق",
    "delivered": "تم التسليم",
    "failed": "فشل",
    "deferred": "مؤجلة",
    "partialReturn": "راجع جزئي",
    "replacement": "استبدال",
    "returned": "راجع",
    "returnConfirmed": "راجع مؤكد",
    "inProcessing": "قيد المعالجة",
    "processed": "تمت المعالجة",
    "settled": "مسوّى"
}

def get_status_display(status):
    return STATUS_MAP.get(status, status)
```

---

## 🔄 دورة حياة الطلب

### المخطط الكامل

```
[التاجر يُنشئ طلب]
         ↓
    [newOrder]
         ↓
  [طلب استلام]
         ↓
    [assigned] → [مندوب استلام]
         ↓
  [مسح باركود]
         ↓
    [pickedUp]
         ↓
    [للمخزن]
         ↓
  [warehouseReceived] → [التحقق]
         ↓
 [warehouseApproved]
         ↓
[إسناد للتوصيل] → [💰 أجر مندوب الاستلام]
         ↓
  [outForDelivery] → [مندوب توصيل داخلي]
         ↓
  ┌─────┴─────┐
  ↓           ↓
[delivered] [deferred/failed/returned]
  ↓
[💰 أجور: تاجر + مندوب توصيل]
  ↓
[التسوية المالية]
  ↓
[settled]
```

### المراحل الرئيسية

#### 1️⃣ مرحلة الإنشاء والتأكيد
- `newOrder` → `pendingReview` → `confirmed`

#### 2️⃣ مرحلة الاستلام من التاجر
- `assigned` → `pickedUp` (بعد مسح الباركود)

#### 3️⃣ مرحلة التحقق في المخزن
- `warehouseReceived` → `warehouseApproved` (أو `warehouseRejected`)

#### 4️⃣ مرحلة التوصيل للعميل
- `outForDelivery` → `delivered` (أو `failed`, `deferred`, `returned`)

#### 5️⃣ مرحلة المعالجة والتسوية
- `inProcessing` → `processed` → `settled`

---

## 🔌 API Endpoints

### Base URL
```
https://krjrkavfobaywniktgsy.supabase.co/functions/v1/
```

### Headers المطلوبة
```
Content-Type: application/json
X-API-Key: YOUR_API_KEY
X-Merchant-Id: YOUR_MERCHANT_ID
```

### 1. إنشاء طلب جديد

**Endpoint:** `POST /receive-order`

**Request Body:**
```json
{
  "customerName": "أحمد محمد",
  "customerPhone": "07901234567",
  "customerAddress": "بغداد، الكرادة، شارع الرشيد",
  "amount": 50000.0,
  "deliveryFee": 5000.0,
  "items": [
    {
      "name": "منتج 1",
      "quantity": 2,
      "price": 25000.0
    }
  ],
  "merchantOrderNumber": "12345",
  "notes": "طلب عاجل"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "barcodeId": "660e8400-e29b-41d4-a716-446655440001",
  "barcodeValue": "MRS1703123456789ABC123",
  "merchantOrderNumber": "12345",
  "message": "تم إنشاء الطلب بنجاح"
}
```

### 2. تتبع حالة الطلب

**Endpoint:** `GET /order-status/{orderId}`

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "merchantOrderNumber": "12345",
    "status": "delivered",
    "statusDisplay": "تم التسليم",
    "customerName": "أحمد محمد",
    "totalAmount": 55000.0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:20:00Z",
    "deliveredAt": "2024-01-15T14:20:00Z"
  }
}
```

### 3. جلب جميع الطلبات

**Endpoint:** `GET /merchant-orders`

**Query Parameters:**
- `status` (optional): فلترة حسب الحالة
- `limit` (default: 50): عدد الطلبات
- `offset` (default: 0): للتنقل بين الصفحات
- `startDate` (optional): تاريخ البداية (ISO format)
- `endDate` (optional): تاريخ النهاية (ISO format)

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "merchantOrderNumber": "12345",
      "customerName": "أحمد محمد",
      "status": "delivered",
      "statusDisplay": "تم التسليم",
      "totalAmount": 55000.0,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### 4. طلب مندوب استلام

**Endpoint:** `POST /request-pickup`

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال طلب مندوب استلام لـ 5 طلب جديد",
  "ordersCount": 5,
  "notifiedAgents": 3
}
```

### 5. جلب المنتجات/العناصر

**Endpoint:** `GET /get-products`

**Query Parameters:**
- `limit` (default: 1000): عدد الطلبات
- `offset` (default: 0): للتنقل بين الصفحات
- `startDate` (optional): تاريخ البداية (ISO format)
- `endDate` (optional): تاريخ النهاية (ISO format)
- `orderId` (optional): جلب منتجات طلب محدد

**Response:**
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
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
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

**⚠️ ملاحظة مهمة:** هذا الـ endpoint مصمم لحل مشاكل timeout مع إعدادات محسّنة:
- Request Timeout: 60 seconds
- Query Timeout: 50 seconds
- إذا واجهت timeout، قلل `limit` أو استخدم `startDate` و `endDate`

---

## 💻 أمثلة الكود

### JavaScript/Node.js

```javascript
// إعداد
const MIRSAL_API_KEY = process.env.MIRSAL_API_KEY;
const MIRSAL_MERCHANT_ID = process.env.MIRSAL_MERCHANT_ID;
const MIRSAL_BASE_URL = 'https://krjrkavfobaywniktgsy.supabase.co/functions/v1';

// إنشاء طلب
async function createOrder(orderData) {
  const response = await fetch(`${MIRSAL_BASE_URL}/receive-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': MIRSAL_API_KEY,
      'X-Merchant-Id': MIRSAL_MERCHANT_ID,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  return await response.json();
}

// تتبع حالة الطلب
async function getOrderStatus(orderId) {
  const response = await fetch(
    `${MIRSAL_BASE_URL}/order-status/${orderId}`,
    {
      headers: {
        'X-API-Key': MIRSAL_API_KEY,
        'X-Merchant-Id': MIRSAL_MERCHANT_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get order status');
  }

  return await response.json();
}

// جلب جميع الطلبات
async function getMerchantOrders(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `${MIRSAL_BASE_URL}/merchant-orders?${params}`,
    {
      headers: {
        'X-API-Key': MIRSAL_API_KEY,
        'X-Merchant-Id': MIRSAL_MERCHANT_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get orders');
  }

  return await response.json();
}

// جلب المنتجات/العناصر (مع retry logic لحل مشاكل timeout)
async function getProducts(filters = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(
        `${MIRSAL_BASE_URL}/get-products?${params}`,
        {
          headers: {
            'X-API-Key': MIRSAL_API_KEY,
            'X-Merchant-Id': MIRSAL_MERCHANT_ID,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get products');
      }

      return await response.json();
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

// استخدام
const order = {
  customerName: 'أحمد محمد',
  customerPhone: '07901234567',
  customerAddress: 'بغداد، الكرادة',
  amount: 50000.0,
  deliveryFee: 5000.0,
  items: [
    { name: 'منتج 1', quantity: 2 },
  ],
  merchantOrderNumber: '12345',
};

try {
  // إنشاء الطلب
  const result = await createOrder(order);
  console.log('Order created:', result.orderId);

  // تتبع الحالة
  const status = await getOrderStatus(result.orderId);
  console.log('Order status:', status.order.status);

  // جلب جميع الطلبات
  const orders = await getMerchantOrders({ status: 'delivered' });
  console.log('Delivered orders:', orders.orders);

  // جلب المنتجات
  const products = await getProducts({ 
    limit: 500,
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  console.log('Products:', products.products);
  console.log('Total products:', products.summary.totalProducts);
} catch (error) {
  console.error('Error:', error.message);
}
```

### PHP (Laravel)

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MirsalService
{
    private $apiKey;
    private $merchantId;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.mirsal.api_key');
        $this->merchantId = config('services.mirsal.merchant_id');
        $this->baseUrl = config('services.mirsal.base_url');
    }

    private function headers()
    {
        return [
            'Content-Type' => 'application/json',
            'X-API-Key' => $this->apiKey,
            'X-Merchant-Id' => $this->merchantId,
        ];
    }

    public function createOrder(array $orderData)
    {
        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/receive-order", $orderData);

        if (!$response->successful()) {
            throw new \Exception($response->json('error', 'Failed to create order'));
        }

        return $response->json();
    }

    public function getOrderStatus(string $orderId)
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/order-status/{$orderId}");

        if (!$response->successful()) {
            throw new \Exception('Failed to get order status');
        }

        return $response->json();
    }

    public function getMerchantOrders(array $filters = [])
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/merchant-orders", $filters);

        if (!$response->successful()) {
            throw new \Exception('Failed to get orders');
        }

        return $response->json();
    }
}

// استخدام
$mirsal = new MirsalService();

$order = [
    'customerName' => 'أحمد محمد',
    'customerPhone' => '07901234567',
    'customerAddress' => 'بغداد، الكرادة',
    'amount' => 50000.0,
    'deliveryFee' => 5000.0,
    'items' => [
        ['name' => 'منتج 1', 'quantity' => 2],
    ],
    'merchantOrderNumber' => '12345',
];

try {
    $result = $mirsal->createOrder($order);
    $status = $mirsal->getOrderStatus($result['orderId']);
    $orders = $mirsal->getMerchantOrders(['status' => 'delivered']);
} catch (\Exception $e) {
    // معالجة الخطأ
}
```

### Python

```python
import requests
import os

class MirsalAPI:
    def __init__(self):
        self.api_key = os.getenv('MIRSAL_API_KEY')
        self.merchant_id = os.getenv('MIRSAL_MERCHANT_ID')
        self.base_url = 'https://krjrkavfobaywniktgsy.supabase.co/functions/v1'
    
    def _headers(self):
        return {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key,
            'X-Merchant-Id': self.merchant_id,
        }
    
    def create_order(self, order_data):
        response = requests.post(
            f'{self.base_url}/receive-order',
            headers=self._headers(),
            json=order_data
        )
        response.raise_for_status()
        return response.json()
    
    def get_order_status(self, order_id):
        response = requests.get(
            f'{self.base_url}/order-status/{order_id}',
            headers=self._headers()
        )
        response.raise_for_status()
        return response.json()
    
    def get_merchant_orders(self, filters=None):
        response = requests.get(
            f'{self.base_url}/merchant-orders',
            headers=self._headers(),
            params=filters or {}
        )
        response.raise_for_status()
        return response.json()

# استخدام
mirsal = MirsalAPI()

order = {
    'customerName': 'أحمد محمد',
    'customerPhone': '07901234567',
    'customerAddress': 'بغداد، الكرادة',
    'amount': 50000.0,
    'deliveryFee': 5000.0,
    'items': [
        {'name': 'منتج 1', 'quantity': 2},
    ],
    'merchantOrderNumber': '12345',
}

try:
    result = mirsal.create_order(order)
    status = mirsal.get_order_status(result['orderId'])
    orders = mirsal.get_merchant_orders({'status': 'delivered'})
except requests.exceptions.HTTPError as e:
    print(f'Error: {e}')
```

---

## 📐 قواعد الحالات

### الحالات النهائية (لا تتغير)
- `delivered` (تم التسليم)
- `settled` (مسوّى)
- `returnConfirmed` (راجع مؤكد)

### الحالات المؤقتة (قد تتغير)
- `inProcessing` → قد تتغير إلى `delivered`, `returned`, `deferred`, إلخ
- `outForDelivery` → قد تتغير إلى `delivered` أو `failed`
- `deferred` → قد تتغير إلى `delivered` بعد 72 ساعة

### ترتيب الحالات المتوقع

1. **البداية:** `newOrder` → `pendingReview` → `confirmed`
2. **الاستلام:** `assigned` → `pickedUp`
3. **المخزن:** `warehouseReceived` → `warehouseApproved` (أو `warehouseRejected`)
4. **التوصيل:** `outForDelivery` → `delivered` (أو `failed`)
5. **المعالجة:** `inProcessing` → `processed`
6. **النهائية:** `settled`

### حالات خاصة

#### التسليم مع تعديل المبلغ
عندما يكون `mediatorDecision = 'تسليم مع تعديل المبلغ'` أو `'deliveredWithAmountChange'`:
- الحالة: `delivered`
- المبلغ: مختلف عن المبلغ الأصلي
- يجب التحقق من `mediatorDecision` و `amount` في Response

#### التأجيل التلقائي
- الحالة: `deferred`
- بعد 72 ساعة: تتحول تلقائياً إلى `delivered`
- يجب التحقق من `deferredAt` و `deferredUntil`

---

## 🐛 معالجة الأخطاء

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `400` | Invalid request data | تحقق من صحة البيانات المرسلة |
| `401` | Invalid API Key | تحقق من صحة API Key و Merchant ID |
| `403` | Merchant not active | اتصل بفريق مرسال |
| `404` | Order not found | تحقق من صحة Order ID |
| `500` | Server error | حاول مرة أخرى أو اتصل بالدعم |

### Retry Logic

```javascript
async function sendOrderWithRetry(orderData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await createOrder(orderData);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### Polling لتتبع الحالة

```javascript
async function pollOrderStatus(orderId, interval = 5000, maxAttempts = 60) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const result = await getOrderStatus(orderId);
    const status = result.order.status;
    
    // حالات نهائية
    if (['delivered', 'settled', 'returnConfirmed', 'failed'].includes(status)) {
      return result;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
    attempts++;
  }
  
  throw new Error('Timeout waiting for order status');
}
```

---

## ✅ Checklist للتكامل الصحيح

قبل البدء، تأكد من:

- [ ] الحصول على API Key و Merchant ID و Base URL
- [ ] إضافة Environment Variables
- [ ] قراءة الوثائق الكاملة
- [ ] تنفيذ دالة إنشاء الطلب
- [ ] تنفيذ دالة تتبع الطلب
- [ ] إضافة معالجة الأخطاء
- [ ] إضافة Retry Logic
- [ ] اختبار جميع الـ endpoints
- [ ] اختبار السيناريو الكامل
- [ ] عرض الحالات بشكل صحيح في الواجهة

---

## 📞 الدعم الفني

للمساعدة في الإعداد أو الإبلاغ عن مشاكل:

- **📧 البريد الإلكتروني:** support@mirsal.com
- **📚 الوثائق:** راجع الملفات في مجلد `integrations/`
- **🐛 المشاكل التقنية:** [GitHub Issues](https://github.com/mirsal/issues)

---

## 📄 ملاحظات مهمة

### للشركات المتكاملة:

1. **تتبع الحالة بشكل دوري:**
   - استخدم Polling كل 5-10 ثواني
   - أو استخدم Webhooks (إذا كانت متوفرة)

2. **عرض الحالة بشكل صحيح:**
   - استخدم `statusDisplay` من Response
   - أو استخدم `statusMap` المذكور أعلاه

3. **معالجة الحالات الخاصة:**
   - تحقق من `mediatorDecision` عند `delivered`
   - تحقق من `deferredAt` عند `deferred`
   - تحقق من `returnDeliveryMethod` عند `returned`

4. **الأمان:**
   - استخدم HTTPS دائماً
   - احفظ API Keys في Environment Variables
   - لا تشارك API Keys مع أي شخص

---

**تم إنشاء هذه الوثائق بواسطة فريق مرسال 💚**

**آخر تحديث:** 2025-11-28  
**الإصدار:** 1.0.4


# حالات الطلبات التي تظهر عند التاجر

هذا الملف يحتوي على جميع حالات الطلبات التي تظهر في حساب التاجر، ويمكن استخدامه لإرسالها للشركات الخارجية لعرض نفس الحالة.

## جدول الحالات الكامل

| الحالة (Status Code) | الاسم بالعربية | الوصف |
|---------------------|----------------|-------|
| `newOrder` | جديد | طلب جديد من التاجر |
| `pendingReview` | قيد المراجعة | قيد المراجعة من قبل المالك |
| `confirmed` | مؤكد | تم تأكيد الطلب من قبل المالك |
| `assigned` | معيّن | تم تعيين مندوب استلام |
| `pickedUp` | تم الاستلام | تم استلام الطلب من قبل مندوب الاستلام |
| `warehouseReceived` | في المخزن | وصل إلى المخزن |
| `warehouseApproved` | موافق عليه | تم الموافقة عليه من المخزن |
| `warehouseRejected` | مرفوض | تم رفضه من المخزن |
| `outForDelivery` | في الطريق | في الطريق للتوصيل (مع مندوب التوصيل) |
| `delivered` | تم التسليم | تم التسليم بنجاح |
| `failed` | فشل | فشل التسليم |
| `deferred` | مؤجلة | مؤجل (72 ساعة) |
| `partialReturn` | راجع جزئي | راجع جزئي |
| `replacement` | استبدال | استبدال |
| `returned` | راجع | راجع كامل |
| `returnConfirmed` | راجع مؤكد | تم تأكيد الرجوع من المخزن |
| `inProcessing` | قيد المعالجة | قيد المعالجة (بحاجة لقرار المُبلّغ) |
| `processed` | تمت المعالجة | تمت المعالجة من قبل المُبلّغ |
| `settled` | مسوّى | تمت التسوية المالية |

## JSON Format للاستخدام في API

```json
{
  "status": "delivered",
  "statusDisplayName": "تم التسليم",
  "statusCode": "delivered"
}
```

## Mapping كامل (للبرمجة)

### JavaScript/TypeScript
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

### Python
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

### PHP
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

## ملاحظات مهمة

1. **الحالات النهائية**: الحالات التالية تعتبر حالات نهائية ولا تتغير:
   - `delivered` (تم التسليم)
   - `settled` (مسوّى)
   - `returnConfirmed` (راجع مؤكد)

2. **الحالات المؤقتة**: الحالات التالية قد تتغير:
   - `inProcessing` (قيد المعالجة) - قد تتغير إلى `delivered`, `returned`, `deferred`, إلخ
   - `outForDelivery` (في الطريق) - قد تتغير إلى `delivered` أو `failed`

3. **الحالات المرتبطة بالرجوع**:
   - `returned` (راجع) - حالة أولية
   - `returnConfirmed` (راجع مؤكد) - حالة نهائية بعد التأكيد من المخزن
   - `partialReturn` (راجع جزئي) - رجوع جزئي
   - `replacement` (استبدال) - استبدال الطلب

4. **التسليم مع تعديل المبلغ**: عندما يكون `mediatorDecision = 'تسليم مع تعديل المبلغ'` أو `'deliveredWithAmountChange'`، تكون الحالة `delivered` ولكن مع مبلغ مختلف.

## مثال على Response من API

```json
{
  "orderId": "5db9d53b-f086-49c1-8e8f-53e4b8b31702",
  "merchantOrderNumber": "249007",
  "status": "delivered",
  "statusDisplayName": "تم التسليم",
  "statusCode": "delivered",
  "updatedAt": "2025-11-23T14:16:46.361Z",
  "previousStatus": "deferred"
}
```

## ترتيب الحالات حسب دورة حياة الطلب

1. **البداية**: `newOrder` → `pendingReview` → `confirmed`
2. **الاستلام**: `assigned` → `pickedUp`
3. **المخزن**: `warehouseReceived` → `warehouseApproved` (أو `warehouseRejected`)
4. **التوصيل**: `outForDelivery` → `delivered` (أو `failed`)
5. **المعالجة**: `inProcessing` → `processed` (أو `delivered`, `returned`, `deferred`, إلخ)
6. **النهائية**: `settled` (بعد التسوية المالية)

## حالات خاصة

- **مؤجل**: `deferred` - يمكن أن يتغير لاحقاً إلى `delivered`
- **راجع**: `returned` → `returnConfirmed` (بعد التأكيد)
- **استبدال/جزئي**: `replacement` أو `partialReturn` - قد يتغير إلى `delivered` أو `returnConfirmed`


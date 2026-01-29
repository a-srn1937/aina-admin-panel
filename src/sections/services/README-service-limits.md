# محدودیت سرویس‌های آزمون

## تغییرات اعمال شده

### محدودیت‌های جدید:
✅ **حداکثر 3 سرویس** برای هر آزمون
✅ **انواع سرویس ثابت**: برنز، نقره‌ای، طلایی
✅ **عدم تکرار نوع سرویس** در یک آزمون

## انواع سرویس‌ها

| نوع | نام فارسی | رنگ نمایش |
|-----|----------|-----------|
| `bronze` | برنز (Bronze) | #CD7F32 |
| `silver` | نقره‌ای (Silver) | #C0C0C0 |
| `gold` | طلایی (Gold) | #FFD700 |

## قابلیت‌های جدید

### 1. در صفحه سرویس‌ها:
- **انتخاب آزمون**: وقتی آزمون انتخاب می‌شود، انواع سرویس‌های موجود فیلتر می‌شوند
- **نمایش هشدار**: اگر آزمون 3 سرویس داشته باشد
- **غیرفعال کردن دکمه**: اگر همه انواع سرویس تعریف شده باشند

### 2. در سرویس‌های آزمون:
- **دکمه افزودن شرطی**: فقط اگر کمتر از 3 سرویس باشد
- **نمایش هشدار**: وقتی حداکثر سرویس رسیده
- **فیلتر انواع**: فقط انواع موجود نشان داده می‌شوند
- **نمایش رنگی**: هر نوع سرویس با رنگ مخصوص خودش

## Helper Functions

### `service-helpers.js`
```javascript
// بررسی حداکثر سرویس
isMaxServicesReached(servicesCount)

// دریافت انواع موجود
getAvailableServiceTypes(existingTypes)

// دریافت برچسب نوع سرویس
getServiceTypeLabel(type)

// دریافت رنگ نوع سرویس
getServiceTypeColor(type)

// اعتبارسنجی ایجاد سرویس
validateServiceCreation(existingServices, newServiceType)
```

## منطق کار

### 1. در TestServicesList:
```javascript
const maxServicesReached = isMaxServicesReached(services.length);
const existingServiceTypes = services.map(service => service.type);

// دکمه افزودن غیرفعال می‌شود اگر:
disabled={maxServicesReached}
```

### 2. در TestServiceCreateForm:
```javascript
const availableServiceTypes = getAvailableServiceTypes(existingServiceTypes);

// فقط انواع موجود نشان داده می‌شوند
// دکمه ایجاد غیرفعال می‌شود اگر هیچ نوع موجود نباشد
```

### 3. در ServiceCreateForm:
```javascript
// وقتی آزمون انتخاب می‌شود، سرویس‌های موجود بارگذاری می‌شوند
const { data: testServicesData } = useGetServicesByTest(selectedTestId);

// انواع موجود فیلتر می‌شوند
const availableServiceTypes = getAvailableServiceTypes(existingServiceTypes);
```

## پیام‌های کاربر

### هشدارها:
- **حداکثر سرویس**: "حداکثر 3 سرویس (برنز، نقره‌ای، طلایی) برای هر آزمون مجاز است."
- **همه انواع تعریف شده**: "همه انواع سرویس (برنز، نقره‌ای، طلایی) برای این آزمون تعریف شده‌اند."
- **آزمون پر**: "این آزمون قبلاً حداکثر 3 سرویس (برنز، نقره‌ای، طلایی) دارد."

## مزایا

1. **کنترل کیفیت**: جلوگیری از ایجاد سرویس‌های اضافی
2. **استاندارد**: همه آزمون‌ها ساختار یکسان دارند
3. **UX بهتر**: کاربر می‌داند چه انتظاری داشته باشد
4. **نمایش بهتر**: رنگ‌بندی انواع سرویس‌ها
5. **جلوگیری از خطا**: اعتبارسنجی در سمت کلاینت
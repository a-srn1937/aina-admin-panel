# مدیریت ترجمه‌ها (Variants Management)

این سیستم امکان مدیریت کامل ترجمه‌ها را برای آزمون‌ها، سوالات و گزینه‌ها فراهم می‌کند.

## قابلیت‌های جدید

### 1. مدیریت ترجمه‌های آزمون
- **مدیریت تکی**: ویرایش هر ترجمه به صورت جداگانه
- **مدیریت کلی**: مدیریت همه ترجمه‌ها در یک مدال واحد
- امکان اضافه کردن ترجمه جدید
- امکان حذف ترجمه‌های موجود

### 2. مدیریت ترجمه‌های سوالات
- **مدیریت تکی**: ویرایش هر ترجمه سوال به صورت جداگانه
- **مدیریت کلی**: مدیریت همه ترجمه‌های یک سوال در یک مدال
- امکان اضافه کردن ترجمه جدید برای سوال
- امکان حذف ترجمه‌های موجود

### 3. مدیریت ترجمه‌های گزینه‌ها
- **مدیریت تکی**: ویرایش هر ترجمه گزینه به صورت جداگانه  
- **مدیریت کلی**: مدیریت همه ترجمه‌های یک گزینه در یک مدال
- امکان اضافه کردن ترجمه جدید برای گزینه
- امکان حذف ترجمه‌های موجود

## کامپوننت‌های جدید

### TestVariantsManager
```jsx
<TestVariantsManager
  testId={testId}
  existingVariants={test?.variants || []}
  onSuccess={() => {
    // callback after successful save
  }}
/>
```

### QuestionVariantsManager
```jsx
<QuestionVariantsManager
  questionId={questionId}
  existingVariants={question?.variants || []}
  onSuccess={() => {
    // callback after successful save
  }}
/>
```

### OptionVariantsManager
```jsx
<OptionVariantsManager
  optionId={optionId}
  existingVariants={option?.variants || []}
  onSuccess={() => {
    // callback after successful save
  }}
/>
```

## نحوه استفاده

### در صفحه جزئیات آزمون:
1. دکمه "مدیریت کلی ترجمه‌ها" در بخش اطلاعات آزمون
2. دکمه "مدیریت کلی ترجمه‌ها" در هر سوال

### در صفحه مدیریت گزینه‌ها:
1. آیکون ترجمه (translate) در هر ردیف گزینه برای مدیریت کلی
2. آیکون ویرایش برای ویرایش تکی ترجمه‌ها

## API Endpoints مورد استفاده

- `POST /tests/{id}/variants` - اضافه کردن ترجمه‌های آزمون
- `POST /questions/{id}/variants` - اضافه کردن ترجمه‌های سوال  
- `POST /options/{id}/variants` - اضافه کردن ترجمه‌های گزینه
- `PATCH /tests/variants/{variantId}` - ویرایش ترجمه آزمون
- `PATCH /questions/variants/{variantId}` - ویرایش ترجمه سوال
- `PATCH /options/variants/{variantId}` - ویرایش ترجمه گزینه
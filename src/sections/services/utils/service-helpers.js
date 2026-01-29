// Helper functions for service management

export const SERVICE_TYPES = [
  { value: 'ai_report_card', label: 'تحلیل هوش مصنوعی' },
  { value: 'basic_report', label: 'گزارش پایه' },
  { value: 'premium_report', label: 'گزارش پیشرفته' },
];

export const TIER_TYPES = [
  { value: 'BRONZE', label: 'برنز', color: '#CD7F32' },
  { value: 'SILVER', label: 'نقره‌ای', color: '#C0C0C0' },
  { value: 'GOLD', label: 'طلایی', color: '#FFD700' },
];

export const getServiceTypeLabel = (type) => {
  const serviceType = SERVICE_TYPES.find((st) => st.value === type);
  return serviceType ? serviceType.label : type;
};

export const getTierLabel = (tier) => {
  const tierType = TIER_TYPES.find((t) => t.value === tier);
  return tierType ? tierType.label : tier;
};

export const getTierColor = (tier) => {
  const tierType = TIER_TYPES.find((t) => t.value === tier);
  return tierType ? tierType.color : '#666';
};

export const getAvailableTiers = (existingTiers) => TIER_TYPES.filter((tier) => !existingTiers.includes(tier.value));

export const isMaxServicesReached = (servicesCount) => servicesCount >= 3;

export const validateServiceCreation = (existingServices, newTier) => {
  if (existingServices.length >= 3) {
    return { valid: false, message: 'حداکثر 3 سرویس برای هر آزمون مجاز است.' };
  }

  const existingTiers = existingServices.map((s) => s.tier);
  if (existingTiers.includes(newTier)) {
    return { valid: false, message: 'این سطح سرویس قبلاً برای این آزمون تعریف شده است.' };
  }

  return { valid: true };
};
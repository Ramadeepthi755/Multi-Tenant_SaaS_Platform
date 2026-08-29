package com.workforce.hrm.service;

import com.workforce.hrm.dto.response.SubscriptionUsageDTO;
import com.workforce.hrm.entity.CompanySubscription;
import com.workforce.hrm.entity.SubscriptionPlan;
import java.util.List;

public interface SubscriptionService {
    SubscriptionUsageDTO getCurrentSubscriptionUsage();
    List<SubscriptionPlan> getAllPlans();
    CompanySubscription changeSubscriptionPlan(String planCode);
    void checkEmployeeLimit(Long companyId);
    void checkAiQuota(Long companyId);
    void recordAiUsage(Long companyId);
}

package com.workforce.hrm.config;

import com.workforce.hrm.entity.SubscriptionPlan;
import com.workforce.hrm.repository.SubscriptionPlanRepository;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class SubscriptionPlanSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionPlanSeeder.class);

    private final SubscriptionPlanRepository planRepository;

    public SubscriptionPlanSeeder(SubscriptionPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public void run(String... args) {
        ensurePlan("TRIAL", "Free Evaluation", "Essential HR features for small teams.", BigDecimal.ZERO, 50, 3, 2000L, 200);
        ensurePlan("PROFESSIONAL", "Professional Tier", "Full-featured ATS, Payroll and AI assistance for scaling companies.", BigDecimal.valueOf(199.00), 250, 10, 10000L, 1000);
        ensurePlan("ENTERPRISE", "Enterprise Tier", "Unlimited scaling with dedicated AI quotas and compliance tooling.", BigDecimal.valueOf(499.00), 1000, 50, 50000L, 5000);
        log.info("Default SaaS Subscription plans initialized successfully.");
    }

    private void ensurePlan(String code, String name, String desc, BigDecimal price, int empLimit, int adminLimit, long storageLimit, int aiLimit) {
        if (!planRepository.existsByPlanCode(code)) {
            SubscriptionPlan plan = SubscriptionPlan.builder()
                    .planCode(code)
                    .name(name)
                    .description(desc)
                    .priceMonthly(price)
                    .employeeLimit(empLimit)
                    .adminLimit(adminLimit)
                    .storageLimitMb(storageLimit)
                    .aiMonthlyQuota(aiLimit)
                    .advancedReportsEnabled(true)
                    .payrollEnabled(true)
                    .recruitmentEnabled(true)
                    .active(true)
                    .build();
            planRepository.save(plan);
            log.info("Initialized subscription plan: {}", code);
        }
    }
}

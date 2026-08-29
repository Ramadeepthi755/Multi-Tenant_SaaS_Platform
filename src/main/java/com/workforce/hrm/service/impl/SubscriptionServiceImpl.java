package com.workforce.hrm.service.impl;

import com.workforce.hrm.dto.response.SubscriptionUsageDTO;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.CompanySubscription;
import com.workforce.hrm.entity.SubscriptionPlan;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.CompanySubscriptionRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.SubscriptionPlanRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.SubscriptionService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final CompanySubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Autowired
    public SubscriptionServiceImpl(
            CompanySubscriptionRepository subscriptionRepository,
            SubscriptionPlanRepository planRepository,
            CompanyRepository companyRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    private synchronized SubscriptionPlan getOrCreateDefaultPlan(String planCode) {
        return planRepository.findByPlanCode(planCode).orElseGet(() -> {
            SubscriptionPlan plan;
            if ("ENTERPRISE".equalsIgnoreCase(planCode)) {
                plan = SubscriptionPlan.builder()
                        .planCode("ENTERPRISE")
                        .name("Enterprise Tier")
                        .description("Unlimited scaling with dedicated AI quotas and compliance tooling.")
                        .priceMonthly(BigDecimal.valueOf(499.00))
                        .employeeLimit(1000)
                        .adminLimit(50)
                        .storageLimitMb(50000L)
                        .aiMonthlyQuota(5000)
                        .advancedReportsEnabled(true)
                        .payrollEnabled(true)
                        .recruitmentEnabled(true)
                        .active(true)
                        .build();
            } else if ("PROFESSIONAL".equalsIgnoreCase(planCode)) {
                plan = SubscriptionPlan.builder()
                        .planCode("PROFESSIONAL")
                        .name("Professional Tier")
                        .description("Full-featured ATS, Payroll and AI assistance for scaling companies.")
                        .priceMonthly(BigDecimal.valueOf(199.00))
                        .employeeLimit(250)
                        .adminLimit(10)
                        .storageLimitMb(10000L)
                        .aiMonthlyQuota(1000)
                        .advancedReportsEnabled(true)
                        .payrollEnabled(true)
                        .recruitmentEnabled(true)
                        .active(true)
                        .build();
            } else {
                plan = SubscriptionPlan.builder()
                        .planCode("TRIAL")
                        .name("Free Evaluation")
                        .description("Essential HR management features for small teams.")
                        .priceMonthly(BigDecimal.ZERO)
                        .employeeLimit(50)
                        .adminLimit(3)
                        .storageLimitMb(2000L)
                        .aiMonthlyQuota(200)
                        .advancedReportsEnabled(true)
                        .payrollEnabled(true)
                        .recruitmentEnabled(true)
                        .active(true)
                        .build();
            }
            return planRepository.saveAndFlush(plan);
        });
    }

    private CompanySubscription getOrCreateCompanySubscription(Long companyId) {
        return subscriptionRepository.findByCompanyId(companyId).orElseGet(() -> {
            Company company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
            SubscriptionPlan defaultPlan = getOrCreateDefaultPlan("PROFESSIONAL");
            CompanySubscription sub = CompanySubscription.builder()
                    .company(company)
                    .plan(defaultPlan)
                    .status("ACTIVE")
                    .startDate(LocalDate.now())
                    .renewalDate(LocalDate.now().plusYears(1))
                    .aiUsageThisMonth(15)
                    .storageUsedMb(140L)
                    .build();
            return subscriptionRepository.save(sub);
        });
    }

    @Override
    @Transactional
    public SubscriptionUsageDTO getCurrentSubscriptionUsage() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        if (companyId == null) {
            // For superadmin or non-tenant view, return enterprise summary
            SubscriptionPlan ent = getOrCreateDefaultPlan("ENTERPRISE");
            return SubscriptionUsageDTO.builder()
                    .planCode(ent.getPlanCode())
                    .planName(ent.getName())
                    .status("PLATFORM_SUPERADMIN")
                    .startDate(LocalDate.now().minusMonths(6))
                    .renewalDate(LocalDate.now().plusYears(10))
                    .currentEmployees((int) employeeRepository.count())
                    .employeeLimit(10000)
                    .currentAdmins(5)
                    .adminLimit(100)
                    .storageUsedMb(500L)
                    .storageLimitMb(100000L)
                    .aiUsageThisMonth(50)
                    .aiMonthlyQuota(10000)
                    .advancedReportsEnabled(true)
                    .payrollEnabled(true)
                    .recruitmentEnabled(true)
                    .availablePlans(getAllPlanDTOs())
                    .build();
        }

        CompanySubscription sub = getOrCreateCompanySubscription(companyId);
        SubscriptionPlan plan = sub.getPlan();

        int employeeCount = (int) employeeRepository.countByDepartmentCompanyId(companyId);
        int adminCount = (int) userRepository.findByCompanyId(companyId).size();

        return SubscriptionUsageDTO.builder()
                .planCode(plan.getPlanCode())
                .planName(plan.getName())
                .status(sub.getStatus())
                .startDate(sub.getStartDate())
                .renewalDate(sub.getRenewalDate())
                .currentEmployees(employeeCount)
                .employeeLimit(plan.getEmployeeLimit())
                .currentAdmins(adminCount)
                .adminLimit(plan.getAdminLimit())
                .storageUsedMb(sub.getStorageUsedMb() != null ? sub.getStorageUsedMb() : 0L)
                .storageLimitMb(plan.getStorageLimitMb())
                .aiUsageThisMonth(sub.getAiUsageThisMonth() != null ? sub.getAiUsageThisMonth() : 0)
                .aiMonthlyQuota(plan.getAiMonthlyQuota())
                .advancedReportsEnabled(plan.getAdvancedReportsEnabled())
                .payrollEnabled(plan.getPayrollEnabled())
                .recruitmentEnabled(plan.getRecruitmentEnabled())
                .availablePlans(getAllPlanDTOs())
                .build();
    }

    private List<SubscriptionUsageDTO.PlanDetailDTO> getAllPlanDTOs() {
        return getAllPlans().stream().map(p -> SubscriptionUsageDTO.PlanDetailDTO.builder()
                .id(p.getId())
                .planCode(p.getPlanCode())
                .name(p.getName())
                .description(p.getDescription())
                .priceMonthly(p.getPriceMonthly().doubleValue())
                .employeeLimit(p.getEmployeeLimit())
                .adminLimit(p.getAdminLimit())
                .storageLimitMb(p.getStorageLimitMb())
                .aiMonthlyQuota(p.getAiMonthlyQuota())
                .advancedReportsEnabled(p.getAdvancedReportsEnabled())
                .payrollEnabled(p.getPayrollEnabled())
                .recruitmentEnabled(p.getRecruitmentEnabled())
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<SubscriptionPlan> getAllPlans() {
        getOrCreateDefaultPlan("TRIAL");
        getOrCreateDefaultPlan("PROFESSIONAL");
        getOrCreateDefaultPlan("ENTERPRISE");
        return planRepository.findAll();
    }

    @Override
    @Transactional
    public CompanySubscription changeSubscriptionPlan(String planCode) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        if (companyId == null) {
            throw new IllegalStateException("Subscription management requires an active tenant context.");
        }

        SubscriptionPlan targetPlan = planRepository.findByPlanCode(planCode)
                .orElseGet(() -> getOrCreateDefaultPlan(planCode));

        CompanySubscription sub = getOrCreateCompanySubscription(companyId);
        sub.setPlan(targetPlan);
        sub.setStatus("ACTIVE");
        sub.setRenewalDate(LocalDate.now().plusMonths(1));
        return subscriptionRepository.save(sub);
    }

    @Override
    @Transactional(readOnly = true)
    public void checkEmployeeLimit(Long companyId) {
        if (companyId == null) return;
        CompanySubscription sub = getOrCreateCompanySubscription(companyId);
        long currentCount = employeeRepository.countByDepartmentCompanyId(companyId);
        if (currentCount >= sub.getPlan().getEmployeeLimit()) {
            throw new IllegalStateException(String.format("Subscription Limit Exceeded: Your plan '%s' allows up to %d employees. Please upgrade your plan.", sub.getPlan().getName(), sub.getPlan().getEmployeeLimit()));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void checkAiQuota(Long companyId) {
        if (companyId == null) return;
        CompanySubscription sub = getOrCreateCompanySubscription(companyId);
        if (sub.getAiUsageThisMonth() != null && sub.getAiUsageThisMonth() >= sub.getPlan().getAiMonthlyQuota()) {
            throw new IllegalStateException(String.format("AI Quota Exceeded: Your plan '%s' has reached the monthly AI limit of %d requests.", sub.getPlan().getName(), sub.getPlan().getAiMonthlyQuota()));
        }
    }

    @Override
    @Transactional
    public void recordAiUsage(Long companyId) {
        if (companyId == null) return;
        CompanySubscription sub = getOrCreateCompanySubscription(companyId);
        int current = sub.getAiUsageThisMonth() != null ? sub.getAiUsageThisMonth() : 0;
        sub.setAiUsageThisMonth(current + 1);
        subscriptionRepository.save(sub);
    }
}

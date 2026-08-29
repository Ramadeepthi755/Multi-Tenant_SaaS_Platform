package com.workforce.hrm.service.impl;

import com.workforce.hrm.dto.request.CompanyOnboardingRequest;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.entity.SubscriptionPlan;
import com.workforce.hrm.entity.CompanySubscription;
import com.workforce.hrm.exception.DuplicateResourceException;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.CompanySubscriptionRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.SubscriptionPlanRepository;
import com.workforce.hrm.service.CompanyOnboardingService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyOnboardingServiceImpl implements CompanyOnboardingService {

    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final SubscriptionPlanRepository planRepository;
    private final CompanySubscriptionRepository subscriptionRepository;

    @Autowired
    public CompanyOnboardingServiceImpl(
            CompanyRepository companyRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository,
            SubscriptionPlanRepository planRepository,
            CompanySubscriptionRepository subscriptionRepository) {
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Override
    @Transactional
    public Company onboardNewTenant(CompanyOnboardingRequest request) {
        if (request.getCompanyCode() == null || request.getCompanyCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Company code is required for tenant onboarding.");
        }
        if (companyRepository.existsByCompanyCode(request.getCompanyCode())) {
            throw new DuplicateResourceException("Company code already registered: " + request.getCompanyCode());
        }

        Company company = new Company();
        company.setCompanyName(request.getCompanyName());
        company.setCompanyCode(request.getCompanyCode().trim().toUpperCase());
        company.setEmail(request.getContactEmail());
        company.setPhone(request.getContactPhone());
        company.setStatus(com.workforce.hrm.enums.CompanyStatus.ACTIVE);
        company.setActive(true);

        Company savedCompany = companyRepository.save(company);

        // Seed initial departments
        List<String> depts = (request.getInitialDepartments() != null && !request.getInitialDepartments().isEmpty())
                ? request.getInitialDepartments()
                : List.of("Human Resources", "Engineering", "Operations");

        Department defaultDept = null;
        for (String deptName : depts) {
            Department d = new Department();
            d.setDepartmentName(deptName);
            d.setDepartmentCode(deptName.substring(0, Math.min(3, deptName.length())).toUpperCase() + "_" + savedCompany.getCompanyCode());
            d.setCompany(savedCompany);
            d.setStatus(com.workforce.hrm.enums.DepartmentStatus.ACTIVE);
            Department savedDept = departmentRepository.save(d);
            if (defaultDept == null) defaultDept = savedDept;
        }

        // Seed initial designations
        List<String> desigs = (request.getInitialDesignations() != null && !request.getInitialDesignations().isEmpty())
                ? request.getInitialDesignations()
                : List.of("HR Manager", "Senior Software Engineer", "Operations Associate");

        for (String desigName : desigs) {
            Designation desig = new Designation();
            desig.setDesignationName(desigName);
            desig.setDesignationCode(desigName.substring(0, Math.min(3, desigName.length())).toUpperCase() + "_" + savedCompany.getCompanyCode());
            desig.setDepartment(defaultDept);
            desig.setStatus(com.workforce.hrm.enums.DesignationStatus.ACTIVE);
            designationRepository.save(desig);
        }

        // Provision Trial Subscription
        SubscriptionPlan trialPlan = planRepository.findByPlanCode("TRIAL").orElseGet(() -> {
            SubscriptionPlan plan = SubscriptionPlan.builder()
                    .planCode("TRIAL")
                    .name("Evaluation Tier")
                    .description("Standard trial onboarding")
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
            return planRepository.save(plan);
        });

        CompanySubscription sub = CompanySubscription.builder()
                .company(savedCompany)
                .plan(trialPlan)
                .status("TRIAL")
                .startDate(LocalDate.now())
                .renewalDate(LocalDate.now().plusDays(30))
                .aiUsageThisMonth(0)
                .storageUsedMb(0L)
                .build();
        subscriptionRepository.save(sub);

        return savedCompany;
    }
}

package com.workforce.hrm.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.CompanyStatus;
import com.workforce.hrm.enums.DepartmentStatus;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.repository.UserRepository;

/**
 * Explicit, development-only fixtures for exercising each supported role.
 * Production never enables this component and the password is supplied at
 * runtime rather than being embedded in source control.
 */
@Component
@Profile("dev")
@ConditionalOnProperty(name = "app.seed.demo-accounts", havingValue = "true")
@Order(5)
public class DemoAccountsSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoAccountsSeeder.class);

    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String demoPassword;

    public DemoAccountsSeeder(
            CompanyRepository companyRepository,
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository,
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.demo-password:}") String demoPassword) {
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.demoPassword = demoPassword;
    }

    @Override
    public void run(String... args) {
        if (demoPassword == null || demoPassword.isBlank()) {
            log.warn("Demo account seeding is enabled but app.seed.demo-password is empty; no accounts were created.");
            return;
        }

        Company company = companyRepository.findByCompanyCode("DEMO-HRM")
                .orElseGet(this::createDemoCompany);
        Department department = departmentRepository
                .findByDepartmentCodeAndCompanyId("DEMO-OPS", company.getId())
                .orElseGet(() -> createDemoDepartment(company));

        List<DemoAccount> accounts = List.of(
                new DemoAccount("COMPANY_ADMIN", "Company Admin", "company-admin@gmail.com", "company-admin@demo.hrm.test", false),
                new DemoAccount("HR", "HR User", "hr@gmail.com", "hr@demo.hrm.test", false),
                new DemoAccount("MANAGER", "Manager User", "manager@gmail.com", "manager@demo.hrm.test", true),
                new DemoAccount("EMPLOYEE", "Employee User", "employee@gmail.com", "employee@demo.hrm.test", true));

        for (DemoAccount account : accounts) {
            createUserIfMissing(account, company);
            if (account.employeeProfile()) {
                createEmployeeProfileIfMissing(account, company, department);
            }
        }

        log.info("Development role accounts are ready. Their shared password was read from app.seed.demo-password.");
    }

    private Company createDemoCompany() {
        Company company = new Company();
        company.setCompanyName("Demo HRM Company");
        company.setCompanyCode("DEMO-HRM");
        company.setEmail("support@hrm-portal.local");
        company.setPhone("0000000000");
        company.setStatus(CompanyStatus.ACTIVE);
        company.setActive(true);
        return companyRepository.save(company);
    }

    private Department createDemoDepartment(Company company) {
        Department department = new Department();
        department.setDepartmentCode("DEMO-OPS");
        department.setDepartmentName("Demo Operations");
        department.setDescription("Development-only operational department");
        department.setStatus(DepartmentStatus.ACTIVE);
        department.setCompany(company);
        return departmentRepository.save(department);
    }

    private void createUserIfMissing(DemoAccount account, Company company) {
        // Safe migration: check if legacy demo email exists in DB and migrate to new gmail address
        if (account.legacyEmail() != null) {
            userRepository.findByEmail(account.legacyEmail()).ifPresent(legacyUser -> {
                log.info("Migrating demo user email from {} to {}", legacyUser.getEmail(), account.email());
                legacyUser.setEmail(account.email());
                userRepository.save(legacyUser);
            });
        }

        if (userRepository.findByEmail(account.email()).isPresent()) {
            return;
        }

        Role role = roleRepository.findByRoleName(account.role())
                .orElseThrow(() -> new IllegalStateException("Missing required system role: " + account.role()));

        User user = new User();
        user.setFullName(account.fullName());
        user.setEmail(account.email());
        user.setPassword(passwordEncoder.encode(demoPassword));
        user.setRole(role);
        user.setCompany(company);
        user.setActive(true);
        user.setEnabled(true);
        user.setAccountLocked(false);
        user.setAccountExpired(false);
        user.setCredentialsExpired(false);
        user.setFailedAttempts(0);
        userRepository.save(user);
    }

    private void createEmployeeProfileIfMissing(
            DemoAccount account,
            Company company,
            Department department) {
        // Safe migration of existing employee profile if present
        if (account.legacyEmail() != null) {
            employeeRepository.findByEmail(account.legacyEmail()).ifPresent(legacyEmp -> {
                log.info("Migrating demo employee profile email from {} to {}", legacyEmp.getEmail(), account.email());
                legacyEmp.setEmail(account.email());
                employeeRepository.save(legacyEmp);
            });
        }

        if (employeeRepository.findByEmail(account.email()).isPresent()) {
            return;
        }

        Employee employee = new Employee();
        employee.setEmployeeCode("MANAGER".equals(account.role())
                ? "DEMO-MGR-001"
                : "DEMO-EMP-001");
        employee.setFirstName(account.fullName().split(" ")[0]);
        employee.setLastName(account.fullName().replaceFirst("^[^ ]+ ?", ""));
        employee.setEmail(account.email());
        employee.setJoiningDate(java.time.LocalDate.now());
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setCompany(company);
        employee.setDepartment(department);
        employeeRepository.save(employee);
    }

    private record DemoAccount(String role, String fullName, String email, String legacyEmail, boolean employeeProfile) {
    }
}

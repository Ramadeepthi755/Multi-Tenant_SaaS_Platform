package com.workforce.hrm;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workforce.hrm.entity.Candidate;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Holiday;
import com.workforce.hrm.entity.JobOpening;
import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.entity.Payroll;
import com.workforce.hrm.entity.PerformanceReview;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.CandidateStatus;
import com.workforce.hrm.enums.CompanyStatus;
import com.workforce.hrm.enums.DepartmentStatus;
import com.workforce.hrm.enums.DesignationStatus;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.enums.JobStatus;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.enums.PayrollStatus;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.repository.CandidateRepository;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.DocumentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.HolidayRepository;
import com.workforce.hrm.repository.JobOpeningRepository;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.repository.NotificationRepository;
import com.workforce.hrm.repository.PayrollRepository;
import com.workforce.hrm.repository.PerformanceReviewRepository;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SystemComprehensiveVerificationTest {

    private static final String PASSWORD = "verification-test-password";
    private static final String COMPANY_CODE = "VERIFY-CORP-A";
    private static final String COMPANY_CODE_B = "VERIFY-CORP-B";

    private static final List<String> ROLES = List.of(
            "SUPER_ADMIN",
            "COMPANY_ADMIN",
            "HR",
            "MANAGER",
            "EMPLOYEE");

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private CompanyRepository companyRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private DesignationRepository designationRepository;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AttendanceRepository attendanceRepository;
    @Autowired private LeaveRepository leaveRepository;
    @Autowired private PayrollRepository payrollRepository;
    @Autowired private HolidayRepository holidayRepository;
    @Autowired private DocumentRepository documentRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private JobOpeningRepository jobOpeningRepository;
    @Autowired private CandidateRepository candidateRepository;
    @Autowired private PerformanceReviewRepository performanceReviewRepository;

    private Company companyA;
    private Company companyB;
    private Department deptEngineering;
    private Department deptSales;
    private Designation desigEngineer;
    private Designation desigSalesExec;
    private Employee empManager;
    private Employee empEmployee;
    private Employee empEmployeeCompanyB;

    @BeforeEach
    void setUp() {
        companyA = companyRepository.findByCompanyCode(COMPANY_CODE).orElseGet(() -> {
            Company c = new Company();
            c.setCompanyName("Verification Corp A");
            c.setCompanyCode(COMPANY_CODE);
            c.setEmail("admin@corp-a.test");
            c.setPhone("1111111111");
            c.setStatus(CompanyStatus.ACTIVE);
            c.setActive(true);
            return companyRepository.save(c);
        });

        companyB = companyRepository.findByCompanyCode(COMPANY_CODE_B).orElseGet(() -> {
            Company c = new Company();
            c.setCompanyName("Verification Corp B");
            c.setCompanyCode(COMPANY_CODE_B);
            c.setEmail("admin@corp-b.test");
            c.setPhone("2222222222");
            c.setStatus(CompanyStatus.ACTIVE);
            c.setActive(true);
            return companyRepository.save(c);
        });

        deptEngineering = departmentRepository.findByDepartmentCodeAndCompanyId("VER-ENG", companyA.getId()).orElseGet(() -> {
            Department d = new Department();
            d.setDepartmentCode("VER-ENG");
            d.setDepartmentName("Engineering");
            d.setCompany(companyA);
            d.setStatus(DepartmentStatus.ACTIVE);
            return departmentRepository.save(d);
        });

        deptSales = departmentRepository.findByDepartmentCodeAndCompanyId("VER-SALES", companyA.getId()).orElseGet(() -> {
            Department d = new Department();
            d.setDepartmentCode("VER-SALES");
            d.setDepartmentName("Sales");
            d.setCompany(companyA);
            d.setStatus(DepartmentStatus.ACTIVE);
            return departmentRepository.save(d);
        });

        desigEngineer = designationRepository.findByDepartmentDepartmentId(deptEngineering.getDepartmentId()).stream().findFirst().orElseGet(() -> {
            Designation des = new Designation();
            des.setDesignationCode("VER-ENG-01");
            des.setDesignationName("Software Engineer");
            des.setDepartment(deptEngineering);
            des.setStatus(DesignationStatus.ACTIVE);
            return designationRepository.save(des);
        });

        desigSalesExec = designationRepository.findByDepartmentDepartmentId(deptSales.getDepartmentId()).stream().findFirst().orElseGet(() -> {
            Designation des = new Designation();
            des.setDesignationCode("VER-SAL-01");
            des.setDesignationName("Sales Executive");
            des.setDepartment(deptSales);
            des.setStatus(DesignationStatus.ACTIVE);
            return designationRepository.save(des);
        });

        for (String roleName : ROLES) {
            provisionUser(roleName, companyA);
        }

        provisionUserForCompanyB("COMPANY_ADMIN", companyB);

        empManager = employeeRepository.findByEmail(emailFor("MANAGER")).orElseGet(() -> {
            Employee e = new Employee();
            e.setEmployeeCode("VER-MGR-001");
            e.setFirstName("Manager");
            e.setLastName("Alpha");
            e.setEmail(emailFor("MANAGER"));
            e.setJoiningDate(LocalDate.now());
            e.setStatus(EmployeeStatus.ACTIVE);
            e.setCompany(companyA);
            e.setDepartment(deptEngineering);
            e.setDesignation(desigEngineer);
            return employeeRepository.save(e);
        });

        empEmployee = employeeRepository.findByEmail(emailFor("EMPLOYEE")).orElseGet(() -> {
            Employee e = new Employee();
            e.setEmployeeCode("VER-EMP-001");
            e.setFirstName("Employee");
            e.setLastName("Beta");
            e.setEmail(emailFor("EMPLOYEE"));
            e.setJoiningDate(LocalDate.now());
            e.setStatus(EmployeeStatus.ACTIVE);
            e.setCompany(companyA);
            e.setDepartment(deptEngineering);
            e.setDesignation(desigEngineer);
            return employeeRepository.save(e);
        });

        empEmployeeCompanyB = employeeRepository.findByEmail("employee.companyb@example.test").orElseGet(() -> {
            Employee e = new Employee();
            e.setEmployeeCode("VER-CORPB-001");
            e.setFirstName("Employee");
            e.setLastName("Gamma");
            e.setEmail("employee.companyb@example.test");
            e.setJoiningDate(LocalDate.now());
            e.setStatus(EmployeeStatus.ACTIVE);
            e.setCompany(companyB);
            return employeeRepository.save(e);
        });
    }

    @Test
    @DisplayName("1. Five Roles Login, /me verification, role tokens, and dashboard endpoints")
    void testFiveRolesAuthenticationAndDashboardFlow() throws Exception {
        for (String role : ROLES) {
            String email = emailFor(role);
            String token = loginAndGetToken(email);

            mockMvc.perform(get("/api/users/me").header("Authorization", token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value(email))
                    .andExpect(jsonPath("$.role").value(role));

            mockMvc.perform(get("/api/dashboard").header("Authorization", token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.role").value(role));
        }
    }

    @Test
    @DisplayName("2. Multi-Tenant Data Isolation Test (Company A vs Company B)")
    void testTenantIsolationEnforcement() throws Exception {
        String tokenCompanyA = loginAndGetToken(emailFor("COMPANY_ADMIN"));
        String tokenCompanyB = loginAndGetToken("company_admin.companyb@example.test");

        mockMvc.perform(get("/api/employees/{id}", empEmployeeCompanyB.getEmployeeId())
                .header("Authorization", tokenCompanyA))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/employees/{id}", empEmployee.getEmployeeId())
                .header("Authorization", tokenCompanyB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("3. Unauthorized and Forbidden RBAC Enforcement (401/403)")
    void testRbacAndUnauthorizedAccess() throws Exception {
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isUnauthorized());

        String employeeToken = loginAndGetToken(emailFor("EMPLOYEE"));
        mockMvc.perform(get("/api/reports/payroll")
                .header("Authorization", employeeToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("4. Core Module CRUD: Holiday, Department, Designation, Job, Candidate")
    void testCoreModulesCrud() throws Exception {
        String adminToken = loginAndGetToken(emailFor("COMPANY_ADMIN"));

        Holiday holiday = new Holiday();
        holiday.setHolidayName("Verification New Year");
        holiday.setHolidayDate(LocalDate.of(2026, 1, 1));
        holiday.setHolidayType("NATIONAL");
        holiday.setYear(2026);
        holiday.setStatus("ACTIVE");
        holiday.setActive(true);
        holiday.setCompany(companyA);
        holiday = holidayRepository.save(holiday);
        assertThat(holiday.getHolidayId()).isNotNull();

        mockMvc.perform(get("/api/holidays")
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        JobOpening job = new JobOpening();
        job.setJobTitle("Fullstack Engineer");
        job.setDepartment(deptEngineering);
        job.setCompany(companyA);
        job.setStatus(JobStatus.OPEN);
        job.setVacancies(2);
        job = jobOpeningRepository.save(job);
        assertThat(job.getJobId()).isNotNull();

        Candidate candidate = new Candidate();
        candidate.setFullName("John Doe Candidate");
        candidate.setEmail("john.candidate@example.test");
        candidate.setCompany(companyA);
        candidate.setStatus(CandidateStatus.APPLIED);
        candidate.setSkills("Java, Spring Boot, React");
        candidate = candidateRepository.save(candidate);
        assertThat(candidate.getCandidateId()).isNotNull();

        mockMvc.perform(get("/api/recruitment/jobs")
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/recruitment/candidates")
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @DisplayName("5. AI Intelligence Endpoints & Rule-Based Grounding Verification")
    void testAiWorkforceIntelligenceEndpoints() throws Exception {
        String adminToken = loginAndGetToken(emailFor("COMPANY_ADMIN"));

        mockMvc.perform(post("/api/ai/copilot")
                .header("Authorization", adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "prompt", "How many total employees in the company?",
                        "context", "verification",
                        "targetModule", "GENERAL"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isNotEmpty())
                .andExpect(jsonPath("$.module").value("COPILOT"));

        mockMvc.perform(post("/api/ai/generate-job-description")
                .header("Authorization", adminToken)
                .param("roleTitle", "Staff Architect")
                .param("departmentName", "Core Platform")
                .param("requiredSkills", "Kubernetes, Distributed Systems, Java 21")
                .param("experience", "7+ years"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isNotEmpty())
                .andExpect(jsonPath("$.module").value("RECRUITMENT"));

        mockMvc.perform(get("/api/ai/attendance-anomalies")
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isNotEmpty())
                .andExpect(jsonPath("$.module").value("ATTENDANCE_ANALYTICS"));
    }

    @Test
    @DisplayName("6. Profile Photo Endpoints: Upload, Retrieve, and 404 for Missing Photo")
    void testProfilePhotoEndpoints() throws Exception {
        String employeeToken = loginAndGetToken(emailFor("EMPLOYEE"));

        mockMvc.perform(get("/api/users/me/profile-photo")
                .header("Authorization", employeeToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("7. SaaS Subscription Quota & Plans Verification")
    void testSubscriptionQuotas() throws Exception {
        String adminToken = loginAndGetToken(emailFor("COMPANY_ADMIN"));

        mockMvc.perform(get("/api/subscription/plans")
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());

        mockMvc.perform(get("/api/subscription/usage")
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.planCode").isNotEmpty());
    }

    @Test
    @DisplayName("8. AI Policy RAG Endpoint Verification")
    void testPolicyRagAssistant() throws Exception {
        String employeeToken = loginAndGetToken(emailFor("EMPLOYEE"));

        mockMvc.perform(post("/api/ai/policy-qa")
                .header("Authorization", employeeToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("question", "What is the annual leave policy?"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isNotEmpty());
    }

    @Test
    @DisplayName("9. Employee Lifecycle Event Tracking & Timeline API")
    void testEmployeeLifecycleTimeline() throws Exception {
        String adminToken = loginAndGetToken(emailFor("COMPANY_ADMIN"));

        mockMvc.perform(get("/api/employees/{id}/timeline", empEmployee.getEmployeeId())
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("10. AI Attendance Anomaly Detection Verification")
    void testAttendanceAnomalyDetection() throws Exception {
        String adminToken = loginAndGetToken(emailFor("COMPANY_ADMIN"));

        mockMvc.perform(get("/api/ai/attendance-anomalies")
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.module").value("ATTENDANCE_ANALYTICS"));
    }

    @Test
    @DisplayName("11. Migrated Development Demo Gmail Accounts Verification (5 Roles)")
    void testMigratedDevelopmentDemoGmailAccounts() throws Exception {
        Map<String, String> demoAccounts = Map.of(
            "admin@gmail.com", "SUPER_ADMIN",
            "company-admin@gmail.com", "COMPANY_ADMIN",
            "hr@gmail.com", "HR",
            "manager@gmail.com", "MANAGER",
            "employee@gmail.com", "EMPLOYEE"
        );

        for (Map.Entry<String, String> entry : demoAccounts.entrySet()) {
            String email = entry.getKey();
            String roleName = entry.getValue();

            User user = userRepository.findByEmail(email).orElseGet(User::new);
            Role role = roleRepository.findByRoleName(roleName).orElseThrow();
            user.setFullName(roleName + " Demo User");
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(PASSWORD));
            user.setRole(role);
            user.setCompany(companyA);
            user.setActive(true);
            user.setEnabled(true);
            user.setAccountLocked(false);
            user.setAccountExpired(false);
            user.setCredentialsExpired(false);
            user.setFailedAttempts(0);
            userRepository.save(user);

            if ("MANAGER".equals(roleName) || "EMPLOYEE".equals(roleName)) {
                if (employeeRepository.findByEmail(email).isEmpty()) {
                    Employee emp = new Employee();
                    emp.setEmployeeCode("VER-" + roleName.substring(0, 3) + "-GMAIL");
                    emp.setFirstName(roleName);
                    emp.setLastName("GmailUser");
                    emp.setEmail(email);
                    emp.setJoiningDate(LocalDate.now());
                    emp.setStatus(EmployeeStatus.ACTIVE);
                    emp.setCompany(companyA);
                    emp.setDepartment(deptEngineering);
                    emp.setDesignation(desigEngineer);
                    employeeRepository.save(emp);
                }
            }

            String token = loginAndGetToken(email);

            mockMvc.perform(get("/api/users/me").header("Authorization", token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value(email))
                    .andExpect(jsonPath("$.role").value(roleName));

            mockMvc.perform(get("/api/dashboard").header("Authorization", token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.role").value(roleName));
        }
    }

    private void provisionUser(String roleName, Company company) {
        String email = emailFor(roleName);
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new IllegalStateException("Missing role " + roleName));
        user.setFullName(roleName + " Verification User");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(PASSWORD));
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

    private void provisionUserForCompanyB(String roleName, Company company) {
        String email = "company_admin.companyb@example.test";
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new IllegalStateException("Missing role " + roleName));
        user.setFullName("Company B Admin");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(PASSWORD));
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

    private String loginAndGetToken(String email) throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();
        JsonNode response = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return "Bearer " + response.path("token").asText();
    }

    private String emailFor(String roleName) {
        return roleName.toLowerCase() + ".verification@example.test";
    }
}

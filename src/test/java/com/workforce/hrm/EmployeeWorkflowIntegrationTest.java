package com.workforce.hrm;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.CompanyStatus;
import com.workforce.hrm.enums.DepartmentStatus;
import com.workforce.hrm.enums.DesignationStatus;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.repository.UserRepository;

/**
 * HTTP-level coverage for the employee, attendance, and leave flows.
 *
 * The assertions read the persisted H2 test database after each write so the
 * test cannot pass by only changing an in-memory frontend response.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EmployeeWorkflowIntegrationTest {

    private static final String PASSWORD = "workflow-test-password";
    private static final String COMPANY_CODE = "WF-TEST";
    private static final String DEPARTMENT_A_CODE = "WF-ENG";
    private static final String DEPARTMENT_B_CODE = "WF-OPS";
    private static final String DESIGNATION_A_CODE = "WF-ENG-DEV";
    private static final String DESIGNATION_B_CODE = "WF-OPS-LEAD";
    private static final List<String> ROLES = List.of(
            "SUPER_ADMIN", "COMPANY_ADMIN", "HR", "MANAGER", "EMPLOYEE");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DesignationRepository designationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    private Company company;
    private Department engineering;
    private Department operations;
    private Designation developer;
    private Designation operationsLead;
    private Employee employeeProfile;

    @BeforeEach
    void provisionWorkspace() {
        company = companyRepository.findByCompanyCode(COMPANY_CODE)
                .orElseGet(this::createCompany);
        engineering = departmentRepository
                .findByDepartmentCodeAndCompanyId(DEPARTMENT_A_CODE, company.getId())
                .orElseGet(() -> createDepartment(DEPARTMENT_A_CODE, "Engineering"));
        operations = departmentRepository
                .findByDepartmentCodeAndCompanyId(DEPARTMENT_B_CODE, company.getId())
                .orElseGet(() -> createDepartment(DEPARTMENT_B_CODE, "Operations"));
        developer = designationRepository.findAll().stream()
                .filter(designation -> DESIGNATION_A_CODE.equals(designation.getDesignationCode()))
                .findFirst()
                .orElseGet(() -> createDesignation(DESIGNATION_A_CODE, "Developer", engineering));
        operationsLead = designationRepository.findAll().stream()
                .filter(designation -> DESIGNATION_B_CODE.equals(designation.getDesignationCode()))
                .findFirst()
                .orElseGet(() -> createDesignation(DESIGNATION_B_CODE, "Operations Lead", operations));

        for (String roleName : ROLES) {
            provisionUser(roleName);
        }

        ensureManagerProfile();
        employeeProfile = employeeRepository.findByEmail("employee.workflow@example.test")
                .orElseGet(this::createEmployeeProfile);
    }

    @Test
    void allFiveRolesCanLoginLoadMeOpenDashboardAndLogout() throws Exception {
        for (String roleName : ROLES) {
            String email = emailFor(roleName);
            String authorization = authorizationFor(email);

            mockMvc.perform(get("/api/users/me")
                    .header("Authorization", authorization))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value(email))
                    .andExpect(jsonPath("$.role").value(roleName));

            mockMvc.perform(get("/api/dashboard")
                    .header("Authorization", authorization))
                    .andExpect(status().isOk());

            mockMvc.perform(post("/api/auth/logout")
                    .header("Authorization", authorization))
                    .andExpect(status().isNoContent());
        }
    }

    @Test
    void reportRoutesAreAvailableToAuthorizedRolesAndPayrollRemainsRestricted() throws Exception {
        String adminAuthorization = authorizationFor(emailFor("COMPANY_ADMIN"));

        mockMvc.perform(get("/api/reports/employees")
                .param("fromDate", LocalDate.now().minusDays(1).toString())
                .param("toDate", LocalDate.now().plusDays(1).toString())
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/reports/attendance")
                .param("fromDate", LocalDate.now().minusDays(7).toString())
                .param("toDate", LocalDate.now().toString())
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/reports/leave")
                .param("departmentId", engineering.getDepartmentId().toString())
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/reports/payroll")
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/reports/departments")
                .param("status", "ACTIVE")
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/reports/recruitment")
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/reports/performance")
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/reports/recruitment/export")
                .param("format", "csv")
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String contentType = result.getResponse().getContentType();
                    if (contentType == null || !contentType.startsWith("text/csv")) {
                        throw new AssertionError("Expected a CSV export response.");
                    }
                });

        String managerAuthorization = authorizationFor(emailFor("MANAGER"));
        mockMvc.perform(get("/api/reports/payroll")
                .header("Authorization", managerAuthorization))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminAndHrCanUseRelationshipIdsToCreateEditAndDeactivateEmployees() throws Exception {
        String adminAuthorization = authorizationFor(emailFor("COMPANY_ADMIN"));

        mockMvc.perform(get("/api/departments/{id}", engineering.getDepartmentId())
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.departmentId").value(engineering.getDepartmentId()))
                .andExpect(jsonPath("$.companyId").value(company.getId()));

        mockMvc.perform(get("/api/designations/{id}", developer.getDesignationId())
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.designationId").value(developer.getDesignationId()))
                .andExpect(jsonPath("$.designationName").value("Developer"))
                .andExpect(jsonPath("$.departmentId").value(engineering.getDepartmentId()));

        MvcResult createResult = mockMvc.perform(post("/api/employees")
                .header("Authorization", adminAuthorization)
                .contentType(MediaType.APPLICATION_JSON)
                .content(employeePayload("WF-ADMIN-001", "Admin-created", "admin-created@example.test",
                        engineering.getDepartmentId(), developer.getDesignationId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.departmentId").value(engineering.getDepartmentId()))
                .andExpect(jsonPath("$.designationId").value(developer.getDesignationId()))
                .andReturn();

        Long employeeId = responseId(createResult, "employeeId");
        Employee created = employeeRepository.findById(employeeId).orElseThrow();
        assertThat(created.getDepartment().getDepartmentId()).isEqualTo(engineering.getDepartmentId());
        assertThat(created.getDesignation().getDesignationId()).isEqualTo(developer.getDesignationId());

        mockMvc.perform(put("/api/employees/{id}", employeeId)
                .header("Authorization", adminAuthorization)
                .contentType(MediaType.APPLICATION_JSON)
                .content(employeePayload("WF-ADMIN-001", "Updated employee", "admin-created@example.test",
                        operations.getDepartmentId(), operationsLead.getDesignationId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Updated employee"))
                .andExpect(jsonPath("$.departmentId").value(operations.getDepartmentId()))
                .andExpect(jsonPath("$.designationId").value(operationsLead.getDesignationId()));

        Employee updated = employeeRepository.findById(employeeId).orElseThrow();
        assertThat(updated.getDepartment().getDepartmentId()).isEqualTo(operations.getDepartmentId());
        assertThat(updated.getDesignation().getDesignationId()).isEqualTo(operationsLead.getDesignationId());

        mockMvc.perform(delete("/api/employees/{id}", employeeId)
                .header("Authorization", adminAuthorization))
                .andExpect(status().isOk());

        Employee deactivated = employeeRepository.findById(employeeId).orElseThrow();
        assertThat(deactivated.getStatus()).isEqualTo(EmployeeStatus.INACTIVE);

        String hrAuthorization = authorizationFor(emailFor("HR"));
        mockMvc.perform(get("/api/companies")
                .header("Authorization", hrAuthorization))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/departments")
                .header("Authorization", hrAuthorization))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/designations")
                .header("Authorization", hrAuthorization))
                .andExpect(status().isOk());

        MvcResult hrCreateResult = mockMvc.perform(post("/api/employees")
                .header("Authorization", hrAuthorization)
                .contentType(MediaType.APPLICATION_JSON)
                .content(employeePayload("WF-HR-001", "HR-created", "hr-created@example.test",
                        engineering.getDepartmentId(), developer.getDesignationId())))
                .andExpect(status().isOk())
                .andReturn();

        Long hrEmployeeId = responseId(hrCreateResult, "employeeId");
        assertThat(employeeRepository.findById(hrEmployeeId)).isPresent();
    }

    @Test
    void employeeAttendanceAndLeaveApprovalArePersistedAndVisibleThroughTheApi() throws Exception {
        String employeeAuthorization = authorizationFor(emailFor("EMPLOYEE"));

        mockMvc.perform(post("/api/attendance/me/check-in")
                .header("Authorization", employeeAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value(employeeProfile.getEmployeeId()))
                .andExpect(jsonPath("$.checkInTime").isNotEmpty());

        assertThat(attendanceRepository.findByEmployeeEmployeeIdAndAttendanceDate(
                employeeProfile.getEmployeeId(), LocalDate.now()))
                .isPresent()
                .get()
                .extracting(attendance -> attendance.getCheckInTime())
                .isNotNull();

        mockMvc.perform(post("/api/attendance/me/check-out")
                .header("Authorization", employeeAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkOutTime").isNotEmpty());

        assertThat(attendanceRepository.findByEmployeeEmployeeIdAndAttendanceDate(
                employeeProfile.getEmployeeId(), LocalDate.now()))
                .isPresent()
                .get()
                .extracting(attendance -> attendance.getCheckOutTime())
                .isNotNull();

        mockMvc.perform(get("/api/attendance")
                .param("employeeId", employeeProfile.getEmployeeId().toString())
                .header("Authorization", employeeAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].employeeId").value(employeeProfile.getEmployeeId()));

        LocalDate leaveStart = LocalDate.now().plusDays(7);
        LocalDate leaveEnd = leaveStart.plusDays(1);
        MvcResult leaveCreateResult = mockMvc.perform(post("/api/leave")
                .header("Authorization", employeeAuthorization)
                .contentType(MediaType.APPLICATION_JSON)
                .content(leavePayload(employeeProfile.getEmployeeId(), leaveStart, leaveEnd)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        Long leaveId = responseId(leaveCreateResult, "leaveId");
        assertThat(leaveRepository.findById(leaveId))
                .isPresent()
                .get()
                .extracting(leave -> leave.getStatus())
                .isEqualTo(LeaveStatus.PENDING);

        String managerAuthorization = authorizationFor(emailFor("MANAGER"));
        mockMvc.perform(get("/api/leave/status/PENDING")
                .header("Authorization", managerAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].leaveId").value(leaveId));

        mockMvc.perform(put("/api/leave/{id}/approve", leaveId)
                .header("Authorization", managerAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        assertThat(leaveRepository.findById(leaveId))
                .isPresent()
                .get()
                .extracting(leave -> leave.getStatus())
                .isEqualTo(LeaveStatus.APPROVED);

        mockMvc.perform(get("/api/leave/employee/{employeeId}", employeeProfile.getEmployeeId())
                .header("Authorization", employeeAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].leaveId").value(leaveId))
                .andExpect(jsonPath("$.content[0].status").value("APPROVED"));
    }

    private Company createCompany() {
        Company created = new Company();
        created.setCompanyName("Workflow Test Company");
        created.setCompanyCode(COMPANY_CODE);
        created.setEmail("workflow-company@example.test");
        created.setPhone("0000000000");
        created.setStatus(CompanyStatus.ACTIVE);
        created.setActive(true);
        return companyRepository.save(created);
    }

    private Department createDepartment(String code, String name) {
        Department department = new Department();
        department.setDepartmentCode(code);
        department.setDepartmentName(name);
        department.setDescription(name + " test department");
        department.setStatus(DepartmentStatus.ACTIVE);
        department.setCompany(company);
        return departmentRepository.save(department);
    }

    private Designation createDesignation(String code, String name, Department department) {
        Designation designation = new Designation();
        designation.setDesignationCode(code);
        designation.setDesignationName(name);
        designation.setDescription(name + " test designation");
        designation.setStatus(DesignationStatus.ACTIVE);
        designation.setDepartment(department);
        return designationRepository.save(designation);
    }

    private void provisionUser(String roleName) {
        String email = emailFor(roleName);
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new IllegalStateException("Missing role " + roleName));
        user.setFullName(roleName + " workflow user");
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

    private Employee createEmployeeProfile() {
        Employee employee = new Employee();
        employee.setEmployeeCode("WF-EMP-001");
        employee.setFirstName("Employee");
        employee.setLastName("Workflow");
        employee.setEmail(emailFor("EMPLOYEE"));
        employee.setJoiningDate(LocalDate.now());
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setCompany(company);
        employee.setDepartment(engineering);
        employee.setDesignation(developer);
        return employeeRepository.save(employee);
    }

    private void ensureManagerProfile() {
        if (employeeRepository.findByEmail(emailFor("MANAGER")).isPresent()) {
            return;
        }

        Employee manager = new Employee();
        manager.setEmployeeCode("WF-MGR-001");
        manager.setFirstName("Manager");
        manager.setLastName("Workflow");
        manager.setEmail(emailFor("MANAGER"));
        manager.setJoiningDate(LocalDate.now());
        manager.setStatus(EmployeeStatus.ACTIVE);
        manager.setCompany(company);
        manager.setDepartment(engineering);
        manager.setDesignation(developer);
        employeeRepository.save(manager);
    }

    private String authorizationFor(String email) throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();
        JsonNode response = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return "Bearer " + response.path("token").asText();
    }

    private String employeePayload(String code, String firstName, String email,
            Long departmentId, Long designationId) throws Exception {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("employeeCode", code);
        payload.put("firstName", firstName);
        payload.put("lastName", "Workflow");
        payload.put("email", email);
        payload.put("phone", "9876543210");
        payload.put("gender", "OTHER");
        payload.put("dateOfBirth", "1990-01-01");
        payload.put("joiningDate", LocalDate.now().toString());
        payload.put("salary", 50000);
        payload.put("status", "ACTIVE");
        payload.put("departmentId", departmentId);
        payload.put("designationId", designationId);
        return objectMapper.writeValueAsString(payload);
    }

    private String leavePayload(Long employeeId, LocalDate startDate, LocalDate endDate) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "leaveType", "CASUAL_LEAVE",
                "startDate", startDate.toString(),
                "endDate", endDate.toString(),
                "reason", "Workflow integration test leave",
                "employeeId", employeeId));
    }

    private Long responseId(MvcResult result, String field) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString()).path(field).asLong();
    }

    private String emailFor(String roleName) {
        return roleName.toLowerCase() + ".workflow@example.test";
    }
}

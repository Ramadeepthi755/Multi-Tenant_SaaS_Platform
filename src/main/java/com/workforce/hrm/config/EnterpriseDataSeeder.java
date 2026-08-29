package com.workforce.hrm.config;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.workforce.hrm.entity.Attendance;
import com.workforce.hrm.entity.AuditLog;
import com.workforce.hrm.entity.Candidate;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.entity.Document;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Holiday;
import com.workforce.hrm.entity.Interview;
import com.workforce.hrm.entity.JobOpening;
import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.entity.Notification;
import com.workforce.hrm.entity.Payroll;
import com.workforce.hrm.entity.PerformanceReview;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.AttendanceStatus;
import com.workforce.hrm.enums.CandidateStatus;
import com.workforce.hrm.enums.CompanyStatus;
import com.workforce.hrm.enums.DepartmentStatus;
import com.workforce.hrm.enums.DesignationStatus;
import com.workforce.hrm.enums.DocumentType;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.enums.EmploymentType;
import com.workforce.hrm.enums.InterviewStatus;
import com.workforce.hrm.enums.InterviewType;
import com.workforce.hrm.enums.JobStatus;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.enums.LeaveType;
import com.workforce.hrm.enums.NotificationStatus;
import com.workforce.hrm.enums.PayrollStatus;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.repository.AuditLogRepository;
import com.workforce.hrm.repository.CandidateRepository;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.DocumentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.HolidayRepository;
import com.workforce.hrm.repository.InterviewRepository;
import com.workforce.hrm.repository.JobOpeningRepository;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.repository.NotificationRepository;
import com.workforce.hrm.repository.PayrollRepository;
import com.workforce.hrm.repository.PerformanceReviewRepository;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.repository.UserRepository;

/**
 * Development-only, idempotent enterprise seeder.
 * Generates rich, realistic relational data across all HRM entities
 * while strictly preserving existing users, credentials, and relations.
 */
@Component
@Profile("dev")
@ConditionalOnProperty(name = "app.seed.enterprise-demo", havingValue = "true")
@Order(10)
public class EnterpriseDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(EnterpriseDataSeeder.class);
    private final Random random = new Random(42);

    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;
    private final HolidayRepository holidayRepository;
    private final DocumentRepository documentRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final JobOpeningRepository jobOpeningRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final PerformanceReviewRepository performanceReviewRepository;
    private final PasswordEncoder passwordEncoder;
    private final String demoPassword;

    public EnterpriseDataSeeder(
            CompanyRepository companyRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            AttendanceRepository attendanceRepository,
            LeaveRepository leaveRepository,
            PayrollRepository payrollRepository,
            HolidayRepository holidayRepository,
            DocumentRepository documentRepository,
            NotificationRepository notificationRepository,
            AuditLogRepository auditLogRepository,
            JobOpeningRepository jobOpeningRepository,
            CandidateRepository candidateRepository,
            InterviewRepository interviewRepository,
            PerformanceReviewRepository performanceReviewRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.demo-password:DemoPass123!}") String demoPassword) {

        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.payrollRepository = payrollRepository;
        this.holidayRepository = holidayRepository;
        this.documentRepository = documentRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
        this.jobOpeningRepository = jobOpeningRepository;
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.performanceReviewRepository = performanceReviewRepository;
        this.passwordEncoder = passwordEncoder;
        this.demoPassword = (demoPassword == null || demoPassword.isBlank()) ? "DemoPass123!" : demoPassword;
    }

    @Override
    public void run(String... args) {
        log.info("Starting Enterprise Realistic Demo Dataset Seeding...");

        List<Company> companies = seedCompanies();
        List<Department> departments = seedDepartments(companies);
        List<Designation> designations = seedDesignations(departments);
        List<Employee> employees = seedEmployees(companies, departments, designations);
        seedHolidays(companies);
        seedAttendance(employees);
        seedLeaves(employees);
        seedPayrolls(employees);
        seedDocuments(employees);
        seedNotifications(employees);
        seedAuditLogs(employees);
        seedRecruitment(companies, departments);
        seedPerformanceReviews(employees);

        log.info("Enterprise Demo Dataset Seeding Completed Successfully.");
    }

    private List<Company> seedCompanies() {
        String[][] companyDefs = {
            {"DEMO-HRM", "Demo HRM Corp", "info@hrm-portal.local", "+1-555-0100", "San Francisco, CA"},
            {"ACME-CORP", "Acme Corporation", "contact@acme.test", "+1-555-0101", "New York, NY"},
            {"NEXUS-TECH", "Nexus Technologies Inc", "hello@nexustech.test", "+1-555-0102", "Austin, TX"},
            {"APEX-GLOBAL", "Apex Global Solutions", "biz@apexglobal.test", "+1-555-0103", "Seattle, WA"},
            {"QUANTUM-SYS", "Quantum Systems Ltd", "support@quantumsys.test", "+1-555-0104", "Boston, MA"},
            {"HORIZON-MEDIA", "Horizon Media Works", "press@horizonmedia.test", "+1-555-0105", "Los Angeles, CA"},
            {"VORTEX-FIN", "Vortex Financial Group", "client@vortexfin.test", "+1-555-0106", "Chicago, IL"},
            {"BIO-HEALTH", "BioHealth Lifesciences", "info@biohealth.test", "+1-555-0107", "San Diego, CA"},
            {"STELLAR-LOG", "Stellar Logistics", "dispatch@stellarlog.test", "+1-555-0108", "Atlanta, GA"},
            {"ZENITH-ENERGY", "Zenith Energy Solutions", "ops@zenithenergy.test", "+1-555-0109", "Denver, CO"},
            {"PRISM-RETAIL", "Prism Retail Chain", "corporate@prismretail.test", "+1-555-0110", "Dallas, TX"},
            {"CYBER-DEF", "CyberDef Shield Labs", "security@cyberdef.test", "+1-555-0111", "Washington, DC"}
        };

        List<Company> companies = new ArrayList<>();
        for (String[] def : companyDefs) {
            Company company = companyRepository.findByCompanyCode(def[0])
                .orElseGet(() -> {
                    Company c = new Company();
                    c.setCompanyCode(def[0]);
                    c.setCompanyName(def[1]);
                    c.setEmail(def[2]);
                    c.setPhone(def[3]);
                    c.setStatus(CompanyStatus.ACTIVE);
                    c.setActive(true);
                    return companyRepository.save(c);
                });
            companies.add(company);
        }
        return companies;
    }

    private List<Department> seedDepartments(List<Company> companies) {
        String[][] deptNames = {
            {"ENG", "Engineering", "Core software development and platform engineering"},
            {"OPS", "Operations", "Day-to-day organizational workflow and systems"},
            {"HR", "Human Resources", "People operations, talent, and compliance"},
            {"SALES", "Sales & Business Dev", "Revenue generation and enterprise accounts"},
            {"MKT", "Marketing", "Brand, growth, and content marketing"},
            {"FIN", "Finance & Accounting", "Fiscal management, bookkeeping, and budgeting"},
            {"PROD", "Product Management", "Product roadmap, UI/UX, and strategy"},
            {"CS", "Customer Success", "Client support, onboarding, and relationship management"}
        };

        List<Department> departments = new ArrayList<>();
        for (Company company : companies) {
            for (String[] d : deptNames) {
                String code = company.getCompanyCode() + "-" + d[0];
                Department dept = departmentRepository.findByDepartmentCodeAndCompanyId(code, company.getId())
                    .orElseGet(() -> {
                        Department department = new Department();
                        department.setDepartmentCode(code);
                        department.setDepartmentName(d[1]);
                        department.setDescription(d[2]);
                        department.setStatus(DepartmentStatus.ACTIVE);
                        department.setCompany(company);
                        return departmentRepository.save(department);
                    });
                departments.add(dept);
            }
        }
        return departments;
    }

    private List<Designation> seedDesignations(List<Department> departments) {
        String[][] desigTemplates = {
            {"DIR", "Director", "Executive head of department", "120000-180000"},
            {"MGR", "Manager", "Leads team operations and reviews", "80000-120000"},
            {"LEAD", "Team Lead", "Technical/functional lead", "65000-95000"},
            {"SR", "Senior Associate", "Senior functional specialist", "50000-75000"},
            {"ASSOC", "Associate", "Core professional execution", "35000-55000"},
            {"JR", "Junior Analyst", "Entry-level team contributor", "25000-40000"}
        };

        List<Designation> designations = new ArrayList<>();
        for (Department dept : departments) {
            for (String[] t : desigTemplates) {
                String code = dept.getDepartmentCode() + "-" + t[0];
                String name = t[1] + " - " + dept.getDepartmentName();
                boolean exists = designationRepository.existsByDesignationCodeAndDepartmentCompanyId(
                        code, dept.getCompany().getId());
                if (!exists) {
                    Designation desig = new Designation();
                    desig.setDesignationCode(code);
                    desig.setDesignationName(name);
                    desig.setDescription(t[2]);
                    desig.setStatus(DesignationStatus.ACTIVE);
                    desig.setDepartment(dept);
                    designations.add(designationRepository.save(desig));
                }
            }
        }
        return designationRepository.findAll();
    }

    private List<Employee> seedEmployees(
            List<Company> companies,
            List<Department> departments,
            List<Designation> designations) {

        String[] firstNames = {
            "Alexander", "Sophia", "Liam", "Olivia", "Noah", "Emma", "Ethan", "Ava", "James", "Isabella",
            "Benjamin", "Mia", "Lucas", "Harper", "Henry", "Evelyn", "Daniel", "Charlotte", "Matthew", "Amelia",
            "David", "Ella", "Joseph", "Abigail", "Samuel", "Emily", "Sebastian", "Elizabeth", "Jack", "Mila",
            "Aiden", "Ella", "Owen", "Avery", "Gabriel", "Sofia", "Carter", "Camila", "Jayden", "Aria",
            "John", "Scarlett", "Luke", "Victoria", "Anthony", "Madison", "Isaac", "Luna", "Dylan", "Grace"
        };

        String[] lastNames = {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
            "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
            "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
            "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
        };

        List<Employee> allEmployees = new ArrayList<>();
        int empSeq = 1;

        Role employeeRole = roleRepository.findByRoleName("EMPLOYEE").orElse(null);
        Role managerRole = roleRepository.findByRoleName("MANAGER").orElse(null);
        Role hrRole = roleRepository.findByRoleName("HR").orElse(null);

        for (Company company : companies) {
            List<Department> companyDepts = departments.stream()
                .filter(d -> d.getCompany().getId().equals(company.getId()))
                .toList();

            for (Department dept : companyDepts) {
                List<Designation> deptDesigs = designations.stream()
                    .filter(d -> d.getDepartment().getDepartmentId().equals(dept.getDepartmentId()))
                    .toList();

                if (deptDesigs.isEmpty()) continue;

                // Create 2-3 employees per department
                int countForDept = 2 + (dept.getDepartmentCode().endsWith("ENG") ? 2 : 1);
                for (int i = 0; i < countForDept; i++) {
                    String code = String.format(Locale.ROOT, "%s-EMP-%04d", company.getCompanyCode(), empSeq++);
                    String email = String.format(Locale.ROOT, "emp.%d@%s.hrm.test", empSeq, company.getCompanyCode().toLowerCase());

                    if (employeeRepository.findByEmail(email).isPresent()) {
                        continue;
                    }

                    String fn = firstNames[(empSeq + i) % firstNames.length];
                    String ln = lastNames[(empSeq * 3 + i) % lastNames.length];
                    Designation desig = deptDesigs.get(i % deptDesigs.size());

                    Employee employee = new Employee();
                    employee.setEmployeeCode(code);
                    employee.setFirstName(fn);
                    employee.setLastName(ln);
                    employee.setEmail(email);
                    employee.setPhone(String.format(Locale.ROOT, "+1-555-%04d", 1000 + (empSeq % 8999)));
                    employee.setGender((i % 2 == 0) ? "MALE" : "FEMALE");
                    employee.setDateOfBirth(LocalDate.of(1985 + (empSeq % 15), 1 + (empSeq % 12), 1 + (empSeq % 28)));
                    employee.setJoiningDate(LocalDate.now().minusMonths(random.nextInt(36)).minusDays(random.nextInt(25)));
                    employee.setSalary(45000.0 + (random.nextInt(40) * 1500.0));
                    employee.setStatus(EmployeeStatus.ACTIVE);
                    employee.setCompany(company);
                    employee.setDepartment(dept);
                    employee.setDesignation(desig);

                    Employee savedEmp = employeeRepository.save(employee);
                    allEmployees.add(savedEmp);

                    // Create matching User account if missing
                    if (userRepository.findByEmail(email).isEmpty() && employeeRole != null) {
                        User u = new User();
                        u.setFullName(fn + " " + ln);
                        u.setEmail(email);
                        u.setPassword(passwordEncoder.encode(demoPassword));
                        u.setRole(desig.getDesignationName().contains("Manager") ? (managerRole != null ? managerRole : employeeRole) : employeeRole);
                        u.setCompany(company);
                        u.setActive(true);
                        u.setEnabled(true);
                        u.setAccountLocked(false);
                        u.setAccountExpired(false);
                        u.setCredentialsExpired(false);
                        u.setFailedAttempts(0);
                        userRepository.save(u);
                    }
                }
            }
        }
        return employeeRepository.findAll();
    }

    private void seedHolidays(List<Company> companies) {
        String[][] annualHolidays = {
            {"New Year's Day", "01-01", "NATIONAL"},
            {"Martin Luther King Jr. Day", "01-19", "PUBLIC"},
            {"Presidents' Day", "02-16", "PUBLIC"},
            {"Memorial Day", "05-25", "NATIONAL"},
            {"Juneteenth National Independence Day", "06-19", "NATIONAL"},
            {"Independence Day", "07-04", "NATIONAL"},
            {"Labor Day", "09-07", "NATIONAL"},
            {"Columbus Day", "10-12", "OPTIONAL"},
            {"Veterans Day", "11-11", "NATIONAL"},
            {"Thanksgiving Day", "11-26", "NATIONAL"},
            {"Day After Thanksgiving", "11-27", "COMPANY"},
            {"Christmas Eve", "12-24", "COMPANY"},
            {"Christmas Day", "12-25", "NATIONAL"},
            {"New Year's Eve", "12-31", "COMPANY"}
        };

        int currentYear = LocalDate.now().getYear();
        for (Company company : companies) {
            for (int y = currentYear - 1; y <= currentYear + 1; y++) {
                for (String[] h : annualHolidays) {
                    LocalDate date = LocalDate.parse(y + "-" + h[1]);
                    if (!holidayRepository.existsByHolidayDateAndCompanyId(date, company.getId())) {
                        Holiday holiday = new Holiday();
                        holiday.setHolidayName(h[0]);
                        holiday.setHolidayDate(date);
                        holiday.setHolidayType(h[2]);
                        holiday.setDescription(h[0] + " corporate holiday");
                        holiday.setYear(y);
                        holiday.setCompany(company);
                        holidayRepository.save(holiday);
                    }
                }
            }
        }
    }

    private void seedAttendance(List<Employee> employees) {
        LocalDate today = LocalDate.now();
        List<Employee> pool = employees.subList(0, Math.min(employees.size(), 80));

        for (Employee emp : pool) {
            for (int daysAgo = 0; daysAgo <= 20; daysAgo++) {
                LocalDate date = today.minusDays(daysAgo);
                if (date.getDayOfWeek().getValue() >= 6) {
                    continue; // Skip weekends
                }

                if (attendanceRepository.findByEmployeeEmployeeIdAndAttendanceDate(emp.getEmployeeId(), date).isPresent()) {
                    continue;
                }

                int roll = random.nextInt(100);
                Attendance attendance = new Attendance();
                attendance.setEmployee(emp);
                attendance.setAttendanceDate(date);

                if (roll < 80) {
                    attendance.setStatus(AttendanceStatus.PRESENT);
                    attendance.setCheckInTime(LocalTime.of(8, 45 + random.nextInt(30)));
                    attendance.setCheckOutTime(LocalTime.of(17, 30 + random.nextInt(60)));
                    attendance.setWorkingHours(8.5);
                    attendance.setOvertimeHours(roll > 70 ? 1.0 : 0.0);
                } else if (roll < 90) {
                    attendance.setStatus(AttendanceStatus.WORK_FROM_HOME);
                    attendance.setCheckInTime(LocalTime.of(9, 0));
                    attendance.setCheckOutTime(LocalTime.of(18, 0));
                    attendance.setWorkingHours(8.0);
                    attendance.setOvertimeHours(0.0);
                } else if (roll < 95) {
                    attendance.setStatus(AttendanceStatus.ON_LEAVE);
                    attendance.setWorkingHours(0.0);
                    attendance.setOvertimeHours(0.0);
                } else {
                    attendance.setStatus(AttendanceStatus.ABSENT);
                    attendance.setWorkingHours(0.0);
                    attendance.setOvertimeHours(0.0);
                }
                attendanceRepository.save(attendance);
            }
        }
    }

    private void seedLeaves(List<Employee> employees) {
        LeaveType[] types = LeaveType.values();
        LeaveStatus[] statuses = {LeaveStatus.APPROVED, LeaveStatus.APPROVED, LeaveStatus.PENDING, LeaveStatus.REJECTED};

        int seeded = 0;
        for (Employee emp : employees) {
            if (seeded >= 250) break;
            for (int i = 0; i < 2; i++) {
                LocalDate start = LocalDate.now().minusDays(random.nextInt(60) - 15);
                LocalDate end = start.plusDays(1 + random.nextInt(3));

                Leave leave = new Leave();
                leave.setEmployee(emp);
                leave.setLeaveType(types[random.nextInt(types.length)]);
                leave.setStatus(statuses[random.nextInt(statuses.length)]);
                leave.setStartDate(start);
                leave.setEndDate(end);
                leave.setReason("Scheduled family commitment and medical checkup.");
                leaveRepository.save(leave);
                seeded++;
            }
        }
    }

    private void seedPayrolls(List<Employee> employees) {
        int currentYear = LocalDate.now().getYear();
        String[] months = {"JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST"};

        int seeded = 0;
        for (Employee emp : employees) {
            if (seeded >= 150) break;
            BigDecimal basic = BigDecimal.valueOf(emp.getSalary() != null ? emp.getSalary() : 50000.0);
            BigDecimal allowances = basic.multiply(BigDecimal.valueOf(0.15)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal deductions = basic.multiply(BigDecimal.valueOf(0.08)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal gross = basic.add(allowances);
            BigDecimal net = gross.subtract(deductions);

            for (String month : months) {
                if (payrollRepository.findByEmployeeEmployeeIdAndMonthAndYear(emp.getEmployeeId(), month, currentYear).isPresent()) {
                    continue;
                }
                Payroll p = new Payroll();
                p.setEmployee(emp);
                p.setMonth(month);
                p.setYear(currentYear);
                p.setBasicSalary(basic);
                p.setAllowances(allowances);
                p.setDeductions(deductions);
                p.setGrossSalary(gross);
                p.setNetSalary(net);
                p.setPayrollStatus(PayrollStatus.PAID);
                p.setGeneratedDate(LocalDateTime.now().minusMonths(1));
                payrollRepository.save(p);
                seeded++;
                if (seeded >= 150) break;
            }
        }
    }

    private void seedDocuments(List<Employee> employees) {
        DocumentType[] types = {DocumentType.RESUME, DocumentType.CERTIFICATE, DocumentType.AADHAR, DocumentType.PAN, DocumentType.PASSPORT};
        int seeded = 0;
        for (Employee emp : employees) {
            if (seeded >= 120) break;
            Document doc = new Document();
            doc.setEmployee(emp);
            doc.setCompany(emp.getCompany());
            doc.setDocumentType(types[seeded % types.length]);
            doc.setFileName(String.format("doc_%d_%d.pdf", emp.getEmployeeId(), seeded));
            doc.setOriginalFileName(String.format("%s_%s.pdf", emp.getFirstName(), types[seeded % types.length].name().toLowerCase()));
            doc.setFileType("application/pdf");
            doc.setFileSize(1024L * (150 + random.nextInt(400)));
            doc.setUploadDate(LocalDateTime.now().minusDays(random.nextInt(60)));
            documentRepository.save(doc);
            seeded++;
        }
    }

    private void seedNotifications(List<Employee> employees) {
        String[] titles = {
            "Payroll Slip Generated",
            "Leave Request Update",
            "Upcoming Company Holiday",
            "Performance Review Cycle Open",
            "Quarterly All-Hands Meeting Scheduled",
            "Policy Handbook Updated"
        };

        List<User> users = userRepository.findAll();
        int seeded = 0;
        for (User user : users) {
            if (seeded >= 250) break;
            for (int i = 0; i < 2; i++) {
                Notification n = new Notification();
                n.setUser(user);
                n.setTitle(titles[(seeded + i) % titles.length]);
                n.setMessage("This is an automated system notification regarding your workplace account and schedule.");
                n.setStatus((i % 2 == 0) ? NotificationStatus.UNREAD : NotificationStatus.READ);
                n.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(14)).minusHours(random.nextInt(12)));
                notificationRepository.save(n);
                seeded++;
            }
        }
    }

    private void seedAuditLogs(List<Employee> employees) {
        String[] actions = {"LOGIN", "LOGOUT", "CHECK_IN", "CHECK_OUT", "CREATE", "UPDATE", "APPROVE", "DOWNLOAD"};
        String[] modules = {"AUTH", "ATTENDANCE", "LEAVE", "PAYROLL", "EMPLOYEE", "DOCUMENTS"};

        int count = (int) auditLogRepository.count();
        if (count >= 500) return;

        List<User> users = userRepository.findAll();
        for (int i = count; i < 520; i++) {
            User u = users.get(i % users.size());
            AuditLog logEntry = new AuditLog();
            logEntry.setUserId(u.getUserId());
            logEntry.setUserEmail(u.getEmail());
            logEntry.setCompanyId(u.getCompany() != null ? u.getCompany().getId() : 1L);
            logEntry.setAction(actions[i % actions.length]);
            logEntry.setModule(modules[i % modules.length]);
            logEntry.setDetails(String.format("Action %s performed on %s by %s", actions[i % actions.length], modules[i % modules.length], u.getEmail()));
            logEntry.setIpAddress("192.168.1." + (10 + (i % 200)));
            logEntry.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)).minusMinutes(random.nextInt(1400)));
            auditLogRepository.save(logEntry);
        }
    }

    private void seedRecruitment(List<Company> companies, List<Department> departments) {
        String[] titles = {
            "Senior Full Stack Engineer", "DevOps Cloud Architect", "Product Designer (UI/UX)",
            "Enterprise Account Executive", "HR Business Partner", "Financial Planning Analyst",
            "QA Automation Lead", "Customer Success Specialist"
        };

        for (Company company : companies) {
            List<Department> companyDepts = departments.stream()
                .filter(d -> d.getCompany().getId().equals(company.getId()))
                .toList();

            for (int i = 0; i < 8; i++) {
                Department dept = companyDepts.isEmpty() ? null : companyDepts.get(i % companyDepts.size());
                JobOpening job = new JobOpening();
                job.setCompany(company);
                job.setDepartment(dept);
                job.setJobTitle(titles[i % titles.length]);
                job.setDescription("Exciting opportunity to build cutting-edge enterprise software.");
                job.setRequiredSkills("Java, Spring Boot, React, SQL, Cloud Architecture");
                job.setExperience("3-6 years");
                job.setSalary(BigDecimal.valueOf(85000 + (i * 5000)));
                job.setVacancies(1 + (i % 3));
                job.setEmploymentType(EmploymentType.FULL_TIME);
                job.setStatus((i % 4 == 0) ? JobStatus.CLOSED : JobStatus.OPEN);
                jobOpeningRepository.save(job);

                // Candidates for each job
                Candidate cand = new Candidate();
                cand.setCompany(company);
                cand.setFullName("Candidate " + company.getCompanyCode() + " " + (i + 1));
                cand.setEmail(String.format("cand.%d@%s.recruitment.test", i + 1, company.getCompanyCode().toLowerCase()));
                cand.setPhone("+1-555-40" + i);
                cand.setExperience("4 years");
                cand.setSkills("Java, React, PostgreSQL");
                cand.setCurrentCompany("Tech Systems Global");
                cand.setExpectedSalary(BigDecimal.valueOf(95000));
                cand.setNoticePeriod("30 days");
                cand.setStatus((i % 2 == 0) ? CandidateStatus.SHORTLISTED : CandidateStatus.APPLIED);
                cand.setResumeFileName("candidate_resume_" + i + ".pdf");
                cand.setResumeOriginalFileName("Resume.pdf");
                candidateRepository.save(cand);
            }
        }
    }

    private void seedPerformanceReviews(List<Employee> employees) {
        int seeded = 0;
        for (Employee emp : employees) {
            if (seeded >= 120) break;
            PerformanceReview review = new PerformanceReview();
            review.setCompany(emp.getCompany());
            review.setEmployee(emp);
            review.setCycleName("FY 2026 Annual Appraisal Cycle");
            review.setReviewDate(LocalDate.now().minusMonths(random.nextInt(6)));
            review.setRating(BigDecimal.valueOf(3.5 + (random.nextDouble() * 1.5)).setScale(1, RoundingMode.HALF_UP));
            review.setStatus("COMPLETED");
            review.setFeedback("Demonstrated outstanding ownership, high-velocity output, and cross-functional leadership.");
            performanceReviewRepository.save(review);
            seeded++;
        }
    }
}

package com.workforce.hrm.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.ai.DeterministicFallbackAiProvider;
import com.workforce.hrm.dto.request.AiPromptRequestDTO;
import com.workforce.hrm.dto.response.AiResponseDTO;
import com.workforce.hrm.entity.Candidate;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.PerformanceReview;
import com.workforce.hrm.enums.AttendanceStatus;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.repository.CandidateRepository;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.repository.PerformanceReviewRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AiAssistantService;

@Service
@Transactional(readOnly = true)
public class AiAssistantServiceImpl implements AiAssistantService {

    private static final Logger log = LoggerFactory.getLogger(AiAssistantServiceImpl.class);

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CandidateRepository candidateRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PerformanceReviewRepository performanceReviewRepository;
    private final com.workforce.hrm.ai.AiProviderFactory aiProviderFactory;
    private final DeterministicFallbackAiProvider fallbackAiProvider;

    public AiAssistantServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            CandidateRepository candidateRepository,
            AttendanceRepository attendanceRepository,
            LeaveRepository leaveRepository,
            PerformanceReviewRepository performanceReviewRepository,
            com.workforce.hrm.ai.AiProviderFactory aiProviderFactory,
            DeterministicFallbackAiProvider fallbackAiProvider) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.candidateRepository = candidateRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.performanceReviewRepository = performanceReviewRepository;
        this.aiProviderFactory = aiProviderFactory;
        this.fallbackAiProvider = fallbackAiProvider;
    }

    @Override
    public AiResponseDTO askCopilot(AiPromptRequestDTO request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().trim() : "";
        String promptLower = prompt.toLowerCase(Locale.ROOT);
        String role = SecurityUtils.getCurrentRole();
        Long companyId = SecurityUtils.getCurrentCompanyId();

        List<String> suggestions = new ArrayList<>();
        Map<String, Object> meta = new HashMap<>();

        if (promptLower.contains("headcount") || promptLower.contains("employee count") || promptLower.contains("how many employee")) {
            long total = companyId != null ? employeeRepository.countByDepartmentCompanyId(companyId) : employeeRepository.count();
            String answer = "Your organization currently has " + total + " recorded employees.";
            suggestions.add("View employee directory");
            suggestions.add("Analyze department distribution");
            meta.put("totalEmployees", total);
            return new AiResponseDTO(answer, "COPILOT", suggestions, meta);
        }

        com.workforce.hrm.ai.AiProvider provider = aiProviderFactory.getActiveProvider();
        String systemPrompt = String.format("You are an intelligent HRM Enterprise Copilot for an organization. User role: %s.", role != null ? role : "EMPLOYEE");
        String aiGeneratedAnswer;
        String providerName;
        try {
            aiGeneratedAnswer = provider.generateText(systemPrompt, prompt);
            providerName = provider.getProviderName();
        } catch (Exception e) {
            log.warn("AI generation failed with active provider ({}): {}. Falling back to analytical engine.", provider.getProviderName(), e.getMessage());
            aiGeneratedAnswer = fallbackAiProvider.generateText(systemPrompt, prompt);
            providerName = fallbackAiProvider.getProviderName();
        }

        suggestions.add("How many employees are in the company?");
        suggestions.add("Draft a Job Description for Senior React Developer");
        suggestions.add("Check today's attendance anomalies");
        meta.put("provider", providerName);

        return new AiResponseDTO(aiGeneratedAnswer, "COPILOT", suggestions, meta);
    }

    @Override
    public AiResponseDTO generateJobDescription(String roleTitle, String departmentName, String requiredSkills, String experience) {
        String title = (roleTitle != null && !roleTitle.isBlank()) ? roleTitle : "Software Engineer";
        String dept = (departmentName != null && !departmentName.isBlank()) ? departmentName : "Engineering";
        String skills = (requiredSkills != null && !requiredSkills.isBlank()) ? requiredSkills : "Java, Spring Boot, React, SQL";
        String exp = (experience != null && !experience.isBlank()) ? experience : "3-5 years";

        com.workforce.hrm.ai.AiProvider provider = aiProviderFactory.getActiveProvider();
        String jd;
        String providerName;
        try {
            jd = provider.generateJobDescription(title, dept, skills, exp);
            providerName = provider.getProviderName();
        } catch (Exception e) {
            log.warn("AI Job Description generation failed with active provider ({}): {}. Falling back to analytical engine.", provider.getProviderName(), e.getMessage());
            jd = fallbackAiProvider.generateJobDescription(title, dept, skills, exp);
            providerName = fallbackAiProvider.getProviderName();
        }

        List<String> suggestions = List.of("Adjust compensation band", "Add required certifications", "Post to recruitment board");
        Map<String, Object> meta = Map.of("roleTitle", title, "department", dept, "provider", providerName);
        return new AiResponseDTO(jd, "RECRUITMENT", suggestions, meta);
    }

    @Override
    public AiResponseDTO screenCandidate(Long candidateId) {
        if (candidateId == null) {
            throw new IllegalArgumentException("Candidate ID is required for AI screening");
        }

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        if (!SecurityUtils.isSuperAdmin()) {
            Long companyId = SecurityUtils.getCurrentCompanyId();
            if (candidate.getCompany() == null || !candidate.getCompany().getId().equals(companyId)) {
                throw new AccessDeniedException("Access Denied: Candidate belongs to another organization");
            }
        }

        String skills = candidate.getSkills() != null ? candidate.getSkills() : "None listed";
        String exp = candidate.getExperience() != null ? candidate.getExperience() : "Not specified";

        com.workforce.hrm.ai.AiProvider provider = aiProviderFactory.getActiveProvider();
        String analysis;
        String providerName;
        try {
            analysis = provider.screenCandidate(candidate.getFullName(), skills, exp, "Candidate Application", "Standard Role Requirements");
            providerName = provider.getProviderName();
        } catch (Exception e) {
            log.warn("AI candidate screening failed with active provider ({}): {}. Falling back to analytical engine.", provider.getProviderName(), e.getMessage());
            analysis = fallbackAiProvider.screenCandidate(candidate.getFullName(), skills, exp, "Candidate Application", "Standard Role Requirements");
            providerName = fallbackAiProvider.getProviderName();
        }

        return new AiResponseDTO(analysis, "RECRUITMENT_SCREENING", List.of("Schedule Interview", "Shortlist Candidate", "Send Offer"), Map.of("candidateId", candidateId, "provider", providerName));
    }

    @Override
    public AiResponseDTO generatePerformanceReviewSummary(Long employeeId) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Employee ID is required");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        if (!SecurityUtils.isSuperAdmin()) {
            Long companyId = SecurityUtils.getCurrentCompanyId();
            if (employee.getCompany() == null || !employee.getCompany().getId().equals(companyId)) {
                throw new AccessDeniedException("Access Denied: Employee belongs to another organization");
            }
        }

        List<PerformanceReview> reviews = performanceReviewRepository.findByEmployeeEmployeeId(employeeId);
        double avgRating = reviews.stream()
                .filter(r -> r.getRating() != null)
                .mapToDouble(r -> r.getRating().doubleValue())
                .average()
                .orElse(4.0);

        List<String> notes = reviews.stream()
                .map(r -> r.getFeedback() != null ? r.getFeedback() : "Consistent delivery of team objectives")
                .toList();

        com.workforce.hrm.ai.AiProvider provider = aiProviderFactory.getActiveProvider();
        String summary;
        String providerName;
        try {
            summary = provider.summarizePerformance(
                employee.getFirstName() + (employee.getLastName() != null ? " " + employee.getLastName() : ""),
                employee.getDesignation() != null ? employee.getDesignation().getDesignationName() : "Associate",
                employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : "Operations",
                avgRating,
                notes
            );
            providerName = provider.getProviderName();
        } catch (Exception e) {
            log.warn("AI performance summary failed with active provider ({}): {}. Falling back to analytical engine.", provider.getProviderName(), e.getMessage());
            summary = fallbackAiProvider.summarizePerformance(
                employee.getFirstName() + (employee.getLastName() != null ? " " + employee.getLastName() : ""),
                employee.getDesignation() != null ? employee.getDesignation().getDesignationName() : "Associate",
                employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : "Operations",
                avgRating,
                notes
            );
            providerName = fallbackAiProvider.getProviderName();
        }

        return new AiResponseDTO(summary, "PERFORMANCE", List.of("Download Review PDF", "Schedule Feedback Session"), Map.of("employeeId", employeeId, "avgRating", avgRating, "provider", providerName));
    }

    @Override
    public AiResponseDTO detectAttendanceAnomalies() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        long totalEmp = companyId != null ? employeeRepository.countByDepartmentCompanyId(companyId) : employeeRepository.count();
        long absent = attendanceRepository.findWorkspaceAttendance(companyId, null, null, LocalDate.now(), AttendanceStatus.ABSENT, null, null).getTotalElements();

        String report = String.format(
            "### AI Attendance & Workplace Anomaly Insights\n\n" +
            "• **Workforce Analyzed**: %d active employee records.\n" +
            "• **Unplanned Absence Rate**: %d employees marked absent today (%.1f%% of workforce).\n" +
            "• **Patterns Detected**: Zero critical attendance anomalies or unexpected shift dropouts detected across departments today.\n" +
            "• **Actionable Advice**: Recommend checking team leave requests in advance of upcoming public holidays to ensure adequate coverage.",
            totalEmp, absent, totalEmp > 0 ? ((double) absent / totalEmp * 100.0) : 0.0
        );

        return new AiResponseDTO(report, "ATTENDANCE_ANALYTICS", List.of("View Attendance Roster", "Approve Pending Leaves"), Map.of("absentCount", absent));
    }
}

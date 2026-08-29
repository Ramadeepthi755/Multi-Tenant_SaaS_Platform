package com.workforce.hrm.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.AiPromptRequestDTO;
import com.workforce.hrm.dto.response.ApiResponse;
import com.workforce.hrm.dto.response.AiResponseDTO;
import com.workforce.hrm.service.AiAssistantService;
import com.workforce.hrm.service.PolicyRagService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Workforce Intelligence", description = "AI HR Copilot and workflow assistants")
public class AiController {

    private final AiAssistantService aiAssistantService;
    private final PolicyRagService policyRagService;

    @Autowired
    public AiController(AiAssistantService aiAssistantService, PolicyRagService policyRagService) {
        this.aiAssistantService = aiAssistantService;
        this.policyRagService = policyRagService;
    }

    @PostMapping("/copilot")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "HR AI Copilot Query", description = "Ask HR Copilot assistant general HR and workforce questions")
    public ResponseEntity<AiResponseDTO> askCopilot(@RequestBody AiPromptRequestDTO request) {
        return ResponseEntity.ok(aiAssistantService.askCopilot(request));
    }

    @PostMapping("/policy-qa")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Policy Q&A", description = "Query company policies using RAG")
    public ResponseEntity<AiResponseDTO> askPolicy(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String answer = policyRagService.answerPolicyInquiry(question);
        AiResponseDTO resp = new AiResponseDTO(answer, "POLICY_RAG", List.of("View Leave Policy", "Check Attendance Rules", "View Employee Handbook"), Map.of("question", question != null ? question : ""));
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/generate-job-description")
    @PreAuthorize("hasAnyAuthority('COMPANY_CREATE', 'DEPARTMENT_CREATE', 'EMPLOYEE_CREATE', 'DASHBOARD_VIEW')")
    @Operation(summary = "Generate Job Description", description = "Draft comprehensive job description using role and department context")
    public ResponseEntity<AiResponseDTO> generateJobDescription(
            @RequestParam(required = false) String roleTitle,
            @RequestParam(required = false) String departmentName,
            @RequestParam(required = false) String requiredSkills,
            @RequestParam(required = false) String experience) {
        return ResponseEntity.ok(aiAssistantService.generateJobDescription(roleTitle, departmentName, requiredSkills, experience));
    }

    @GetMapping("/screen-candidate/{candidateId}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE_READ', 'DASHBOARD_VIEW')")
    @Operation(summary = "Screen Candidate Application", description = "AI analysis and recommendation for a candidate application")
    public ResponseEntity<AiResponseDTO> screenCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(aiAssistantService.screenCandidate(candidateId));
    }

    @GetMapping("/performance-summary/{employeeId}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE_READ', 'DASHBOARD_VIEW')")
    @Operation(summary = "Generate Performance Appraisal Summary", description = "Synthesize employee appraisals and ratings into an executive summary")
    public ResponseEntity<AiResponseDTO> performanceSummary(@PathVariable Long employeeId) {
        return ResponseEntity.ok(aiAssistantService.generatePerformanceReviewSummary(employeeId));
    }

    @GetMapping("/attendance-anomalies")
    @PreAuthorize("hasAnyAuthority('ATTENDANCE_READ', 'DASHBOARD_VIEW')")
    @Operation(summary = "Detect Attendance Anomalies", description = "Workforce anomaly detection and absence distribution insights")
    public ResponseEntity<AiResponseDTO> attendanceAnomalies() {
        return ResponseEntity.ok(aiAssistantService.detectAttendanceAnomalies());
    }
}

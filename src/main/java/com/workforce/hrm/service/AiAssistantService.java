package com.workforce.hrm.service;

import com.workforce.hrm.dto.request.AiPromptRequestDTO;
import com.workforce.hrm.dto.response.AiResponseDTO;

public interface AiAssistantService {

    AiResponseDTO askCopilot(AiPromptRequestDTO request);

    AiResponseDTO generateJobDescription(String roleTitle, String departmentName, String requiredSkills, String experience);

    AiResponseDTO screenCandidate(Long candidateId);

    AiResponseDTO generatePerformanceReviewSummary(Long employeeId);

    AiResponseDTO detectAttendanceAnomalies();
}

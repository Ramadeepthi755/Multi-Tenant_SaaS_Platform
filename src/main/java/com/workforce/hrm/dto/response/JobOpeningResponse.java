package com.workforce.hrm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.workforce.hrm.enums.EmploymentType;
import com.workforce.hrm.enums.JobStatus;

public record JobOpeningResponse(
        Long jobId,
        String jobTitle,
        Long departmentId,
        String departmentName,
        String description,
        String requiredSkills,
        String experience,
        BigDecimal salary,
        Integer vacancies,
        EmploymentType employmentType,
        JobStatus status,
        LocalDateTime createdAt) {
}

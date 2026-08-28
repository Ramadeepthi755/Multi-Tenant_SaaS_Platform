package com.workforce.hrm.dto.request;

import java.math.BigDecimal;

import com.workforce.hrm.enums.EmploymentType;
import com.workforce.hrm.enums.JobStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record JobOpeningRequest(
        @NotBlank(message = "Job title is required") String jobTitle,
        Long departmentId,
        String description,
        String requiredSkills,
        String experience,
        @DecimalMin(value = "0.0", inclusive = true, message = "Salary cannot be negative") BigDecimal salary,
        @NotNull(message = "Vacancies are required") @Min(value = 1, message = "At least one vacancy is required") Integer vacancies,
        @NotNull(message = "Employment type is required") EmploymentType employmentType,
        JobStatus status) {
}

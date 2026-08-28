package com.workforce.hrm.dto.request;

import java.math.BigDecimal;

import com.workforce.hrm.enums.CandidateStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CandidateRequest(
        @NotBlank(message = "Candidate name is required") String fullName,
        @NotBlank(message = "Candidate email is required") @Email(message = "A valid candidate email is required") String email,
        String phone,
        String experience,
        String skills,
        String currentCompany,
        @DecimalMin(value = "0.0", inclusive = true, message = "Expected salary cannot be negative") BigDecimal expectedSalary,
        String noticePeriod,
        CandidateStatus status) {
}

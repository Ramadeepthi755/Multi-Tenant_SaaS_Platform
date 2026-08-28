package com.workforce.hrm.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record OfferRequest(
        @NotNull(message = "Candidate is required") Long candidateId,
        String designation,
        String department,
        LocalDate joiningDate,
        @DecimalMin(value = "0.0", inclusive = true, message = "Salary cannot be negative") BigDecimal salary) {
}

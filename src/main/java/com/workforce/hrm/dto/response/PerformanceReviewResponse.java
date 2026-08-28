package com.workforce.hrm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PerformanceReviewResponse(
        Long performanceReviewId,
        Long employeeId,
        String employeeCode,
        String employeeName,
        String departmentName,
        String cycleName,
        LocalDate reviewDate,
        BigDecimal rating,
        String status,
        String feedback) {
}

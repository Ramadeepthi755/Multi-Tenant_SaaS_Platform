package com.workforce.hrm.dto.response;

public record LeaveSummaryDTO(
        long total,
        long pending,
        long approved,
        long rejected) {
}

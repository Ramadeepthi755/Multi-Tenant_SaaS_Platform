package com.workforce.hrm.dto.response;

import java.time.LocalDate;

public record AttendanceSummaryDTO(
        LocalDate date,
        long total,
        long present,
        long absent,
        long late,
        long halfDay,
        long onLeave) {
}

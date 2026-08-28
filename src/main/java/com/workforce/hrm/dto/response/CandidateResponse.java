package com.workforce.hrm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.workforce.hrm.enums.CandidateStatus;

public record CandidateResponse(
        Long candidateId,
        String fullName,
        String email,
        String phone,
        String experience,
        String skills,
        String currentCompany,
        BigDecimal expectedSalary,
        String noticePeriod,
        CandidateStatus status,
        String resumeUrl,
        String resumeOriginalFileName,
        LocalDateTime createdAt) {
}

package com.workforce.hrm.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.response.PerformanceReviewResponse;

public interface PerformanceReviewService {

    Page<PerformanceReviewResponse> getReviews(Long employeeId, Long departmentId,
            String status, String search, LocalDate fromDate, LocalDate toDate, Pageable pageable);
}

package com.workforce.hrm.service.impl;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.response.PerformanceReviewResponse;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.PerformanceReview;
import com.workforce.hrm.repository.PerformanceReviewRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.PerformanceReviewService;

@Service
@Transactional(readOnly = true)
public class PerformanceReviewServiceImpl implements PerformanceReviewService {

    private final PerformanceReviewRepository performanceReviewRepository;

    public PerformanceReviewServiceImpl(PerformanceReviewRepository performanceReviewRepository) {
        this.performanceReviewRepository = performanceReviewRepository;
    }

    @Override
    public Page<PerformanceReviewResponse> getReviews(Long employeeId, Long departmentId,
            String status, String search, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException("From date cannot be after to date");
        }
        Long companyId = SecurityUtils.isSuperAdmin() ? null : requiredCompanyId();
        String normalizedStatus = normalize(status);
        String normalizedSearch = normalize(search);
        return performanceReviewRepository.search(companyId, employeeId, departmentId,
                normalizedStatus, fromDate, toDate, normalizedSearch, pageable).map(this::toResponse);
    }

    private PerformanceReviewResponse toResponse(PerformanceReview review) {
        Employee employee = review.getEmployee();
        String employeeName = String.join(" ",
                employee.getFirstName() == null ? "" : employee.getFirstName(),
                employee.getLastName() == null ? "" : employee.getLastName()).trim();
        return new PerformanceReviewResponse(review.getPerformanceReviewId(), employee.getEmployeeId(),
                employee.getEmployeeCode(), employeeName,
                employee.getDepartment() == null ? null : employee.getDepartment().getDepartmentName(),
                review.getCycleName(), review.getReviewDate(), review.getRating(), review.getStatus(),
                review.getFeedback());
    }

    private Long requiredCompanyId() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        if (companyId == null) {
            throw new AccessDeniedException("No company assigned to the current user");
        }
        return companyId;
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}

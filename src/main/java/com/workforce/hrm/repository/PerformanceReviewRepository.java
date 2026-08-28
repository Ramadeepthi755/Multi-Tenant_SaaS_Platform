package com.workforce.hrm.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.PerformanceReview;

public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {

    @Query("""
            SELECT p
            FROM PerformanceReview p
            WHERE (:companyId IS NULL OR p.company.id = :companyId)
              AND (:employeeId IS NULL OR p.employee.employeeId = :employeeId)
              AND (:departmentId IS NULL OR p.employee.department.departmentId = :departmentId)
              AND (:status IS NULL OR UPPER(p.status) = UPPER(:status))
              AND (:fromDate IS NULL OR p.reviewDate >= :fromDate)
              AND (:toDate IS NULL OR p.reviewDate <= :toDate)
              AND (
                    :search IS NULL
                    OR LOWER(p.cycleName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(p.employee.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(p.employee.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(p.employee.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<PerformanceReview> search(
            @Param("companyId") Long companyId,
            @Param("employeeId") Long employeeId,
            @Param("departmentId") Long departmentId,
            @Param("status") String status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("search") String search,
            Pageable pageable);
}

package com.workforce.hrm.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.enums.LeaveStatus;

public interface LeaveRepository
        extends JpaRepository<Leave, Long> {

    // =========================================================
    // PAGINATED COMPANY LEAVES
    // =========================================================

    Page<Leave> findByEmployeeDepartmentCompanyId(
            Long companyId,
            Pageable pageable);


    // =========================================================
    // PAGINATED EMPLOYEE LEAVES
    // =========================================================

    Page<Leave> findByEmployeeEmployeeId(
            Long employeeId,
            Pageable pageable);


    Page<Leave>
    findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(
            Long employeeId,
            Long companyId,
            Pageable pageable);


    // =========================================================
    // PAGINATED STATUS
    // =========================================================

    Page<Leave> findByStatus(
            LeaveStatus status,
            Pageable pageable);


    Page<Leave>
    findByStatusAndEmployeeDepartmentCompanyId(
            LeaveStatus status,
            Long companyId,
            Pageable pageable);


    // =========================================================
    // NON-PAGINATED QUERIES
    // =========================================================

    List<Leave> findByEmployeeEmployeeId(
            Long employeeId);


    List<Leave>
    findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(
            Long employeeId,
            Long companyId);


    List<Leave> findByStatus(
            LeaveStatus status);


    List<Leave>
    findByStatusAndEmployeeDepartmentCompanyId(
            LeaveStatus status,
            Long companyId);


    List<Leave>
    findByEmployeeDepartmentCompanyId(
            Long companyId);


    // =========================================================
    // TODAY'S LEAVE
    // =========================================================

    @Query("""
        SELECT COUNT(l)
        FROM Leave l
        WHERE l.startDate <= :today
          AND l.endDate >= :today
          AND l.status = :status
        """)
    long countTodayLeaveQuery(
            @Param("today") LocalDate today,
            @Param("status") LeaveStatus status);


    // =========================================================
    // TODAY'S LEAVE BY COMPANY
    // =========================================================

    @Query("""
        SELECT COUNT(l)
        FROM Leave l
        WHERE l.startDate <= :today
          AND l.endDate >= :today
          AND l.status = :status
          AND l.employee.department.company.id = :companyId
        """)
    long countTodayLeaveByCompanyIdQuery(
            @Param("today") LocalDate today,
            @Param("companyId") Long companyId,
            @Param("status") LeaveStatus status);


    // =========================================================
    // DASHBOARD METHODS
    // =========================================================

    default long countTodayLeave() {

        return countTodayLeaveQuery(
                LocalDate.now(),
                LeaveStatus.APPROVED);
    }


    default long countTodayLeaveByCompanyId(
            Long companyId) {

        if (companyId == null) {
            return 0L;
        }

        return countTodayLeaveByCompanyIdQuery(
                LocalDate.now(),
                companyId,
                LeaveStatus.APPROVED);
    }
}
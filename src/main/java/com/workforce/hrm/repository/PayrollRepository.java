package com.workforce.hrm.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Payroll;
import com.workforce.hrm.enums.PayrollStatus;

public interface PayrollRepository
        extends JpaRepository<Payroll, Long> {

    @Query("""
            SELECT p
            FROM Payroll p
            WHERE (:companyId IS NULL OR p.employee.company.id = :companyId)
              AND (:employeeId IS NULL OR p.employee.employeeId = :employeeId)
              AND (:departmentId IS NULL OR p.employee.department.departmentId = :departmentId)
              AND (:status IS NULL OR p.payrollStatus = :status)
              AND (:month IS NULL OR LOWER(p.month) = LOWER(:month))
              AND (:year IS NULL OR p.year = :year)
            """)
    Page<Payroll> findWorkspacePayrolls(
            @Param("companyId") Long companyId,
            @Param("employeeId") Long employeeId,
            @Param("departmentId") Long departmentId,
            @Param("status") PayrollStatus status,
            @Param("month") String month,
            @Param("year") Integer year,
            Pageable pageable);

    // =========================================================
    // EMPLOYEE PAYROLL
    // =========================================================

    List<Payroll> findByEmployeeEmployeeId(
            Long employeeId);


    // =========================================================
    // DUPLICATE PAYROLL CHECK
    // =========================================================

    Optional<Payroll>
            findByEmployeeEmployeeIdAndMonthAndYear(
                    Long employeeId,
                    String month,
                    Integer year);


    // =========================================================
    // MULTI-TENANT - GET ALL PAYROLL BY COMPANY
    // =========================================================

    List<Payroll> findByEmployeeDepartmentCompanyId(
            Long companyId);


    // =========================================================
    // MULTI-TENANT - EMPLOYEE PAYROLL
    // =========================================================

    List<Payroll>
            findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(
                    Long employeeId,
                    Long companyId);


    // =========================================================
    // MULTI-TENANT - PAYROLL BY ID
    // =========================================================

    Optional<Payroll>
            findByPayrollIdAndEmployeeDepartmentCompanyId(
                    Long payrollId,
                    Long companyId);


    // =========================================================
    // GLOBAL PAYROLL TREND
    // SUPER_ADMIN DASHBOARD
    // =========================================================

    @Query("""
            SELECT
                p.month,
                SUM(p.netSalary)
            FROM Payroll p
            WHERE p.year = YEAR(CURRENT_DATE)
            GROUP BY p.month
            ORDER BY MIN(p.generatedDate)
            """)
    List<Object[]> getPayrollTrend();


    // =========================================================
    // COMPANY PAYROLL TREND
    // COMPANY_ADMIN / HR DASHBOARD
    // =========================================================

    @Query("""
            SELECT
                p.month,
                SUM(p.netSalary)
            FROM Payroll p
            WHERE p.year = YEAR(CURRENT_DATE)
            AND p.employee.department.company.id = :companyId
            GROUP BY p.month
            ORDER BY MIN(p.generatedDate)
            """)
    List<Object[]> getPayrollTrendByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // GLOBAL CURRENT MONTH PAYROLL
    // SUPER_ADMIN DASHBOARD
    // =========================================================

    @Query("""
            SELECT COALESCE(SUM(p.netSalary), 0)
            FROM Payroll p
            WHERE p.month = :month
            AND p.year = :year
            """)
    BigDecimal getCurrentMonthPayroll(
            @Param("month") String month,
            @Param("year") Integer year);


    // =========================================================
    // COMPANY CURRENT MONTH PAYROLL
    // COMPANY_ADMIN / HR DASHBOARD
    // =========================================================

    @Query("""
            SELECT COALESCE(SUM(p.netSalary), 0)
            FROM Payroll p
            WHERE p.month = :month
            AND p.year = :year
            AND p.employee.department.company.id = :companyId
            """)
    BigDecimal getCurrentMonthPayrollByCompanyId(
            @Param("month") String month,
            @Param("year") Integer year,
            @Param("companyId") Long companyId);
}

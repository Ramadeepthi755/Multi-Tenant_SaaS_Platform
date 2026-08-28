package com.workforce.hrm.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.EmployeeStatus;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {


    // =========================================================
    // BASIC TENANT QUERIES
    // =========================================================

    List<Employee> findByDepartmentCompanyId(
            Long companyId);


    Optional<Employee> findByEmployeeIdAndDepartmentCompanyId(
            Long employeeId,
            Long companyId);


    // =========================================================
    // EMPLOYEE CODE / EMAIL
    // =========================================================

    boolean existsByEmployeeCode(
            String employeeCode);

    boolean existsByEmail(
            String email);

    Optional<Employee> findByEmployeeCode(
            String employeeCode);

    Optional<Employee> findByEmail(String email);

    @Query("""
            SELECT e
            FROM Employee e
            WHERE (:companyId IS NULL OR e.company.id = :companyId)
              AND (:status IS NULL OR e.status = :status)
              AND (:departmentId IS NULL OR e.department.departmentId = :departmentId)
              AND (:designationId IS NULL OR e.designation.designationId = :designationId)
              AND (
                    :search IS NULL
                    OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(e.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Employee> findWorkspaceEmployees(
            @Param("companyId") Long companyId,
            @Param("status") EmployeeStatus status,
            @Param("departmentId") Long departmentId,
            @Param("designationId") Long designationId,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT e
            FROM Employee e
            WHERE (:companyId IS NULL OR e.company.id = :companyId)
              AND (:status IS NULL OR e.status = :status)
              AND (:departmentId IS NULL OR e.department.departmentId = :departmentId)
              AND (:designationId IS NULL OR e.designation.designationId = :designationId)
              AND (:fromDate IS NULL OR e.joiningDate >= :fromDate)
              AND (:toDate IS NULL OR e.joiningDate <= :toDate)
              AND (
                    :search IS NULL
                    OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(e.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Employee> findWorkspaceEmployeesForReport(
            @Param("companyId") Long companyId,
            @Param("status") EmployeeStatus status,
            @Param("departmentId") Long departmentId,
            @Param("designationId") Long designationId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("search") String search,
            Pageable pageable);


    // =========================================================
    // STATUS
    // =========================================================

    long countByStatus(
            EmployeeStatus status);


    long countByStatusAndDepartmentCompanyId(
            EmployeeStatus status,
            Long companyId);


    List<Employee> findByStatus(
            EmployeeStatus status);


    List<Employee> findByStatusAndDepartmentCompanyId(
            EmployeeStatus status,
            Long companyId);


    // =========================================================
    // TOTAL EMPLOYEE COUNT - TENANT
    // =========================================================

    long countByDepartmentCompanyId(
            Long companyId);


    // =========================================================
    // GENDER DISTRIBUTION - GLOBAL
    // SUPER ADMIN
    // =========================================================

    @Query("""
            SELECT e.gender, COUNT(e)
            FROM Employee e
            GROUP BY e.gender
            """)
    List<Object[]> getGenderDistribution();


    // =========================================================
    // GENDER DISTRIBUTION - COMPANY
    // =========================================================

    @Query("""
            SELECT e.gender, COUNT(e)
            FROM Employee e
            WHERE e.department.company.id = :companyId
            GROUP BY e.gender
            """)
    List<Object[]> getGenderDistributionByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // JOINED THIS MONTH - GLOBAL
    // =========================================================

    @Query("""
            SELECT COUNT(e)
            FROM Employee e
            WHERE MONTH(e.joiningDate) = MONTH(CURRENT_DATE)
            AND YEAR(e.joiningDate) = YEAR(CURRENT_DATE)
            """)
    Long countEmployeesJoinedThisMonth();


    // =========================================================
    // JOINED THIS MONTH - COMPANY
    // =========================================================

    @Query("""
            SELECT COUNT(e)
            FROM Employee e
            WHERE e.department.company.id = :companyId
            AND MONTH(e.joiningDate) = MONTH(CURRENT_DATE)
            AND YEAR(e.joiningDate) = YEAR(CURRENT_DATE)
            """)
    Long countEmployeesJoinedThisMonthByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // RESIGNED THIS MONTH - GLOBAL
    // =========================================================

    @Query("""
            SELECT COUNT(e)
            FROM Employee e
            WHERE e.resignationDate IS NOT NULL
            AND MONTH(e.resignationDate) = MONTH(CURRENT_DATE)
            AND YEAR(e.resignationDate) = YEAR(CURRENT_DATE)
            """)
    Long countEmployeesResignedThisMonth();


    // =========================================================
    // RESIGNED THIS MONTH - COMPANY
    // =========================================================

    @Query("""
            SELECT COUNT(e)
            FROM Employee e
            WHERE e.department.company.id = :companyId
            AND e.resignationDate IS NOT NULL
            AND MONTH(e.resignationDate) = MONTH(CURRENT_DATE)
            AND YEAR(e.resignationDate) = YEAR(CURRENT_DATE)
            """)
    Long countEmployeesResignedThisMonthByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // DEPARTMENT DISTRIBUTION - GLOBAL
    // =========================================================

    @Query("""
            SELECT d.departmentName, COUNT(e)
            FROM Employee e
            JOIN e.department d
            GROUP BY d.departmentName
            """)
    List<Object[]> getDepartmentWiseEmployeeCount();


    // =========================================================
    // DEPARTMENT DISTRIBUTION - COMPANY
    // =========================================================

    @Query("""
            SELECT d.departmentName, COUNT(e)
            FROM Employee e
            JOIN e.department d
            WHERE d.company.id = :companyId
            GROUP BY d.departmentName
            """)
    List<Object[]> getDepartmentWiseEmployeeCountByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // RECENT EMPLOYEES - GLOBAL
    // =========================================================

    List<Employee>
            findTop5ByOrderByJoiningDateDesc();


    // =========================================================
    // RECENT EMPLOYEES - COMPANY
    // =========================================================

    List<Employee>
            findTop5ByDepartmentCompanyIdOrderByJoiningDateDesc(
                    Long companyId);


    // =========================================================
    // UPCOMING BIRTHDAYS - GLOBAL
    // =========================================================

    @Query("""
            SELECT e
            FROM Employee e
            WHERE e.dateOfBirth IS NOT NULL
            ORDER BY MONTH(e.dateOfBirth),
                     DAY(e.dateOfBirth)
            """)
    List<Employee> getUpcomingBirthdays();


    // =========================================================
    // UPCOMING BIRTHDAYS - COMPANY
    // =========================================================

    @Query("""
            SELECT e
            FROM Employee e
            WHERE e.department.company.id = :companyId
            AND e.dateOfBirth IS NOT NULL
            ORDER BY MONTH(e.dateOfBirth),
                     DAY(e.dateOfBirth)
            """)
    List<Employee> getUpcomingBirthdaysByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // WORK ANNIVERSARIES - GLOBAL
    // =========================================================

    @Query("""
            SELECT e
            FROM Employee e
            WHERE e.joiningDate IS NOT NULL
            AND MONTH(e.joiningDate) = MONTH(CURRENT_DATE)
            AND DAY(e.joiningDate) = DAY(CURRENT_DATE)
            """)
    List<Employee> getWorkAnniversaries();


    // =========================================================
    // WORK ANNIVERSARIES - COMPANY
    // =========================================================

    @Query("""
            SELECT e
            FROM Employee e
            WHERE e.department.company.id = :companyId
            AND e.joiningDate IS NOT NULL
            AND MONTH(e.joiningDate) = MONTH(CURRENT_DATE)
            AND DAY(e.joiningDate) = DAY(CURRENT_DATE)
            """)
    List<Employee> getWorkAnniversariesByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // EMPLOYEE GROWTH TREND - GLOBAL
    // =========================================================

    @Query("""
            SELECT MONTH(e.joiningDate),
                   COUNT(e)
            FROM Employee e
            WHERE e.joiningDate IS NOT NULL
            AND YEAR(e.joiningDate) = YEAR(CURRENT_DATE)
            GROUP BY MONTH(e.joiningDate)
            ORDER BY MONTH(e.joiningDate)
            """)
    List<Object[]> employeeGrowthTrend();


    // =========================================================
    // EMPLOYEE GROWTH TREND - COMPANY
    // =========================================================

    @Query("""
            SELECT MONTH(e.joiningDate),
                   COUNT(e)
            FROM Employee e
            WHERE e.department.company.id = :companyId
            AND e.joiningDate IS NOT NULL
            AND YEAR(e.joiningDate) = YEAR(CURRENT_DATE)
            GROUP BY MONTH(e.joiningDate)
            ORDER BY MONTH(e.joiningDate)
            """)
    List<Object[]> employeeGrowthTrendByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // RESIGNATION TREND - GLOBAL
    // =========================================================

    @Query("""
            SELECT MONTH(e.resignationDate),
                   COUNT(e)
            FROM Employee e
            WHERE e.resignationDate IS NOT NULL
            AND YEAR(e.resignationDate) = YEAR(CURRENT_DATE)
            GROUP BY MONTH(e.resignationDate)
            ORDER BY MONTH(e.resignationDate)
            """)
    List<Object[]> resignationTrend();


    // =========================================================
    // RESIGNATION TREND - COMPANY
    // =========================================================

    @Query("""
            SELECT MONTH(e.resignationDate),
                   COUNT(e)
            FROM Employee e
            WHERE e.department.company.id = :companyId
            AND e.resignationDate IS NOT NULL
            AND YEAR(e.resignationDate) = YEAR(CURRENT_DATE)
            GROUP BY MONTH(e.resignationDate)
            ORDER BY MONTH(e.resignationDate)
            """)
    List<Object[]> resignationTrendByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // COMPANY WISE EMPLOYEES
    // SUPER ADMIN DASHBOARD ONLY
    // =========================================================

    @Query("""
            SELECT c.companyName,
                   COUNT(e)
            FROM Employee e
            JOIN e.department d
            JOIN d.company c
            GROUP BY c.id, c.companyName
            ORDER BY c.companyName
            """)
    List<Object[]> companyWiseEmployees();


    // =========================================================
    // DEPARTMENT
    // =========================================================

    List<Employee> findByDepartmentDepartmentId(
            Long departmentId);


    List<Employee>
            findByDepartmentDepartmentIdAndDepartmentCompanyId(
                    Long departmentId,
                    Long companyId);


    // =========================================================
    // DESIGNATION
    // =========================================================

    List<Employee> findByDesignationDesignationId(
            Long designationId);


    // =========================================================
    // SEARCH - GLOBAL
    // =========================================================

    List<Employee>
            findByFirstNameContainingIgnoreCase(
                    String name);


    Page<Employee>
            findByFirstNameContainingIgnoreCase(
                    String keyword,
                    Pageable pageable);


    // =========================================================
    // SEARCH - TENANT
    // =========================================================

    Page<Employee>
            findByFirstNameContainingIgnoreCaseAndDepartmentCompanyId(
                    String keyword,
                    Long companyId,
                    Pageable pageable);
}

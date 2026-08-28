package com.workforce.hrm.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Attendance;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    @Query("""
            SELECT a
            FROM Attendance a
            WHERE (:companyId IS NULL OR a.employee.company.id = :companyId)
              AND (:employeeId IS NULL OR a.employee.employeeId = :employeeId)
              AND (:departmentId IS NULL OR a.employee.department.departmentId = :departmentId)
              AND (:date IS NULL OR a.attendanceDate = :date)
              AND (:status IS NULL OR a.status = :status)
              AND (
                    :search IS NULL
                    OR LOWER(a.employee.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(a.employee.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(a.employee.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Attendance> findWorkspaceAttendance(
            @Param("companyId") Long companyId,
            @Param("employeeId") Long employeeId,
            @Param("departmentId") Long departmentId,
            @Param("date") LocalDate date,
            @Param("status") com.workforce.hrm.enums.AttendanceStatus status,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT a
            FROM Attendance a
            WHERE (:companyId IS NULL OR a.employee.company.id = :companyId)
              AND (:employeeId IS NULL OR a.employee.employeeId = :employeeId)
              AND (:departmentId IS NULL OR a.employee.department.departmentId = :departmentId)
              AND (:fromDate IS NULL OR a.attendanceDate >= :fromDate)
              AND (:toDate IS NULL OR a.attendanceDate <= :toDate)
              AND (:status IS NULL OR a.status = :status)
              AND (
                    :search IS NULL
                    OR LOWER(a.employee.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(a.employee.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(a.employee.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Attendance> findWorkspaceAttendanceInDateRange(
            @Param("companyId") Long companyId,
            @Param("employeeId") Long employeeId,
            @Param("departmentId") Long departmentId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("status") com.workforce.hrm.enums.AttendanceStatus status,
            @Param("search") String search,
            Pageable pageable);

    java.util.Optional<Attendance> findByEmployeeEmployeeIdAndAttendanceDate(
            Long employeeId,
            LocalDate attendanceDate);


    // =========================================================
    // TODAY PRESENT EMPLOYEES - GLOBAL
    // SUPER_ADMIN
    // =========================================================

    @Query("""
            SELECT COUNT(a)
            FROM Attendance a
            WHERE a.attendanceDate = CURRENT_DATE
            AND a.status =
                com.workforce.hrm.enums.AttendanceStatus.PRESENT
            """)
    Long todayPresentEmployees();


    // =========================================================
    // TODAY PRESENT EMPLOYEES - COMPANY
    // =========================================================

    @Query("""
            SELECT COUNT(a)
            FROM Attendance a
            WHERE a.attendanceDate = CURRENT_DATE
            AND a.status =
                com.workforce.hrm.enums.AttendanceStatus.PRESENT
            AND a.employee.department.company.id = :companyId
            """)
    Long todayPresentEmployeesByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // LATE LOGINS - GLOBAL
    // =========================================================

    @Query("""
            SELECT COUNT(a)
            FROM Attendance a
            WHERE a.checkInTime > :time
            AND a.attendanceDate = CURRENT_DATE
            """)
    Long countLateLogins(
            @Param("time") LocalTime time);


    // =========================================================
    // LATE LOGINS - COMPANY
    // =========================================================

    @Query("""
            SELECT COUNT(a)
            FROM Attendance a
            WHERE a.checkInTime > :time
            AND a.attendanceDate = CURRENT_DATE
            AND a.employee.department.company.id = :companyId
            """)
    Long countLateLoginsByCompanyId(
            @Param("time") LocalTime time,
            @Param("companyId") Long companyId);


    // =========================================================
    // TODAY ATTENDANCE - GLOBAL
    // SUPER_ADMIN DASHBOARD
    // =========================================================

    @Query("""
            SELECT COUNT(a)
            FROM Attendance a
            WHERE a.attendanceDate = CURRENT_DATE
            """)
    Long countTodayAttendance();


    // =========================================================
    // TODAY ATTENDANCE - COMPANY
    // COMPANY DASHBOARD
    // =========================================================

    @Query("""
            SELECT COUNT(a)
            FROM Attendance a
            WHERE a.attendanceDate = CURRENT_DATE
            AND a.employee.department.company.id = :companyId
            """)
    Long countTodayAttendanceByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // GET ATTENDANCE BY EMPLOYEE
    // =========================================================

    List<Attendance> findByEmployeeEmployeeId(
            Long employeeId);


    // =========================================================
    // GET ATTENDANCE BY DATE
    // =========================================================

    List<Attendance> findByAttendanceDate(
            LocalDate date);


    // =========================================================
    // ALL ATTENDANCE BY COMPANY
    // =========================================================

    List<Attendance>
            findByEmployeeDepartmentCompanyId(
                    Long companyId);


    // =========================================================
    // ATTENDANCE BY DATE + COMPANY
    // =========================================================

    List<Attendance>
            findByAttendanceDateAndEmployeeDepartmentCompanyId(
                    LocalDate date,
                    Long companyId);


    // =========================================================
    // ATTENDANCE BY EMPLOYEE + COMPANY
    // =========================================================

    List<Attendance>
            findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(
                    Long employeeId,
                    Long companyId);
}

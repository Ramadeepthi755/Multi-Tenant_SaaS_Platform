package com.workforce.hrm.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Attendance;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {


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
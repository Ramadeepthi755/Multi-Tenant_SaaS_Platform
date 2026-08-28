package com.workforce.hrm.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.request.AttendanceRequestDTO;
import com.workforce.hrm.dto.response.AttendanceResponseDTO;
import com.workforce.hrm.dto.response.AttendanceSummaryDTO;
import com.workforce.hrm.enums.AttendanceStatus;

public interface AttendanceService {

    // =========================================================
    // CREATE
    // =========================================================

    AttendanceResponseDTO createAttendance(
            AttendanceRequestDTO request);


    // =========================================================
    // GET ALL
    // =========================================================

    Page<AttendanceResponseDTO> getAttendance(
            LocalDate date,
            Long employeeId,
            Long departmentId,
            AttendanceStatus status,
            String search,
            Pageable pageable);

    Page<AttendanceResponseDTO> getAttendanceForDateRange(
            LocalDate fromDate,
            LocalDate toDate,
            Long employeeId,
            Long departmentId,
            AttendanceStatus status,
            String search,
            Pageable pageable);

    AttendanceSummaryDTO getAttendanceSummary(LocalDate date);

    List<AttendanceResponseDTO> getAllAttendance();


    // =========================================================
    // GET BY ID
    // =========================================================

    AttendanceResponseDTO getAttendanceById(
            Long id);


    // =========================================================
    // UPDATE
    // =========================================================

    AttendanceResponseDTO updateAttendance(
            Long id,
            AttendanceRequestDTO request);


    // =========================================================
    // DELETE
    // =========================================================

    void deleteAttendance(
            Long id);


    // =========================================================
    // GET BY EMPLOYEE
    // =========================================================

    List<AttendanceResponseDTO> getAttendanceByEmployee(
            Long employeeId);


    // =========================================================
    // GET BY DATE
    // =========================================================

    List<AttendanceResponseDTO> getAttendanceByDate(
            LocalDate date);


    // =========================================================
    // CHECK IN
    // =========================================================

    AttendanceResponseDTO checkIn(
            Long employeeId);


    // =========================================================
    // CHECK OUT
    // =========================================================

    AttendanceResponseDTO checkOut(
            Long employeeId);

    AttendanceResponseDTO checkInCurrentUser();

    AttendanceResponseDTO checkOutCurrentUser();

    AttendanceResponseDTO getCurrentUserTodayAttendance();
}

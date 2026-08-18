package com.workforce.hrm.service;

import java.time.LocalDate;
import java.util.List;

import com.workforce.hrm.dto.request.AttendanceRequestDTO;
import com.workforce.hrm.dto.response.AttendanceResponseDTO;

public interface AttendanceService {

    // =========================================================
    // CREATE
    // =========================================================

    AttendanceResponseDTO createAttendance(
            AttendanceRequestDTO request);


    // =========================================================
    // GET ALL
    // =========================================================

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
}
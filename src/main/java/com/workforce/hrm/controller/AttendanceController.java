package com.workforce.hrm.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.AttendanceRequestDTO;
import com.workforce.hrm.dto.response.AttendanceResponseDTO;
import com.workforce.hrm.service.AttendanceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    // =========================================================
    // CREATE ATTENDANCE
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAuthority('ATTENDANCE_CREATE')")
    public ResponseEntity<AttendanceResponseDTO> createAttendance(
            @Valid @RequestBody AttendanceRequestDTO request) {

        AttendanceResponseDTO response =
                attendanceService.createAttendance(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // GET ALL ATTENDANCE
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<List<AttendanceResponseDTO>>
            getAllAttendance() {

        List<AttendanceResponseDTO> attendanceList =
                attendanceService.getAllAttendance();

        return ResponseEntity.ok(attendanceList);
    }

    // =========================================================
    // GET ATTENDANCE BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<AttendanceResponseDTO>
            getAttendanceById(
                    @PathVariable Long id) {

        AttendanceResponseDTO response =
                attendanceService.getAttendanceById(id);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // UPDATE ATTENDANCE
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ATTENDANCE_UPDATE')")
    public ResponseEntity<AttendanceResponseDTO>
            updateAttendance(
                    @PathVariable Long id,
                    @Valid @RequestBody
                    AttendanceRequestDTO request) {

        AttendanceResponseDTO response =
                attendanceService.updateAttendance(
                        id,
                        request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // DELETE ATTENDANCE
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ATTENDANCE_DELETE')")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // GET ATTENDANCE BY EMPLOYEE
    // =========================================================

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<List<AttendanceResponseDTO>>
            getAttendanceByEmployee(
                    @PathVariable Long employeeId) {

        List<AttendanceResponseDTO> attendanceList =
                attendanceService
                        .getAttendanceByEmployee(employeeId);

        return ResponseEntity.ok(attendanceList);
    }

    // =========================================================
    // GET ATTENDANCE BY DATE
    // =========================================================

    @GetMapping("/date")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<List<AttendanceResponseDTO>>
            getAttendanceByDate(

                    @RequestParam
                    @DateTimeFormat(
                            iso = DateTimeFormat.ISO.DATE)
                    LocalDate date) {

        List<AttendanceResponseDTO> attendanceList =
                attendanceService
                        .getAttendanceByDate(date);

        return ResponseEntity.ok(attendanceList);
    }

    // =========================================================
    // CHECK IN
    // =========================================================

    @PostMapping("/check-in/{employeeId}")
    @PreAuthorize("hasAuthority('ATTENDANCE_CREATE')")
    public ResponseEntity<AttendanceResponseDTO>
            checkIn(
                    @PathVariable Long employeeId) {

        AttendanceResponseDTO response =
                attendanceService.checkIn(employeeId);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // CHECK OUT
    // =========================================================

    @PostMapping("/check-out/{employeeId}")
    @PreAuthorize("hasAuthority('ATTENDANCE_UPDATE')")
    public ResponseEntity<AttendanceResponseDTO>
            checkOut(
                    @PathVariable Long employeeId) {

        AttendanceResponseDTO response =
                attendanceService.checkOut(employeeId);

        return ResponseEntity.ok(response);
    }
}
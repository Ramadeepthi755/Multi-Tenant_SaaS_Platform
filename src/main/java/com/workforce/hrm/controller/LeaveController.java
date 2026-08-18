package com.workforce.hrm.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.LeaveRequestDTO;
import com.workforce.hrm.dto.response.LeaveResponseDTO;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.service.LeaveService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(
            LeaveService leaveService) {

        this.leaveService = leaveService;
    }

    // =========================================================
    // GET ALL LEAVES
    // =========================================================
    //
    // GET /api/leave?page=0&size=20
    //
    // =========================================================

    @GetMapping
    public ResponseEntity<Page<LeaveResponseDTO>> getAllLeaves(
            Pageable pageable) {

        return ResponseEntity.ok(
                leaveService.getAllLeaves(
                        pageable));
    }

    // =========================================================
    // GET LEAVE BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponseDTO> getLeaveById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leaveService.getLeaveById(id));
    }

    // =========================================================
    // GET EMPLOYEE LEAVES
    // =========================================================
    //
    // GET /api/leave/employee/5?page=0&size=20
    //
    // =========================================================

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Page<LeaveResponseDTO>> getEmployeeLeaves(
            @PathVariable Long employeeId,
            Pageable pageable) {

        return ResponseEntity.ok(
                leaveService.getEmployeeLeaves(
                        employeeId,
                        pageable));
    }

    // =========================================================
    // GET BY STATUS
    // =========================================================
    //
    // GET /api/leave/status/PENDING?page=0&size=20
    //
    // =========================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<LeaveResponseDTO>> getLeavesByStatus(
            @PathVariable LeaveStatus status,
            Pageable pageable) {

        return ResponseEntity.ok(
                leaveService.getLeavesByStatus(
                        status,
                        pageable));
    }

    // =========================================================
    // CREATE LEAVE
    // =========================================================

    @PostMapping
    public ResponseEntity<LeaveResponseDTO> createLeave(
            @Valid @RequestBody LeaveRequestDTO request) {

        LeaveResponseDTO response =
                leaveService.createLeave(
                        request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // UPDATE LEAVE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<LeaveResponseDTO> updateLeave(
            @PathVariable Long id,
            @Valid @RequestBody LeaveRequestDTO request) {

        return ResponseEntity.ok(
                leaveService.updateLeave(
                        id,
                        request));
    }

    // =========================================================
    // DELETE LEAVE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeave(
            @PathVariable Long id) {

        leaveService.deleteLeave(id);

        return ResponseEntity.noContent()
                .build();
    }

    // =========================================================
    // APPROVE LEAVE
    // =========================================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveResponseDTO> approveLeave(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leaveService.approveLeave(id));
    }

    // =========================================================
    // REJECT LEAVE
    // =========================================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveResponseDTO> rejectLeave(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leaveService.rejectLeave(id));
    }
}
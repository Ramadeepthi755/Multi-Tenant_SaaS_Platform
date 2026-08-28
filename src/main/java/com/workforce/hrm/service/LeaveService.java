package com.workforce.hrm.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.request.LeaveRequestDTO;
import com.workforce.hrm.dto.response.LeaveResponseDTO;
import com.workforce.hrm.dto.response.LeaveSummaryDTO;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.enums.LeaveType;
import java.time.LocalDate;

public interface LeaveService {

    // =========================================================
    // CREATE
    // =========================================================

    LeaveResponseDTO createLeave(
            LeaveRequestDTO request);

    // =========================================================
    // GET ALL - PAGINATED
    // =========================================================

    Page<LeaveResponseDTO> getAllLeaves(
            Pageable pageable);

    Page<LeaveResponseDTO> getLeaves(
            Long employeeId,
            LeaveType leaveType,
            LeaveStatus status,
            String search,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable);

    Page<LeaveResponseDTO> getLeavesForReport(
            Long employeeId,
            Long departmentId,
            LeaveType leaveType,
            LeaveStatus status,
            String search,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable);

    LeaveSummaryDTO getLeaveSummary();

    // =========================================================
    // GET BY ID
    // =========================================================

    LeaveResponseDTO getLeaveById(
            Long id);

    // =========================================================
    // UPDATE
    // =========================================================

    LeaveResponseDTO updateLeave(
            Long id,
            LeaveRequestDTO request);

    // =========================================================
    // DELETE
    // =========================================================

    void deleteLeave(
            Long id);

    // =========================================================
    // EMPLOYEE LEAVES - PAGINATED
    // =========================================================

    Page<LeaveResponseDTO> getEmployeeLeaves(
            Long employeeId,
            Pageable pageable);

    // =========================================================
    // STATUS - PAGINATED
    // =========================================================

    Page<LeaveResponseDTO> getLeavesByStatus(
            LeaveStatus status,
            Pageable pageable);

    // =========================================================
    // APPROVE
    // =========================================================

    LeaveResponseDTO approveLeave(
            Long leaveId);

    // =========================================================
    // REJECT
    // =========================================================

    LeaveResponseDTO rejectLeave(
            Long leaveId);
}

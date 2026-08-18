package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.request.LeaveRequestDTO;
import com.workforce.hrm.dto.response.LeaveResponseDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Leave;

public class LeaveMapper {

    private LeaveMapper() {
        // Utility class
    }

    // =========================================================
    // REQUEST DTO -> ENTITY
    // =========================================================

    public static Leave toEntity(
            LeaveRequestDTO dto,
            Employee employee) {

        if (dto == null) {
            return null;
        }

        Leave leave = new Leave();

        leave.setLeaveType(dto.getLeaveType());
        leave.setStartDate(dto.getStartDate());
        leave.setEndDate(dto.getEndDate());
        leave.setReason(dto.getReason());
        leave.setEmployee(employee);

        /*
         * IMPORTANT:
         *
         * Do NOT set status here.
         *
         * New leave status is controlled by service:
         *
         * create  -> PENDING
         * approve -> APPROVED
         * reject  -> REJECTED
         */

        return leave;
    }

    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    public static LeaveResponseDTO toResponseDTO(
            Leave leave) {

        if (leave == null) {
            return null;
        }

        LeaveResponseDTO dto =
                new LeaveResponseDTO();

        dto.setLeaveId(
                leave.getLeaveId());

        dto.setLeaveType(
                leave.getLeaveType());

        dto.setStartDate(
                leave.getStartDate());

        dto.setEndDate(
                leave.getEndDate());

        dto.setReason(
                leave.getReason());

        dto.setStatus(
                leave.getStatus());

        if (leave.getEmployee() != null) {

            dto.setEmployeeId(
                    leave.getEmployee()
                            .getEmployeeId());

            String firstName =
                    leave.getEmployee()
                            .getFirstName();

            String lastName =
                    leave.getEmployee()
                            .getLastName();

            String employeeName =
                    ((firstName != null ? firstName : "")
                            + " "
                            + (lastName != null ? lastName : ""))
                            .trim();

            dto.setEmployeeName(
                    employeeName);
        }

        return dto;
    }

    // =========================================================
    // UPDATE EXISTING ENTITY
    // =========================================================

    public static void updateEntity(
            Leave leave,
            LeaveRequestDTO dto,
            Employee employee) {

        if (leave == null || dto == null) {
            return;
        }

        leave.setLeaveType(
                dto.getLeaveType());

        leave.setStartDate(
                dto.getStartDate());

        leave.setEndDate(
                dto.getEndDate());

        leave.setReason(
                dto.getReason());

        leave.setEmployee(employee);

        /*
         * IMPORTANT:
         *
         * Status is intentionally NOT updated here.
         *
         * Normal update request must never change:
         *
         * PENDING -> APPROVED
         * PENDING -> REJECTED
         *
         * Only approveLeave() / rejectLeave()
         * can change status.
         */
    }
}
package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.request.AttendanceRequestDTO;
import com.workforce.hrm.dto.response.AttendanceResponseDTO;
import com.workforce.hrm.entity.Attendance;
import com.workforce.hrm.entity.Employee;

public class AttendanceMapper {

    private AttendanceMapper() {
    }

    /**
     * Request DTO -> Entity
     */
    public static Attendance toEntity(AttendanceRequestDTO dto, Employee employee) {

        if (dto == null) {
            return null;
        }

        Attendance attendance = new Attendance();

        attendance.setAttendanceDate(dto.getAttendanceDate());
        attendance.setCheckInTime(dto.getCheckInTime());
        attendance.setCheckOutTime(dto.getCheckOutTime());
        attendance.setWorkingHours(dto.getWorkingHours());
        attendance.setOvertimeHours(dto.getOvertimeHours());
        attendance.setStatus(dto.getStatus());
        attendance.setEmployee(employee);

        return attendance;
    }

    /**
     * Entity -> Response DTO
     */
    public static AttendanceResponseDTO toResponseDTO(Attendance attendance) {

        if (attendance == null) {
            return null;
        }

        AttendanceResponseDTO dto = new AttendanceResponseDTO();

        dto.setAttendanceId(attendance.getAttendanceId());
        dto.setAttendanceDate(attendance.getAttendanceDate());
        dto.setCheckInTime(attendance.getCheckInTime());
        dto.setCheckOutTime(attendance.getCheckOutTime());
        dto.setWorkingHours(attendance.getWorkingHours());
        dto.setOvertimeHours(attendance.getOvertimeHours());
        dto.setStatus(attendance.getStatus());

        if (attendance.getEmployee() != null) {
            dto.setEmployeeId(attendance.getEmployee().getEmployeeId());
            dto.setEmployeeName(
                    attendance.getEmployee().getFirstName() + " "
                    + (attendance.getEmployee().getLastName() == null
                        ? ""
                        : attendance.getEmployee().getLastName()));
        }

        return dto;
    }

    /**
     * Update existing Entity
     */
    public static void updateEntity(Attendance attendance,
                                    AttendanceRequestDTO dto,
                                    Employee employee) {

        if (attendance == null || dto == null) {
            return;
        }

        attendance.setAttendanceDate(dto.getAttendanceDate());
        attendance.setCheckInTime(dto.getCheckInTime());
        attendance.setCheckOutTime(dto.getCheckOutTime());
        attendance.setWorkingHours(dto.getWorkingHours());
        attendance.setOvertimeHours(dto.getOvertimeHours());
        attendance.setStatus(dto.getStatus());
        attendance.setEmployee(employee);
    }

}
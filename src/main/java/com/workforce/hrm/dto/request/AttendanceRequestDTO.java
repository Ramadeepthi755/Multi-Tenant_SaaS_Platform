package com.workforce.hrm.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.workforce.hrm.enums.AttendanceStatus;

import jakarta.validation.constraints.NotNull;

public class AttendanceRequestDTO {

    @NotNull(message = "Attendance Date is required")
    private LocalDate attendanceDate;

    @NotNull(message = "Check In Time is required")
    private LocalTime checkInTime;

    private LocalTime checkOutTime;

    private Double workingHours;

    private Double overtimeHours;

    @NotNull(message = "Attendance Status is required")
    private AttendanceStatus status;

    @NotNull(message = "Employee Id is required")
    private Long employeeId;

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public LocalTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public Double getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(Double workingHours) {
        this.workingHours = workingHours;
    }

    public Double getOvertimeHours() {
        return overtimeHours;
    }

    public void setOvertimeHours(Double overtimeHours) {
        this.overtimeHours = overtimeHours;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
}
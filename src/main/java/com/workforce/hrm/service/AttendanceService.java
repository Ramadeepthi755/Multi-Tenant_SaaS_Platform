package com.workforce.hrm.service;

import java.time.LocalDate;
import java.util.List;
import com.workforce.hrm.entity.Attendance;

public interface AttendanceService {

	Attendance createAttendance(Attendance attendance);

	List<Attendance> getAllAttendance();

	Attendance getAttendanceById(Long id);

	Attendance updateAttendance(Long id, Attendance attendance);

	void deleteAttendance(Long id);
	
	List<Attendance> getAttendanceByEmployee(Long employeeId);

	List<Attendance> getAttendanceByDate(LocalDate date);

	Attendance checkIn(Long employeeId);

	Attendance checkOut(Long employeeId);
}
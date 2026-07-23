package com.workforce.hrm.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.Attendance;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.service.AttendanceService;

@Service
public class AttendanceServiceImpl implements AttendanceService {

	
	private AttendanceRepository attendanceRepository;

	@Override
	public Attendance createAttendance(Attendance attendance) {

		return attendanceRepository.save(attendance);
	}

	@Override
	public List<Attendance> getAllAttendance() {
		return attendanceRepository.findAll();
	}

	@Override
	public Attendance getAttendanceById(Long id) {

		return attendanceRepository.findById(id).orElseThrow(() -> new RuntimeException("Attendance Not Found"));
	}
	@Override
	public List<Attendance> getAttendanceByEmployee(Long employeeId) {
	    return attendanceRepository.findByEmployeeEmployeeId(employeeId);
	}

	@Override
	public List<Attendance> getAttendanceByDate(LocalDate date) {
	    return attendanceRepository.findByAttendanceDate(date);
	}

	@Override
	public Attendance checkIn(Long employeeId) {
	    throw new UnsupportedOperationException("Not implemented yet");
	}

	@Override
	public Attendance checkOut(Long employeeId) {
	    throw new UnsupportedOperationException("Not implemented yet");
	}

	@Override
	public Attendance updateAttendance(Long id, Attendance attendance) {

		Attendance existingAttendance = attendanceRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Attendance Not Found"));

		existingAttendance.setAttendanceDate(attendance.getAttendanceDate());

		existingAttendance.setCheckInTime(attendance.getCheckInTime());

		existingAttendance.setCheckOutTime(attendance.getCheckOutTime());

		existingAttendance.setWorkingHours(attendance.getWorkingHours());

		existingAttendance.setStatus(attendance.getStatus());

		return attendanceRepository.save(existingAttendance);
	}

	@Override
	public void deleteAttendance(Long id) {

		Attendance attendance = attendanceRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Attendance Not Found"));

		attendanceRepository.delete(attendance);
		attendanceRepository.countLateLogins(LocalTime.of(9, 30));
	}
}
package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.entity.Attendance;
import com.workforce.hrm.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

	private final AttendanceService attendanceService;

	public AttendanceController(AttendanceService attendanceService) {
		this.attendanceService = attendanceService;
	}

	@PostMapping
	public Attendance createAttendance(@RequestBody Attendance attendance) {

		return attendanceService.createAttendance(attendance);
	}

	@GetMapping
	public List<Attendance> getAllAttendance() {
		return attendanceService.getAllAttendance();
	}

	@GetMapping("/{id}")
	public Attendance getAttendanceById(@PathVariable Long id) {

		return attendanceService.getAttendanceById(id);
	}

	@PutMapping("/{id}")
	public Attendance updateAttendance(@PathVariable Long id, @RequestBody Attendance attendance) {

		return attendanceService.updateAttendance(id, attendance);
	}

	@DeleteMapping("/{id}")
	public void deleteAttendance(@PathVariable Long id) {

		attendanceService.deleteAttendance(id);
	}
}
package com.workforce.hrm.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.workforce.hrm.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	@Query("""
			SELECT COUNT(a)
FROM Attendance a
WHERE a.attendanceDate = CURRENT_DATE
AND a.status = com.workforce.hrm.enums.AttendanceStatus.PRESENT
			""")
	Long todayPresentEmployees();

	@Query("""
			SELECT COUNT(a)
			FROM Attendance a
			WHERE a.checkInTime > :time
			AND a.attendanceDate = CURRENT_DATE
			""")
	Long countLateLogins(LocalTime time);

	@Query("""
			SELECT COUNT(a)
			FROM Attendance a
			WHERE a.attendanceDate = CURRENT_DATE
			""")
	Long countTodayAttendance();
	
	List<Attendance> findByEmployeeEmployeeId(Long employeeId);

	List<Attendance> findByAttendanceDate(LocalDate date);

}
package com.workforce.hrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.enums.LeaveStatus;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

	@Query("""
			SELECT COUNT(l)
			FROM Leave l
			WHERE CURRENT_DATE BETWEEN l.startDate
			AND l.endDate
			AND l.status = 'APPROVED'
			""")
	Long countTodayLeave();
	
	List<Leave> findByEmployeeEmployeeId(Long employeeId);

	List<Leave> findByStatus(LeaveStatus status);

	Long countByStatus(LeaveStatus status);
}
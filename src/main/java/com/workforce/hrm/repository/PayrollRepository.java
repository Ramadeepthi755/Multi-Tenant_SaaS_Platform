package com.workforce.hrm.repository;

import java.math.BigDecimal;
import java.time.Month;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Payroll;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

	List<Payroll> findByEmployeeEmployeeId(Long employeeId);

	Optional<Payroll> findByEmployeeEmployeeIdAndMonthAndYear(Long employeeId, String month, Integer year);

	@Query("""
			SELECT
			p.month,
			SUM(p.netSalary)
			FROM Payroll p
			WHERE p.year = YEAR(CURRENT_DATE)
			GROUP BY p.month
			ORDER BY p.month
			""")
	List<Object[]> getPayrollTrend();

	@Query("""
			SELECT COALESCE(SUM(p.netSalary), 0)
			FROM Payroll p
			WHERE p.month = :month
			AND p.year = :year
			""")
	BigDecimal getCurrentMonthPayroll(@Param("month") Month month, @Param("year") Integer year);
}
package com.workforce.hrm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.EmployeeStatus;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	boolean existsByEmployeeCode(String employeeCode);

	long countByStatus(EmployeeStatus status);

	boolean existsByEmail(String email);

	@Query("""
			SELECT e.gender, COUNT(e)
			FROM Employee e
			GROUP BY e.gender
			""")
	List<Object[]> getGenderDistribution();

	@Query("""
			SELECT COUNT(e)
			FROM Employee e
			WHERE MONTH(e.joiningDate)=MONTH(CURRENT_DATE)
			            AND YEAR(e.joiningDate)=YEAR(CURRENT_DATE)
			""")
	Long countEmployeesJoinedThisMonth();

	@Query("""
			SELECT COUNT(e)
			FROM Employee e
			WHERE MONTH(e.resignationDate)=MONTH(CURRENT_DATE)
			AND YEAR(e.resignationDate)=YEAR(CURRENT_DATE)
			""")
	Long countEmployeesResignedThisMonth();

	@Query("""
			SELECT d.departmentName, COUNT(e)
			FROM Employee e
			JOIN e.department d
			GROUP BY d.departmentName
			""")
	List<Object[]> getDepartmentWiseEmployeeCount();

	List<Employee> findTop5ByOrderByJoiningDateDesc();

	@Query("""
			SELECT e
			FROM Employee e
			WHERE e.dateOfBirth IS NOT NULL
            ORDER BY MONTH(e.dateOfBirth),
            DAY(e.dateOfBirth)
			""")
	List<Employee> getUpcomingBirthdays();
	@Query("""
			SELECT e
			FROM Employee e
			WHERE e.joiningDate IS NOT NULL
			AND MONTH(e.joiningDate) = MONTH(CURRENT_DATE)
			AND DAY(e.joiningDate) = DAY(CURRENT_DATE)
			""")
	List<Employee> getWorkAnniversaries();

	@Query("""
			SELECT
			MONTH(e.joiningDate),
			COUNT(e)
			FROM Employee e
			WHERE YEAR(e.joiningDate)=YEAR(CURRENT_DATE)
			GROUP BY MONTH(e.joiningDate)
			ORDER BY MONTH(e.joiningDate)
			""")
	List<Object[]> employeeGrowthTrend();

	

	@Query("""
			SELECT
			MONTH(e.resignationDate),
			COUNT(e)
			FROM Employee e
			WHERE e.resignationDate IS NOT NULL
			AND YEAR(e.resignationDate) = YEAR(CURRENT_DATE)
			GROUP BY MONTH(e.resignationDate)
			""")
			List<Object[]> resignationTrend();

	@Query("""
			SELECT c.companyName,
			COUNT(e)
			FROM Employee e
			JOIN e.department d
			JOIN d.company c
			GROUP BY c.companyName
			""")
	List<Object[]> companyWiseEmployees();
	List<Employee> findByFirstNameContainingIgnoreCase(String name);

	List<Employee> findByStatus(EmployeeStatus status);

	List<Employee> findByDepartmentDepartmentId(Long departmentId);

	List<Employee> findByDesignationDesignationId(Long designationId);
	Optional<Employee> findByEmployeeCode(String employeeCode);

	
	Page<Employee> findByFirstNameContainingIgnoreCase(
	        String keyword,
	        Pageable pageable);

}

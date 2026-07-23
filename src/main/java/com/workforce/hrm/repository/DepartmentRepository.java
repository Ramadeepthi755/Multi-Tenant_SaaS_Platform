package com.workforce.hrm.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.workforce.hrm.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

	boolean existsByDepartmentCode(String departmentCode);

	@Query("""
			SELECT d.departmentName,
			COUNT(e)
			FROM Employee e
			JOIN e.department d
			GROUP BY d.departmentName
			ORDER BY COUNT(e) DESC
			""")
	List<Object[]> getLargestDepartments(Pageable pageable);
	List<Department> findByCompanyId(Long companyId);
}
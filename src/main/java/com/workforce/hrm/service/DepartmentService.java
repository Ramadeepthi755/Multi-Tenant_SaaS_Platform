package com.workforce.hrm.service;

import java.util.List;

import com.workforce.hrm.entity.Department;

public interface DepartmentService {

	Department createDepartment(Department department);

	List<Department> getAllDepartments();

	Department getDepartmentById(Long id);

	Department updateDepartment(Long id, Department department);

	void deleteDepartment(Long id);
	List<Department> getDepartmentsByCompany(Long companyId);
}
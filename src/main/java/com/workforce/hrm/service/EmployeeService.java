package com.workforce.hrm.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.EmployeeStatus;

public interface EmployeeService {

	Employee createEmployee(Employee employee);

	List<Employee> getAllEmployees();

	Employee getEmployeeById(Long id);

	Employee updateEmployee(Long id, Employee employee);

	void deleteEmployee(Long id);
	
	Employee getEmployeeByCode(String code);

	List<Employee> getEmployeesByDepartment(Long departmentId);

	List<Employee> getEmployeesByStatus(EmployeeStatus status);

	Page<Employee> searchEmployees(String keyword, Pageable pageable);
	Employee getEmployeeProfile(Long id);
}
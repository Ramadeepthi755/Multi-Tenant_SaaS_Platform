package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.repository.EmployeeDocumentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.service.EmployeeService;
import com.workforce.hrm.enums.EmployeeStatus;

import lombok.RequiredArgsConstructor;
@Service
public class EmployeeServiceImpl implements EmployeeService {


    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final UserRepository userRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               EmployeeDocumentRepository employeeDocumentRepository,
                               UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.employeeDocumentRepository = employeeDocumentRepository;
        this.userRepository = userRepository;
    }
	@Override
	public Employee createEmployee(Employee employee) {

		if (employeeRepository.existsByEmployeeCode(employee.getEmployeeCode())) {
			throw new RuntimeException("Employee Code Already Exists");
		}

		if (employeeRepository.existsByEmail(employee.getEmail())) {
			throw new RuntimeException("Email Already Exists");
		}

		return employeeRepository.save(employee);
	}

	@Override
	public List<Employee> getAllEmployees() {
		return employeeRepository.findAll();
	}

	@Override
	public Employee getEmployeeById(Long id) {
		return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee Not Found"));
	}

	@Override
	public Employee updateEmployee(Long id, Employee employee) {

		Employee existingEmployee = employeeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Employee Not Found"));

		existingEmployee.setEmployeeCode(employee.getEmployeeCode());
		existingEmployee.setFirstName(employee.getFirstName());
		existingEmployee.setLastName(employee.getLastName());
		existingEmployee.setEmail(employee.getEmail());
		existingEmployee.setPhone(employee.getPhone());
		existingEmployee.setGender(employee.getGender());
		existingEmployee.setDateOfBirth(employee.getDateOfBirth());
		existingEmployee.setJoiningDate(employee.getJoiningDate());
		existingEmployee.setDesignation(employee.getDesignation());
		existingEmployee.setDepartment(employee.getDepartment());
		existingEmployee.setSalary(employee.getSalary());
		existingEmployee.setStatus(employee.getStatus());

		return employeeRepository.save(existingEmployee);
	}

	@Override
	public void deleteEmployee(Long id) {

		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Employee Not Found"));

		employeeRepository.delete(employee);
	}
	@Override
	public Employee getEmployeeByCode(String code) {
	    return employeeRepository.findByEmployeeCode(code)
	            .orElseThrow(() -> new RuntimeException("Employee Not Found"));
	}

	@Override
	public List<Employee> getEmployeesByDepartment(Long departmentId) {
	    return employeeRepository.findByDepartmentDepartmentId(departmentId);
	}

	@Override
	public List<Employee> getEmployeesByStatus(EmployeeStatus status) {
	    return employeeRepository.findByStatus(status);
	}

	@Override
	public Page<Employee> searchEmployees(String keyword, Pageable pageable) {
	    return employeeRepository.findByFirstNameContainingIgnoreCase(keyword, pageable);
	}
	@Override
	public Employee getEmployeeProfile(Long id) {
	    return employeeRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Employee Not Found"));
	}
}
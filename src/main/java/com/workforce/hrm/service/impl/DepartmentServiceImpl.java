package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.Department;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.service.DepartmentService;

@Service
public class DepartmentServiceImpl implements DepartmentService {

	@Autowired
	private DepartmentRepository departmentRepository;

	@Override
	public Department createDepartment(Department department) {

		if (departmentRepository.existsByDepartmentCode(department.getDepartmentCode())) {

			throw new RuntimeException("Department Code Already Exists");
		}

		return departmentRepository.save(department);
	}

	@Override
	public List<Department> getAllDepartments() {
		return departmentRepository.findAll();
	}

	@Override
	public Department getDepartmentById(Long id) {

		return departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department Not Found"));
	}
	@Override
	public List<Department> getDepartmentsByCompany(Long companyId) {
	    return departmentRepository.findByCompanyId(companyId);
	}
	@Override
	public Department updateDepartment(Long id, Department department) {

		Department existingDepartment = departmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Department Not Found"));

		existingDepartment.setDepartmentCode(department.getDepartmentCode());

		existingDepartment.setDepartmentName(department.getDepartmentName());

		existingDepartment.setDescription(department.getDescription());

		existingDepartment.setStatus(department.getStatus());

		return departmentRepository.save(existingDepartment);
	}

	@Override
	public void deleteDepartment(Long id) {

		Department department = departmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Department Not Found"));

		departmentRepository.delete(department);
	}
}
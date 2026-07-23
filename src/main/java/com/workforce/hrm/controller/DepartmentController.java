package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.entity.Department;
import com.workforce.hrm.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

	private DepartmentService departmentService;

	@PostMapping
	public Department createDepartment(@RequestBody Department department) {

		return departmentService.createDepartment(department);
	}

	@GetMapping
	public List<Department> getAllDepartments() {
		return departmentService.getAllDepartments();
	}

	@GetMapping("/{id}")
	public Department getDepartmentById(@PathVariable Long id) {

		return departmentService.getDepartmentById(id);
		
	}

	@PutMapping("/{id}")
	public Department updateDepartment(@PathVariable Long id, @RequestBody Department department) {

		return departmentService.updateDepartment(id, department);
	}

	@DeleteMapping("/{id}")
	public void deleteDepartment(@PathVariable Long id) {

		departmentService.deleteDepartment(id);
	}
}
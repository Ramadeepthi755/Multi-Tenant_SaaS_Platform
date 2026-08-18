package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.EmployeeRequestDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.service.EmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeController(
            EmployeeService employeeService) {

        this.employeeService = employeeService;
    }


    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAuthority('EMPLOYEE_CREATE')")
    public Employee createEmployee(
            @Valid @RequestBody EmployeeRequestDTO request) {

        return employeeService.createEmployee(request);
    }


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public List<Employee> getAllEmployees() {

        return employeeService.getAllEmployees();
    }


    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public Employee getEmployeeById(
            @PathVariable Long id) {

        return employeeService.getEmployeeById(id);
    }


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE')")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return employeeService.updateEmployee(
                id,
                employee);
    }


    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_DELETE')")
    public void deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);
    }


    // =========================================================
    // EMPLOYEE PROFILE
    // =========================================================

    @GetMapping("/{id}/profile")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public Employee getEmployeeProfile(
            @PathVariable Long id) {

        return employeeService.getEmployeeProfile(id);
    }


    // =========================================================
    // GET EMPLOYEE BY CODE
    // =========================================================

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public Employee getEmployeeByCode(
            @PathVariable String code) {

        return employeeService.getEmployeeByCode(code);
    }


    // =========================================================
    // GET EMPLOYEES BY DEPARTMENT
    // =========================================================

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public List<Employee> getEmployeesByDepartment(
            @PathVariable Long departmentId) {

        return employeeService
                .getEmployeesByDepartment(departmentId);
    }


    // =========================================================
    // GET EMPLOYEES BY STATUS
    // =========================================================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public List<Employee> getEmployeesByStatus(
            @PathVariable EmployeeStatus status) {

        return employeeService
                .getEmployeesByStatus(status);
    }


    // =========================================================
    // SEARCH EMPLOYEES
    // =========================================================

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public Page<Employee> searchEmployees(
            @RequestParam String keyword,
            Pageable pageable) {

        return employeeService.searchEmployees(
                keyword,
                pageable);
    }
}
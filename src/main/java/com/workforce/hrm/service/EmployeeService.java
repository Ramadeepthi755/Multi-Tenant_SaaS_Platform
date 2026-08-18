package com.workforce.hrm.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.request.EmployeeRequestDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.EmployeeStatus;

public interface EmployeeService {

    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    Employee createEmployee(
            EmployeeRequestDTO request);


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    List<Employee> getAllEmployees();


    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    Employee getEmployeeById(
            Long id);


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    Employee updateEmployee(
            Long id,
            Employee employee);


    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    void deleteEmployee(
            Long id);


    // =========================================================
    // GET EMPLOYEE BY CODE
    // =========================================================

    Employee getEmployeeByCode(
            String code);


    // =========================================================
    // GET EMPLOYEES BY DEPARTMENT
    // =========================================================

    List<Employee> getEmployeesByDepartment(
            Long departmentId);


    // =========================================================
    // GET EMPLOYEES BY STATUS
    // =========================================================

    List<Employee> getEmployeesByStatus(
            EmployeeStatus status);


    // =========================================================
    // SEARCH EMPLOYEES
    // =========================================================

    Page<Employee> searchEmployees(
            String keyword,
            Pageable pageable);


    // =========================================================
    // EMPLOYEE PROFILE
    // =========================================================

    Employee getEmployeeProfile(
            Long id);
}
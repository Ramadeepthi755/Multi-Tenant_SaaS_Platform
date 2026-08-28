package com.workforce.hrm.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.request.EmployeeRequestDTO;
import com.workforce.hrm.dto.response.EmployeeResponseDTO;
import com.workforce.hrm.enums.EmployeeStatus;

public interface EmployeeService {

    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    EmployeeResponseDTO createEmployee(
            EmployeeRequestDTO request);


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    List<EmployeeResponseDTO> getAllEmployees();

    Page<EmployeeResponseDTO> getEmployees(
            String search,
            EmployeeStatus status,
            Long companyId,
            Long departmentId,
            Long designationId,
            Pageable pageable);

    Page<EmployeeResponseDTO> getEmployeesForReport(
            String search,
            EmployeeStatus status,
            Long departmentId,
            Long designationId,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable);


    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    EmployeeResponseDTO getEmployeeById(
            Long id);


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    EmployeeResponseDTO updateEmployee(
            Long id,
            EmployeeRequestDTO request);

    EmployeeResponseDTO updateEmployeeStatus(
            Long id,
            EmployeeStatus status);


    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    void deleteEmployee(
            Long id);


    // =========================================================
    // GET EMPLOYEE BY CODE
    // =========================================================

    EmployeeResponseDTO getEmployeeByCode(
            String code);


    // =========================================================
    // GET EMPLOYEES BY DEPARTMENT
    // =========================================================

    List<EmployeeResponseDTO> getEmployeesByDepartment(
            Long departmentId);


    // =========================================================
    // GET EMPLOYEES BY STATUS
    // =========================================================

    List<EmployeeResponseDTO> getEmployeesByStatus(
            EmployeeStatus status);


    // =========================================================
    // SEARCH EMPLOYEES
    // =========================================================

    Page<EmployeeResponseDTO> searchEmployees(
            String keyword,
            Pageable pageable);


    // =========================================================
    // EMPLOYEE PROFILE
    // =========================================================

    EmployeeResponseDTO getEmployeeProfile(
            Long id);
}

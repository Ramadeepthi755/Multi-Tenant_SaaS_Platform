package com.workforce.hrm.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.EmployeeRequestDTO;
import com.workforce.hrm.dto.response.EmployeeResponseDTO;
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
    public EmployeeResponseDTO createEmployee(
            @Valid @RequestBody EmployeeRequestDTO request) {

        return employeeService.createEmployee(request);
    }


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public Page<EmployeeResponseDTO> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EmployeeStatus status,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long designationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "employeeId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        String safeSort = switch (sortBy) {
            case "id", "employeeId", "employeeCode", "firstName", "lastName",
                    "email", "joiningDate", "status" ->
                    "id".equals(sortBy) ? "employeeId" : sortBy;
            default -> "employeeId";
        };
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC : Sort.Direction.ASC;

        return employeeService.getEmployees(
                search, status, companyId, departmentId, designationId,
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                        Sort.by(sortDirection, safeSort)));
    }


    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public EmployeeResponseDTO getEmployeeById(
            @PathVariable Long id) {

        return employeeService.getEmployeeById(id);
    }


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE')")
    public EmployeeResponseDTO updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO employee) {

        return employeeService.updateEmployee(
                id,
                employee);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE')")
    public EmployeeResponseDTO updateEmployeeStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, EmployeeStatus> request) {

        EmployeeStatus status = request.get("status");
        if (status == null) {
            throw new IllegalArgumentException("Employee status is required");
        }
        return employeeService.updateEmployeeStatus(id, status);
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
    public EmployeeResponseDTO getEmployeeProfile(
            @PathVariable Long id) {

        return employeeService.getEmployeeProfile(id);
    }


    // =========================================================
    // GET EMPLOYEE BY CODE
    // =========================================================

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public EmployeeResponseDTO getEmployeeByCode(
            @PathVariable String code) {

        return employeeService.getEmployeeByCode(code);
    }


    // =========================================================
    // GET EMPLOYEES BY DEPARTMENT
    // =========================================================

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public java.util.List<EmployeeResponseDTO> getEmployeesByDepartment(
            @PathVariable Long departmentId) {

        return employeeService
                .getEmployeesByDepartment(departmentId);
    }


    // =========================================================
    // GET EMPLOYEES BY STATUS
    // =========================================================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public java.util.List<EmployeeResponseDTO> getEmployeesByStatus(
            @PathVariable EmployeeStatus status) {

        return employeeService
                .getEmployeesByStatus(status);
    }


    // =========================================================
    // SEARCH EMPLOYEES
    // =========================================================

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public Page<EmployeeResponseDTO> searchEmployees(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return employeeService.searchEmployees(
                keyword, PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100)));
    }
}

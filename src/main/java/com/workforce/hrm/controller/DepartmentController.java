package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.dto.request.DepartmentRequestDTO;
import com.workforce.hrm.dto.response.DepartmentResponseDTO;
import com.workforce.hrm.service.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/departments")
@Validated
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('DEPARTMENT_CREATE')")
    public DepartmentResponseDTO createDepartment(
            @Valid @RequestBody DepartmentRequestDTO request) {

        return departmentService.createDepartment(request);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('DEPARTMENT_READ')")
    public List<DepartmentResponseDTO> getAllDepartments() {

        return departmentService.getAllDepartments();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_READ')")
    public DepartmentResponseDTO getDepartmentById(
            @PathVariable Long id) {

        return departmentService.getDepartmentById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_UPDATE')")
    public DepartmentResponseDTO updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequestDTO request) {

        return departmentService.updateDepartment(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_DELETE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDepartment(@PathVariable Long id) {

        departmentService.deleteDepartment(id);
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAuthority('DEPARTMENT_READ')")
    public List<DepartmentResponseDTO> getDepartmentsByCompany(
            @PathVariable Long companyId) {

        return departmentService.getDepartmentsByCompany(companyId);
    }
}
package com.workforce.hrm.service;

import java.util.List;

import com.workforce.hrm.dto.request.DepartmentRequestDTO;
import com.workforce.hrm.dto.response.DepartmentResponseDTO;

public interface DepartmentService {

    DepartmentResponseDTO createDepartment(DepartmentRequestDTO request);

    List<DepartmentResponseDTO> getAllDepartments();

    DepartmentResponseDTO getDepartmentById(Long id);

    DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO request);

    void deleteDepartment(Long id);

    List<DepartmentResponseDTO> getDepartmentsByCompany(Long companyId);
}
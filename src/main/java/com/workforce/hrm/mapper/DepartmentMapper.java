package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.request.DepartmentRequestDTO;
import com.workforce.hrm.dto.response.DepartmentResponseDTO;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;

public class DepartmentMapper {

    private DepartmentMapper() {
    }

    /**
     * Convert Request DTO -> Entity
     */
    public static Department toEntity(DepartmentRequestDTO dto, Company company) {

        if (dto == null) {
            return null;
        }

        Department department = new Department();

        department.setDepartmentCode(dto.getDepartmentCode());
        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());
        department.setStatus(dto.getStatus());
        department.setCompany(company);

        return department;
    }

    /**
     * Convert Entity -> Response DTO
     */
    public static DepartmentResponseDTO toResponseDTO(Department department) {

        if (department == null) {
            return null;
        }

        DepartmentResponseDTO dto = new DepartmentResponseDTO();

        dto.setDepartmentId(department.getDepartmentId());
        dto.setDepartmentCode(department.getDepartmentCode());
        dto.setDepartmentName(department.getDepartmentName());
        dto.setDescription(department.getDescription());
        dto.setStatus(department.getStatus());

        if (department.getCompany() != null) {
            dto.setCompanyId(department.getCompany().getId());
            dto.setCompanyName(department.getCompany().getCompanyName());
        }

        dto.setEmployeeCount(
                department.getEmployees() == null
                        ? 0L
                        : (long) department.getEmployees().size());

        return dto;
    }

    /**
     * Update existing Entity
     */
    public static void updateEntity(Department department,
                                    DepartmentRequestDTO dto,
                                    Company company) {

        if (department == null || dto == null) {
            return;
        }

        department.setDepartmentCode(dto.getDepartmentCode());
        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());
        department.setStatus(dto.getStatus());
        department.setCompany(company);
    }

}

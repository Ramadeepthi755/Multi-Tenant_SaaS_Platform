package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.request.DesignationRequestDTO;
import com.workforce.hrm.dto.response.DesignationResponseDTO;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;

public class DesignationMapper {

    private DesignationMapper() {
    }

    /**
     * Convert Request DTO to Entity
     */
    public static Designation toEntity(DesignationRequestDTO dto,
                                       Department department) {

        if (dto == null) {
            return null;
        }

        Designation designation = new Designation();

        designation.setDesignationCode(dto.getDesignationCode());
        designation.setDesignationName(dto.getDesignationName());
        designation.setDescription(dto.getDescription());
        designation.setStatus(dto.getStatus());
        designation.setDepartment(department);

        return designation;
    }

    /**
     * Convert Entity to Response DTO
     */
    public static DesignationResponseDTO toResponseDTO(
            Designation designation) {

        if (designation == null) {
            return null;
        }

        DesignationResponseDTO dto = new DesignationResponseDTO();

        dto.setDesignationId(designation.getDesignationId());
        dto.setDesignationCode(designation.getDesignationCode());
        dto.setDesignationName(designation.getDesignationName());
        dto.setDescription(designation.getDescription());
        dto.setStatus(designation.getStatus());

        if (designation.getDepartment() != null) {
            dto.setDepartmentId(
                    designation.getDepartment().getDepartmentId());
            dto.setDepartmentName(
                    designation.getDepartment().getDepartmentName());
        }

        return dto;
    }

    /**
     * Update existing Entity
     */
    public static void updateEntity(Designation designation,
                                    DesignationRequestDTO dto,
                                    Department department) {

        if (designation == null || dto == null) {
            return;
        }

        designation.setDesignationCode(dto.getDesignationCode());
        designation.setDesignationName(dto.getDesignationName());
        designation.setDescription(dto.getDescription());
        designation.setStatus(dto.getStatus());
        designation.setDepartment(department);
    }
}

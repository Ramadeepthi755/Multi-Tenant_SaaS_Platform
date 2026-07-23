package com.workforce.hrm.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeProfileResponseDTO {

    private EmployeeDTO employee;

    private CompanyDTO company;

    private DepartmentDTO department;

    private DesignationDTO designation;

    private List<EmployeeDocumentDTO> documents;

}
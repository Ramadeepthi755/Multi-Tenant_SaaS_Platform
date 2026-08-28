package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.request.EmployeeRequestDTO;
import com.workforce.hrm.dto.response.EmployeeResponseDTO;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.entity.Employee;

import java.time.LocalDate;

public class EmployeeMapper {

    private EmployeeMapper() {
    }

    /**
     * Request DTO -> Entity
     */
    public static Employee toEntity(EmployeeRequestDTO dto,
                                    Department department,
                                    Designation designation) {

        if (dto == null) {
            return null;
        }

        Employee employee = new Employee();

        employee.setEmployeeCode(dto.getEmployeeCode());
        employee.setFirstName(dto.getFirstName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(department);
        employee.setDesignation(designation);

        return employee;
    }

    /**
     * Entity -> Response DTO
     */
    public static EmployeeResponseDTO toResponseDTO(Employee employee) {

        if (employee == null) {
            return null;
        }

        EmployeeResponseDTO dto = new EmployeeResponseDTO();

        dto.setEmployeeId(employee.getEmployeeId());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setGender(employee.getGender());
        dto.setSalary(employee.getSalary());

        dto.setDateOfBirth(formatDate(employee.getDateOfBirth()));
        dto.setJoiningDate(formatDate(employee.getJoiningDate()));
        dto.setResignationDate(formatDate(employee.getResignationDate()));

        if (employee.getStatus() != null) {
            dto.setStatus(employee.getStatus().name());
        }

        if (employee.getDepartment() != null) {
            dto.setDepartmentId(employee.getDepartment().getDepartmentId());
            dto.setDepartmentName(employee.getDepartment().getDepartmentName());
        }

        if (employee.getDesignation() != null) {
            dto.setDesignationId(employee.getDesignation().getDesignationId());
            dto.setDesignationName(employee.getDesignation().getDesignationName());
        }

        if (employee.getCompany() != null) {
            dto.setCompanyId(employee.getCompany().getId());
            dto.setCompanyName(employee.getCompany().getCompanyName());
        }

        return dto;
    }

    private static String formatDate(LocalDate value) {
        return value == null ? null : value.toString();
    }

    /**
     * Update existing Entity
     */
    public static void updateEntity(Employee employee,
                                    EmployeeRequestDTO dto,
                                    Department department,
                                    Designation designation) {

        if (employee == null || dto == null) {
            return;
        }

        employee.setEmployeeCode(dto.getEmployeeCode());
        employee.setFirstName(dto.getFirstName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(department);
        employee.setDesignation(designation);
    }

}

package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;
import com.workforce.hrm.entity.Company;

public class CompanyMapper {

    private CompanyMapper() {
    }

    public static Company toEntity(CompanyRequestDTO dto) {

        if (dto == null) {
            return null;
        }

        Company company = new Company();

        company.setCompanyName(dto.getCompanyName());
        company.setCompanyCode(dto.getCompanyCode());
        company.setEmail(dto.getEmail());
        company.setPhone(dto.getPhone());
        company.setStatus(dto.getStatus());
        company.setActive(true);

        return company;
    }

    public static CompanyResponseDTO toResponseDTO(Company company) {

        if (company == null) {
            return null;
        }

        CompanyResponseDTO dto = new CompanyResponseDTO();

        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setCompanyCode(company.getCompanyCode());
        dto.setEmail(company.getEmail());
        dto.setPhone(company.getPhone());
        dto.setStatus(company.getStatus());
        dto.setActive(company.isActive());

        return dto;
    }

    public static void updateEntity(Company company, CompanyRequestDTO dto) {

        if (company == null || dto == null) {
            return;
        }

        company.setCompanyName(dto.getCompanyName());
        company.setCompanyCode(dto.getCompanyCode());
        company.setEmail(dto.getEmail());
        company.setPhone(dto.getPhone());
        company.setStatus(dto.getStatus());
    }
}
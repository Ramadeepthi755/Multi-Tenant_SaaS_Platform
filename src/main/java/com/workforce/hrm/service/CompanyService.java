package com.workforce.hrm.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;

public interface CompanyService {

    CompanyResponseDTO createCompany(
            CompanyRequestDTO request
    );

    Page<CompanyResponseDTO> getAllCompanies(
            String search,
            Pageable pageable
    );

    CompanyResponseDTO getCompanyById(
            Long id
    );

    CompanyResponseDTO updateCompany(
            Long id,
            CompanyRequestDTO request
    );

    CompanyResponseDTO activateCompany(
            Long id
    );

    CompanyResponseDTO deactivateCompany(
            Long id
    );

    void deleteCompany(
            Long id
    );

    List<CompanyResponseDTO> getAllCompanies();
}
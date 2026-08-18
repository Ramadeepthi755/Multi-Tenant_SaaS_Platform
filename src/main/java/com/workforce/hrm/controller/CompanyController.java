package com.workforce.hrm.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;

import com.workforce.hrm.service.CompanyService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/api/companies")
@Tag(
        name = "Company Management",
        description = "Company CRUD Operations"
)
public class CompanyController {

    private final CompanyService companyService;


    public CompanyController(
            CompanyService companyService) {

        this.companyService = companyService;
    }


    // =========================================================
    // CREATE COMPANY
    // =========================================================

    @Operation(
            summary = "Create Company",
            description = "Create a new company"
    )
    @PostMapping
    @PreAuthorize("hasAuthority('COMPANY_CREATE')")
    public CompanyResponseDTO createCompany(
            @Valid @RequestBody CompanyRequestDTO dto) {

        return companyService.createCompany(dto);
    }


    // =========================================================
    // GET COMPANIES
    // =========================================================

    @Operation(
            summary = "Get Companies",
            description =
                    "Fetch companies with pagination and optional search"
    )
    @GetMapping
    @PreAuthorize("hasAuthority('COMPANY_READ')")
    public Page<CompanyResponseDTO> getAllCompanies(

            @RequestParam(
                    required = false
            )
            String search,

            Pageable pageable) {

        return companyService.getAllCompanies(
                search,
                pageable
        );
    }


    // =========================================================
    // GET COMPANY BY ID
    // =========================================================

    @Operation(
            summary = "Get Company By ID"
    )
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('COMPANY_READ')")
    public CompanyResponseDTO getCompanyById(
            @PathVariable Long id) {

        return companyService.getCompanyById(id);
    }


    // =========================================================
    // UPDATE COMPANY
    // =========================================================

    @Operation(
            summary = "Update Company"
    )
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('COMPANY_UPDATE')")
    public CompanyResponseDTO updateCompany(

            @PathVariable Long id,

            @Valid
            @RequestBody CompanyRequestDTO request) {

        return companyService.updateCompany(
                id,
                request
        );
    }


    // =========================================================
    // ACTIVATE COMPANY
    // =========================================================

    @Operation(
            summary = "Activate Company",
            description = "Activate an existing company"
    )
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('COMPANY_UPDATE')")
    public CompanyResponseDTO activateCompany(
            @PathVariable Long id) {

        return companyService.activateCompany(id);
    }


    // =========================================================
    // DEACTIVATE COMPANY
    // =========================================================

    @Operation(
            summary = "Deactivate Company",
            description = "Deactivate an existing company"
    )
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('COMPANY_UPDATE')")
    public CompanyResponseDTO deactivateCompany(
            @PathVariable Long id) {

        return companyService.deactivateCompany(id);
    }


    // =========================================================
    // DELETE COMPANY
    // =========================================================

    @Operation(
            summary = "Delete Company"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('COMPANY_DELETE')")
    public String deleteCompany(
            @PathVariable Long id) {

        companyService.deleteCompany(id);

        return "Company Deleted Successfully";
    }
}
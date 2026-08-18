package com.workforce.hrm.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;

import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.User;

import com.workforce.hrm.enums.CompanyStatus;

import com.workforce.hrm.exception.ResourceNotFoundException;

import com.workforce.hrm.mapper.CompanyMapper;

import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.UserRepository;

import com.workforce.hrm.service.AuditLogService;
import com.workforce.hrm.service.CompanyService;


@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private static final Logger log =
            LoggerFactory.getLogger(CompanyServiceImpl.class);

    private final CompanyRepository companyRepository;

    private final UserRepository userRepository;

    private final AuditLogService auditLogService;


    public CompanyServiceImpl(
            CompanyRepository companyRepository,
            UserRepository userRepository,
            AuditLogService auditLogService) {

        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }


    // =========================================================
    // CREATE COMPANY
    // =========================================================

    @Override
    public CompanyResponseDTO createCompany(
            CompanyRequestDTO request) {

        log.info(
                "Creating company: {}",
                request.getCompanyName()
        );

        // Only SUPER_ADMIN can create a company
        if (!isSuperAdmin()) {

            throw new AccessDeniedException(
                    "Only SUPER_ADMIN can create a company."
            );
        }

        // Company code duplicate check
        if (companyRepository.existsByCompanyCode(
                request.getCompanyCode())) {

            log.warn(
                    "Company code already exists: {}",
                    request.getCompanyCode()
            );

            throw new IllegalArgumentException(
                    "Company Code Already Exists"
            );
        }

        // Create entity
        Company company =
                CompanyMapper.toEntity(request);

        /*
         * New companies always start ACTIVE.
         */
        company.setActive(true);

        company.setStatus(
                CompanyStatus.ACTIVE
        );

        company =
                companyRepository.save(company);

        // Audit
        saveAudit(
                "CREATE",
                "Created Company : "
                        + company.getCompanyName()
        );

        log.info(
                "Company created successfully: {}",
                company.getCompanyName()
        );

        return CompanyMapper.toResponseDTO(company);
    }


    // =========================================================
    // GET ALL COMPANIES — PAGINATED + SEARCH
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponseDTO> getAllCompanies(
            String search,
            Pageable pageable) {

        log.info(
                "Fetching companies. Page: {}, Search: '{}'",
                pageable.getPageNumber(),
                search
        );


        // -----------------------------------------------------
        // SUPER ADMIN
        // -----------------------------------------------------

        if (isSuperAdmin()) {

            Page<Company> companies;

            /*
             * No search
             */
            if (search == null || search.trim().isEmpty()) {

                companies =
                        companyRepository.findAll(pageable);

            }
            /*
             * Search requested
             */
            else {

                companies =
                        companyRepository.searchCompanies(
                                search.trim(),
                                pageable
                        );
            }

            return companies.map(
                    CompanyMapper::toResponseDTO
            );
        }


        // -----------------------------------------------------
        // NORMAL TENANT USER
        // -----------------------------------------------------

        Long companyId =
                getCurrentUserCompanyId();

        if (companyId == null) {

            throw new AccessDeniedException(
                    "User is not associated with a company."
            );
        }


        /*
         * JpaRepository.findById() does NOT accept Pageable.
         *
         * Therefore:
         * 1. Find the company
         * 2. Check search
         * 3. Return a Page containing that company
         */

        Company company =
                companyRepository
                        .findById(companyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company Not Found"
                                )
                        );


        // -----------------------------------------------------
        // SEARCH FOR TENANT USER
        // -----------------------------------------------------

        if (search != null
                && !search.trim().isEmpty()) {

            String keyword =
                    search.trim().toLowerCase();

            boolean matches =
                    containsIgnoreCase(
                            company.getCompanyName(),
                            keyword
                    )
                    || containsIgnoreCase(
                            company.getCompanyCode(),
                            keyword
                    )
                    || containsIgnoreCase(
                            company.getEmail(),
                            keyword
                    )
                    || containsIgnoreCase(
                            company.getPhone(),
                            keyword
                    );

            /*
             * Search does not match the user's company.
             */
            if (!matches) {

                return Page.empty(pageable);
            }
        }


        // -----------------------------------------------------
        // RETURN SINGLE COMPANY AS PAGE
        // -----------------------------------------------------

        CompanyResponseDTO response =
                CompanyMapper.toResponseDTO(company);

        return new PageImpl<>(
                List.of(response),
                pageable,
                1
        );
    }


    // =========================================================
    // GET ALL COMPANIES — NON PAGINATED
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> getAllCompanies() {

        log.info(
                "Fetching all accessible companies"
        );


        // SUPER ADMIN
        if (isSuperAdmin()) {

            return companyRepository
                    .findAll()
                    .stream()
                    .map(
                            CompanyMapper::toResponseDTO
                    )
                    .toList();
        }


        // TENANT USER

        Long companyId =
                getCurrentUserCompanyId();

        if (companyId == null) {

            throw new AccessDeniedException(
                    "User is not associated with a company."
            );
        }


        return companyRepository
                .findById(companyId)
                .map(
                        company ->
                                List.of(
                                        CompanyMapper
                                                .toResponseDTO(
                                                        company
                                                )
                                )
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company Not Found"
                        )
                );
    }


    // =========================================================
    // GET COMPANY BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public CompanyResponseDTO getCompanyById(
            Long id) {

        log.info(
                "Fetching company ID: {}",
                id
        );

        validateCompanyAccess(id);

        Company company =
                findCompany(id);

        return CompanyMapper.toResponseDTO(company);
    }


    // =========================================================
    // UPDATE COMPANY
    // =========================================================

    @Override
    public CompanyResponseDTO updateCompany(
            Long id,
            CompanyRequestDTO request) {

        log.info(
                "Updating company ID: {}",
                id
        );

        validateCompanyAccess(id);

        Company company =
                findCompany(id);


        /*
         * Prevent company-code collision
         * when changing company code.
         */
        if (!company
                .getCompanyCode()
                .equals(request.getCompanyCode())
                && companyRepository
                        .existsByCompanyCode(
                                request.getCompanyCode()
                        )) {

            throw new IllegalArgumentException(
                    "Company Code Already Exists"
            );
        }


        CompanyMapper.updateEntity(
                company,
                request
        );

        company =
                companyRepository.save(company);


        // Audit
        saveAudit(
                "UPDATE",
                "Updated Company : "
                        + company.getCompanyName()
        );

        log.info(
                "Company updated successfully: {}",
                company.getCompanyName()
        );

        return CompanyMapper.toResponseDTO(company);
    }


    // =========================================================
    // ACTIVATE COMPANY
    // =========================================================

    @Override
    public CompanyResponseDTO activateCompany(
            Long id) {

        log.info(
                "Activating company ID: {}",
                id
        );

        validateCompanyAccess(id);

        Company company =
                findCompany(id);

        company.setActive(true);

        company.setStatus(
                CompanyStatus.ACTIVE
        );

        company =
                companyRepository.save(company);


        // Audit
        saveAudit(
                "ACTIVATE",
                "Activated Company : "
                        + company.getCompanyName()
        );

        log.info(
                "Company activated successfully: {}",
                company.getCompanyName()
        );

        return CompanyMapper.toResponseDTO(company);
    }


    // =========================================================
    // DEACTIVATE COMPANY
    // =========================================================

    @Override
    public CompanyResponseDTO deactivateCompany(
            Long id) {

        log.info(
                "Deactivating company ID: {}",
                id
        );

        validateCompanyAccess(id);

        Company company =
                findCompany(id);

        company.setActive(false);

        company.setStatus(
                CompanyStatus.INACTIVE
        );

        company =
                companyRepository.save(company);


        // Audit
        saveAudit(
                "DEACTIVATE",
                "Deactivated Company : "
                        + company.getCompanyName()
        );

        log.info(
                "Company deactivated successfully: {}",
                company.getCompanyName()
        );

        return CompanyMapper.toResponseDTO(company);
    }


    // =========================================================
    // DELETE COMPANY
    // =========================================================

    @Override
    public void deleteCompany(
            Long id) {

        log.warn(
                "Deleting company ID: {}",
                id
        );


        /*
         * Only SUPER_ADMIN can delete
         * a company.
         */
        if (!isSuperAdmin()) {

            throw new AccessDeniedException(
                    "Only SUPER_ADMIN can delete a company."
            );
        }

        Company company =
                findCompany(id);


        companyRepository.delete(company);


        // Audit
        saveAudit(
                "DELETE",
                "Deleted Company : "
                        + company.getCompanyName()
        );

        log.info(
                "Company deleted successfully: {}",
                id
        );
    }


    // =========================================================
    // FIND COMPANY
    // =========================================================

    private Company findCompany(
            Long id) {

        return companyRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company Not Found"
                        )
                );
    }


    // =========================================================
    // TENANT ACCESS
    // =========================================================

    private void validateCompanyAccess(
            Long requestedCompanyId) {

        /*
         * SUPER_ADMIN can access every company.
         */
        if (isSuperAdmin()) {
            return;
        }


        Long currentCompanyId =
                getCurrentUserCompanyId();

        if (currentCompanyId == null) {

            throw new AccessDeniedException(
                    "User is not associated with a company."
            );
        }


        if (!currentCompanyId.equals(
                requestedCompanyId)) {

            throw new AccessDeniedException(
                    "You do not have access to this company."
            );
        }
    }


    // =========================================================
    // CURRENT USER COMPANY
    // =========================================================

    private Long getCurrentUserCompanyId() {

        String email =
                getCurrentUserEmail();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new AccessDeniedException(
                                        "Authenticated user not found."
                                )
                        );


        if (user.getCompany() == null) {
            return null;
        }


        return user
                .getCompany()
                .getId();
    }


    // =========================================================
    // CURRENT USER EMAIL
    // =========================================================

    private String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new AccessDeniedException(
                    "User is not authenticated."
            );
        }


        return authentication.getName();
    }


    // =========================================================
    // SUPER ADMIN CHECK
    // =========================================================

    private boolean isSuperAdmin() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null) {
            return false;
        }


        return authentication
                .getAuthorities()
                .stream()
                .anyMatch(
                        authority ->
                                "ROLE_SUPER_ADMIN"
                                        .equals(
                                                authority
                                                        .getAuthority()
                                        )
                );
    }


    // =========================================================
    // SEARCH HELPER
    // =========================================================

    private boolean containsIgnoreCase(
            String value,
            String keyword) {

        return value != null
                && value
                        .toLowerCase()
                        .contains(keyword);
    }


    // =========================================================
    // AUDIT
    // =========================================================

    private void saveAudit(
            String action,
            String description) {

        try {

            auditLogService.saveLog(
                    action,
                    "COMPANY",
                    description,
                    getCurrentUserEmail()
            );

        } catch (Exception ex) {

            /*
             * Audit failure should not make
             * the main company operation fail.
             */
            log.error(
                    "Audit log failed: {}",
                    ex.getMessage(),
                    ex
            );
        }
    }
}
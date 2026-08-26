package com.workforce.hrm.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.DesignationRequestDTO;
import com.workforce.hrm.dto.response.DesignationResponseDTO;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.exception.DuplicateResourceException;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.mapper.DesignationMapper;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.DesignationService;
import com.workforce.hrm.service.AuditLogService;

@Service
@Transactional
public class DesignationServiceImpl
        implements DesignationService {

    private final DesignationRepository designationRepository;
    private final DepartmentRepository departmentRepository;
    
    private final AuditLogService auditLogService;
    
    public DesignationServiceImpl(
            DesignationRepository designationRepository,
            DepartmentRepository departmentRepository,
            AuditLogService auditLogService) {

        this.designationRepository = designationRepository;
        this.departmentRepository = departmentRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public DesignationResponseDTO createDesignation(
            DesignationRequestDTO request) {

    	if (designationRepository.existsByDesignationCode(
    	        request.getDesignationCode())) {

    	    throw new DuplicateResourceException(
    	        "Designation code already exists: "
    	        + request.getDesignationCode()
    	    );
    	}

        Department department =
                getDepartmentAndValidateAccess(
                        request.getDepartmentId());

        Designation designation =
                DesignationMapper.toEntity(
                        request,
                        department);
        Designation savedDesignation =
                designationRepository.save(designation);

        auditLogService.saveLog(
                "CREATE",
                "DESIGNATION",
                "Created Designation : "
                        + savedDesignation.getDesignationName(),
                "SYSTEM");

        return DesignationMapper.toResponseDTO(
                savedDesignation);
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<DesignationResponseDTO> getAllDesignations() {

        List<Designation> designations;

        if (SecurityUtils.isSuperAdmin()) {

            designations =
                    designationRepository.findAll();

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            designations =
                    designationRepository
                            .findByDepartmentCompanyId(
                                    companyId);
        }

        return designations
                .stream()
                .map(DesignationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public DesignationResponseDTO getDesignationById(
            Long id) {

        Designation designation =
                getDesignationAndValidateAccess(id);

        return DesignationMapper.toResponseDTO(
                designation);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public DesignationResponseDTO updateDesignation(
            Long id,
            DesignationRequestDTO request) {

        Designation designation =
                getDesignationAndValidateAccess(id);

        if (!designation.getDesignationCode()
                .equals(request.getDesignationCode())
                &&
                designationRepository
                        .existsByDesignationCode(
                                request.getDesignationCode())) {

            throw new RuntimeException(
                    "Designation Code Already Exists");
        }

        /*
         * IMPORTANT:
         * Validates that requested department belongs
         * to the logged-in user's company.
         */
        Department department =
                getDepartmentAndValidateAccess(
                        request.getDepartmentId());

        DesignationMapper.updateEntity(
                designation,
                request,
                department);

        Designation updatedDesignation =
                designationRepository.save(designation);

        auditLogService.saveLog(
                "UPDATE",
                "DESIGNATION",
                "Updated Designation : "
                        + updatedDesignation.getDesignationName(),
                "SYSTEM");

        return DesignationMapper.toResponseDTO(
                updatedDesignation);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public void deleteDesignation(Long id) {

        Designation designation =
                getDesignationAndValidateAccess(id);

        designationRepository.delete(designation);

        auditLogService.saveLog(
                "DELETE",
                "DESIGNATION",
                "Deleted Designation : "
                        + designation.getDesignationName(),
                "SYSTEM");
    }

    // =========================================================
    // GET BY DEPARTMENT
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<DesignationResponseDTO> getByDepartment(
            Long departmentId) {

        /*
         * First validate whether current user is allowed
         * to access this department.
         */
        getDepartmentAndValidateAccess(departmentId);

        return designationRepository
                .findByDepartmentDepartmentId(
                        departmentId)
                .stream()
                .map(DesignationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET DESIGNATION + TENANT VALIDATION
    // =========================================================

    private Designation getDesignationAndValidateAccess(
            Long designationId) {

        Designation designation =
                designationRepository
                        .findById(designationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Designation Not Found"));

        validateDesignationCompanyAccess(
                designation);

        return designation;
    }

    // =========================================================
    // VALIDATE DESIGNATION COMPANY
    // =========================================================

    private void validateDesignationCompanyAccess(
            Designation designation) {

        if (SecurityUtils.isSuperAdmin()) {
            return;
        }

        Long currentCompanyId =
                getRequiredCurrentCompanyId();

        if (designation.getDepartment() == null ||
                designation.getDepartment()
                        .getCompany() == null ||
                designation.getDepartment()
                        .getCompany()
                        .getId() == null ||
                !currentCompanyId.equals(
                        designation
                                .getDepartment()
                                .getCompany()
                                .getId())) {

            throw new AccessDeniedException(
                    "Access Denied: Designation belongs to another company");
        }
    }

    // =========================================================
    // GET DEPARTMENT + TENANT VALIDATION
    // =========================================================

    private Department getDepartmentAndValidateAccess(
            Long departmentId) {

        Department department =
                departmentRepository
                        .findById(departmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department Not Found"));

        /*
         * SUPER_ADMIN can use departments
         * belonging to any company.
         */
        if (SecurityUtils.isSuperAdmin()) {
            return department;
        }

        Long currentCompanyId =
                getRequiredCurrentCompanyId();

        if (department.getCompany() == null ||
                department.getCompany().getId() == null ||
                !currentCompanyId.equals(
                        department.getCompany().getId())) {

            throw new AccessDeniedException(
                    "Access Denied: Department belongs to another company");
        }

        return department;
    }

    // =========================================================
    // CURRENT COMPANY
    // =========================================================

    private Long getRequiredCurrentCompanyId() {

        Long companyId =
                SecurityUtils.getCurrentCompanyId();

        if (companyId == null) {

            throw new AccessDeniedException(
                    "No company assigned to current user");
        }

        return companyId;
    }
}
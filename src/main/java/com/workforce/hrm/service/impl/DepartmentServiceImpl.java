package com.workforce.hrm.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.DepartmentRequestDTO;
import com.workforce.hrm.dto.response.DepartmentResponseDTO;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.mapper.DepartmentMapper;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.DepartmentService;
import com.workforce.hrm.service.AuditLogService;


@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final AuditLogService auditLogService;

    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            CompanyRepository companyRepository,
            AuditLogService auditLogService) {

        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.auditLogService = auditLogService;
    }
    // =========================================================
    // CREATE DEPARTMENT
    // =========================================================

    @Override
    public DepartmentResponseDTO createDepartment(
            DepartmentRequestDTO request) {

        if (departmentRepository.existsByDepartmentCode(
                request.getDepartmentCode())) {

            throw new RuntimeException(
                    "Department Code Already Exists");
        }

        Long companyId = resolveCompanyIdForWrite(
                request.getCompanyId());

        Company company = companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company Not Found"));

        Department department =
                DepartmentMapper.toEntity(
                        request,
                        company);

        Department savedDepartment =
                departmentRepository.save(department);

        auditLogService.saveLog(
                "CREATE",
                "DEPARTMENT",
                "Created Department : " + savedDepartment.getDepartmentName(),
                "SYSTEM");

        return DepartmentMapper.toResponseDTO(savedDepartment);
    }

    // =========================================================
    // GET ALL DEPARTMENTS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getAllDepartments() {

        List<Department> departments;

        if (SecurityUtils.isSuperAdmin()) {

            departments =
                    departmentRepository.findAll();

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            departments =
                    departmentRepository
                            .findByCompanyId(companyId);
        }

        return departments
                .stream()
                .map(DepartmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET DEPARTMENT BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(
            Long id) {

        Department department =
                getDepartmentAndValidateAccess(id);

        return DepartmentMapper.toResponseDTO(
                department);
    }

    // =========================================================
    // UPDATE DEPARTMENT
    // =========================================================

    @Override
    public DepartmentResponseDTO updateDepartment(
            Long id,
            DepartmentRequestDTO request) {

        Department department =
                getDepartmentAndValidateAccess(id);

        if (!department.getDepartmentCode()
                .equals(request.getDepartmentCode())
                &&
                departmentRepository
                        .existsByDepartmentCode(
                                request.getDepartmentCode())) {

            throw new RuntimeException(
                    "Department Code Already Exists");
        }

        /*
         * SUPER_ADMIN:
         * Can move/update department using requested company.
         *
         * Other users:
         * Department always stays inside their own company.
         */
        Long companyId = resolveCompanyIdForWrite(
                request.getCompanyId());

        Company company =
                companyRepository
                        .findById(companyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company Not Found"));

        DepartmentMapper.updateEntity(
                department,
                request,
                company);
        Department updatedDepartment =
                departmentRepository.save(department);

        auditLogService.saveLog(
                "UPDATE",
                "DEPARTMENT",
                "Updated Department : " + updatedDepartment.getDepartmentName(),
                "SYSTEM");

        return DepartmentMapper.toResponseDTO(updatedDepartment);
    }

    // =========================================================
    // DELETE DEPARTMENT
    // =========================================================

    @Override
    public void deleteDepartment(Long id) {

        Department department =
                getDepartmentAndValidateAccess(id);

        departmentRepository.delete(department);

        auditLogService.saveLog(
                "DELETE",
                "DEPARTMENT",
                "Deleted Department : " + department.getDepartmentName(),
                "SYSTEM");
    }

    // =========================================================
    // GET DEPARTMENTS BY COMPANY
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getDepartmentsByCompany(
            Long companyId) {

        /*
         * SUPER_ADMIN can request any company.
         */
        if (SecurityUtils.isSuperAdmin()) {

            return departmentRepository
                    .findByCompanyId(companyId)
                    .stream()
                    .map(DepartmentMapper::toResponseDTO)
                    .collect(Collectors.toList());
        }

        /*
         * Other roles cannot request another company's
         * departments.
         */
        Long currentCompanyId =
                getRequiredCurrentCompanyId();

        if (!currentCompanyId.equals(companyId)) {

            throw new AccessDeniedException(
                    "Access Denied: You cannot access another company's departments");
        }

        return departmentRepository
                .findByCompanyId(currentCompanyId)
                .stream()
                .map(DepartmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // PRIVATE - GET + VALIDATE DEPARTMENT
    // =========================================================

    private Department getDepartmentAndValidateAccess(
            Long departmentId) {

        Department department =
                departmentRepository
                        .findById(departmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department Not Found"));

        validateCompanyAccess(department);

        return department;
    }

    // =========================================================
    // PRIVATE - VALIDATE TENANT ACCESS
    // =========================================================

    private void validateCompanyAccess(
            Department department) {

        if (SecurityUtils.isSuperAdmin()) {
            return;
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
    }

    // =========================================================
    // PRIVATE - COMPANY FOR CREATE / UPDATE
    // =========================================================

    private Long resolveCompanyIdForWrite(
            Long requestedCompanyId) {

        /*
         * SUPER_ADMIN can choose company explicitly.
         */
        if (SecurityUtils.isSuperAdmin()) {

            if (requestedCompanyId == null) {

                throw new RuntimeException(
                        "Company ID is required for Super Admin");
            }

            return requestedCompanyId;
        }

        /*
         * Ignore companyId sent by frontend for
         * COMPANY_ADMIN / HR / MANAGER / EMPLOYEE.
         *
         * Always use logged-in user's company.
         */
        return getRequiredCurrentCompanyId();
    }

    // =========================================================
    // PRIVATE - CURRENT COMPANY
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
package com.workforce.hrm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workforce.hrm.entity.Designation;

public interface DesignationRepository
        extends JpaRepository<Designation, Long> {


    // =========================================================
    // DESIGNATION CODE
    // =========================================================

    boolean existsByDesignationCode(
            String designationCode);


    // =========================================================
    // DESIGNATION NAME
    // =========================================================

    boolean existsByDesignationName(
            String designationName);


    // =========================================================
    // GET DESIGNATIONS BY DEPARTMENT
    // =========================================================

    List<Designation> findByDepartmentDepartmentId(
            Long departmentId);


    // =========================================================
    // GET DESIGNATIONS BY COMPANY
    //
    // Designation -> Department -> Company
    // =========================================================

    List<Designation> findByDepartmentCompanyId(
            Long companyId);


    // =========================================================
    // GET DESIGNATION BY ID + COMPANY
    // TENANT SECURITY
    // =========================================================

    Optional<Designation>
            findByDesignationIdAndDepartmentCompanyId(
                    Long designationId,
                    Long companyId);


    // =========================================================
    // TOTAL DESIGNATIONS BY COMPANY
    // DASHBOARD
    // =========================================================

    long countByDepartmentCompanyId(
            Long companyId);


    // =========================================================
    // DESIGNATION CODE + COMPANY
    // =========================================================

    boolean existsByDesignationCodeAndDepartmentCompanyId(
            String designationCode,
            Long companyId);


    // =========================================================
    // DESIGNATION NAME + COMPANY
    // =========================================================

    boolean existsByDesignationNameAndDepartmentCompanyId(
            String designationName,
            Long companyId);


    // =========================================================
    // DEPARTMENT + COMPANY
    // TENANT-SAFE FILTER
    // =========================================================

    List<Designation>
            findByDepartmentDepartmentIdAndDepartmentCompanyId(
                    Long departmentId,
                    Long companyId);
}
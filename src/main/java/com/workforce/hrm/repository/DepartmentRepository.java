package com.workforce.hrm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workforce.hrm.entity.Department;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {


    // =========================================================
    // DEPARTMENT CODE
    // =========================================================

    boolean existsByDepartmentCode(
            String departmentCode);


    // =========================================================
    // GET DEPARTMENTS BY COMPANY
    // =========================================================

    List<Department> findByCompanyId(
            Long companyId);


    // =========================================================
    // GET DEPARTMENT BY ID + COMPANY
    // TENANT SECURITY
    // =========================================================

    Optional<Department> findByDepartmentIdAndCompanyId(
            Long departmentId,
            Long companyId);


    // =========================================================
    // DEPARTMENT COUNT BY COMPANY
    // DASHBOARD
    // =========================================================

    long countByCompanyId(
            Long companyId);


    // =========================================================
    // DEPARTMENT CODE + COMPANY
    // =========================================================

    boolean existsByDepartmentCodeAndCompanyId(
            String departmentCode,
            Long companyId);

    Optional<Department> findByDepartmentCodeAndCompanyId(
            String departmentCode,
            Long companyId);
}

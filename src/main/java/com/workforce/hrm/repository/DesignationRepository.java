package com.workforce.hrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workforce.hrm.entity.Designation;

public interface DesignationRepository extends JpaRepository<Designation, Long> {

    boolean existsByDesignationCode(String designationCode);

    boolean existsByDesignationName(String designationName);

    List<Designation> findByDepartmentDepartmentId(Long departmentId);

}
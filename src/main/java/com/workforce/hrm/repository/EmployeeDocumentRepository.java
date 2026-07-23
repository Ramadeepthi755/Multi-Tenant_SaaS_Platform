package com.workforce.hrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workforce.hrm.entity.EmployeeDocument;
import com.workforce.hrm.enums.DocumentType;

public interface EmployeeDocumentRepository extends JpaRepository<EmployeeDocument, Long> {

	List<EmployeeDocument> findByEmployeeEmployeeId(Long employeeId);
	void deleteByEmployeeEmployeeId(Long employeeId);
	List<EmployeeDocument> findByDocumentType(DocumentType type);
}
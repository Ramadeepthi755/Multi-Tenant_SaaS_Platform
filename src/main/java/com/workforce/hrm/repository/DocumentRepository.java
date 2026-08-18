package com.workforce.hrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workforce.hrm.entity.Document;
import com.workforce.hrm.enums.DocumentType;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByEmployee_EmployeeId(Long employeeId);

    List<Document> findByEmployee_EmployeeIdAndDocumentType(
            Long employeeId,
            DocumentType documentType);

    List<Document> findByCompany_Id(Long companyId);

    List<Document> findByCompany_IdAndEmployee_EmployeeId(
            Long companyId,
            Long employeeId);
}
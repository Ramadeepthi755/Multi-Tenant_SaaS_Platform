package com.workforce.hrm.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
            select d from Document d
            where (:companyId is null or d.company.id = :companyId)
              and (:employeeId is null or d.employee.employeeId = :employeeId)
              and (:documentType is null or d.documentType = :documentType)
              and (:search is null or lower(d.originalFileName) like lower(concat('%', :search, '%')))
            """)
    Page<Document> searchDocuments(
            @Param("companyId") Long companyId,
            @Param("employeeId") Long employeeId,
            @Param("documentType") DocumentType documentType,
            @Param("search") String search,
            Pageable pageable);
}

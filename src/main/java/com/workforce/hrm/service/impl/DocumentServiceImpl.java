package com.workforce.hrm.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.response.DocumentResponseDTO;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Document;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.DocumentType;
import com.workforce.hrm.exception.DocumentNotFoundException;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.mapper.DocumentMapper;
import com.workforce.hrm.repository.DocumentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AuditLogService;
import com.workforce.hrm.service.DocumentService;
import org.springframework.transaction.annotation.Transactional;
@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            EmployeeRepository employeeRepository,
            AuditLogService auditLogService) {

        this.documentRepository = documentRepository;
        this.employeeRepository = employeeRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // UPLOAD DOCUMENT
    // =========================================================

    @Override
    public DocumentResponseDTO uploadDocument(
            Long employeeId,
            DocumentType documentType,
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File cannot be empty");
        }

        if (documentType == null) {
            throw new RuntimeException("Document type is required");
        }

        Employee employee = getEmployeeAndValidateCompany(employeeId);

        Company company = employee.getCompany();

        try {

            Path uploadPath = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null || originalFileName.isBlank()) {
                originalFileName = "document";
            }

            // Remove path information from original filename
            originalFileName = Paths.get(originalFileName)
                    .getFileName()
                    .toString();

            String storedFileName =
                    UUID.randomUUID() + "_" + originalFileName;

            Path targetPath = uploadPath
                    .resolve(storedFileName)
                    .normalize();

            // Prevent path traversal
            if (!targetPath.startsWith(uploadPath)) {
                throw new RuntimeException("Invalid file path");
            }

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();

            document.setEmployee(employee);
            document.setCompany(company);

            document.setFileName(storedFileName);
            document.setOriginalFileName(originalFileName);
            document.setFileType(
                    file.getContentType() != null
                            ? file.getContentType()
                            : "application/octet-stream");

            document.setFileSize(file.getSize());
            document.setDocumentType(documentType);
            document.setUploadDate(LocalDateTime.now());

            Document savedDocument =
                    documentRepository.save(document);

            auditLogService.saveLog(
                    "UPLOAD",
                    "DOCUMENT",
                    "Uploaded "
                            + documentType
                            + " for Employee : "
                            + employee.getEmployeeCode(),
                    "SYSTEM");

            return DocumentMapper.toResponseDTO(savedDocument);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload document",
                    e);
        }
    }

    // =========================================================
    // GET ALL DOCUMENTS OF EMPLOYEE
    // =========================================================

    @Override
    public List<DocumentResponseDTO> getEmployeeDocuments(
            Long employeeId) {

        Employee employee =
                getEmployeeAndValidateCompany(employeeId);
        return documentRepository
                .findByEmployee_EmployeeId(
                        employee.getEmployeeId())
                .stream()
                .map(DocumentMapper::toResponseDTO)
                .toList();
          }

    // =========================================================
    // GET DOCUMENTS BY TYPE
    // =========================================================

    @Override
    public List<DocumentResponseDTO> getDocumentsByType(
            Long employeeId,
            DocumentType documentType) {

        Employee employee =
                getEmployeeAndValidateCompany(employeeId);

        return documentRepository
                .findByEmployee_EmployeeIdAndDocumentType(
                        employee.getEmployeeId(),
                        documentType)
                .stream()
                .map(DocumentMapper::toResponseDTO)
                .toList();
    }

    // =========================================================
    // GET DOCUMENT BY ID
    // =========================================================

    @Override
    public DocumentResponseDTO getDocumentById(
            Long documentId) {

        Document document =
                getDocumentAndValidateCompany(documentId);

        return DocumentMapper.toResponseDTO(document);
    }

    // =========================================================
    // DOWNLOAD DOCUMENT
    // =========================================================
    @Override
    @Transactional
    public byte[] downloadDocument(Long documentId) {

        Document document =
                getDocumentAndValidateCompany(documentId);

        try {

            Path uploadPath = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Path filePath = uploadPath
                    .resolve(document.getFileName())
                    .normalize();

            if (!filePath.startsWith(uploadPath)) {
                throw new RuntimeException(
                        "Invalid document path");
            }

            if (!Files.exists(filePath)) {
                throw new DocumentNotFoundException(
                        "Document file not found");
            }

            byte[] fileData = Files.readAllBytes(filePath);

            String employeeCode =
                    document.getEmployee().getEmployeeCode();

            auditLogService.saveLog(
                    "DOWNLOAD",
                    "DOCUMENT",
                    "Downloaded "
                            + document.getDocumentType()
                            + " for Employee : "
                            + employeeCode,
                    "SYSTEM");

            return fileData;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to download document",
                    e);
        }
    }
    // =========================================================
    // DELETE DOCUMENT
    // =========================================================

    @Override
    @Transactional
    public void deleteDocument(
            Long documentId) {

        Document document =
                getDocumentAndValidateCompany(documentId);

        String employeeCode =
                document.getEmployee().getEmployeeCode();

        DocumentType documentType =
                document.getDocumentType();

        try {

            Path uploadPath = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Path filePath = uploadPath
                    .resolve(document.getFileName())
                    .normalize();

            if (!filePath.startsWith(uploadPath)) {
                throw new RuntimeException(
                        "Invalid document path");
            }

            Files.deleteIfExists(filePath);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to delete document file",
                    e);
        }

        documentRepository.delete(document);

        auditLogService.saveLog(
                "DELETE",
                "DOCUMENT",
                "Deleted "
                        + documentType
                        + " for Employee : "
                        + employeeCode,
                "SYSTEM");
    }

    // =========================================================
    // EMPLOYEE + TENANT VALIDATION
    // =========================================================

    private Employee getEmployeeAndValidateCompany(
            Long employeeId) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + employeeId));

        Company company = employee.getCompany();

        if (company == null) {
            throw new RuntimeException(
                    "Employee is not assigned to a company");
        }

        Long currentCompanyId =
                SecurityUtils.getCurrentCompanyId();

        if (currentCompanyId == null) {
            throw new RuntimeException(
                    "Current company not found");
        }

        /*
         * IMPORTANT:
         *
         * Your Company entity has:
         *
         * private Long id;
         * public Long getId()
         *
         * Therefore use getId(), NOT getCompanyId().
         */
        if (!company.getId().equals(currentCompanyId)) {
            throw new RuntimeException("Access Denied");
        }

        return employee;
    }

    // =========================================================
    // DOCUMENT + TENANT VALIDATION
    // =========================================================

    private Document getDocumentAndValidateCompany(
            Long documentId) {

        Document document =
                documentRepository.findById(documentId)
                        .orElseThrow(() ->
                                new DocumentNotFoundException(
                                        "Document not found with id: "
                                                + documentId));

        Company company = document.getCompany();

        if (company == null) {
            throw new RuntimeException(
                    "Document is not assigned to a company");
        }

        Long currentCompanyId =
                SecurityUtils.getCurrentCompanyId();

        if (currentCompanyId == null) {
            throw new RuntimeException(
                    "Current company not found");
        }

        if (!company.getId().equals(currentCompanyId)) {
            throw new RuntimeException("Access Denied");
        }

        return document;
    }
}
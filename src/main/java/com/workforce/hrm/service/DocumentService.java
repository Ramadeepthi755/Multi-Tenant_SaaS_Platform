package com.workforce.hrm.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.response.DocumentResponseDTO;
import com.workforce.hrm.enums.DocumentType;

public interface DocumentService {

    Page<DocumentResponseDTO> getDocuments(
            Long employeeId,
            DocumentType documentType,
            String search,
            Pageable pageable);

    DocumentResponseDTO uploadDocument(
            Long employeeId,
            DocumentType documentType,
            MultipartFile file);

    List<DocumentResponseDTO> getEmployeeDocuments(Long employeeId);

    List<DocumentResponseDTO> getDocumentsByType(
            Long employeeId,
            DocumentType documentType);

    DocumentResponseDTO getDocumentById(Long documentId);

    byte[] downloadDocument(Long documentId);

    void deleteDocument(Long documentId);
}

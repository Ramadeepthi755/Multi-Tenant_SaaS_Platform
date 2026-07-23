package com.workforce.hrm.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.response.DocumentResponseDTO;
import com.workforce.hrm.enums.DocumentType;

public interface EmployeeDocumentService {

	DocumentResponseDTO uploadDocument(Long employeeId, MultipartFile file, DocumentType documentType);

	List<DocumentResponseDTO> getEmployeeDocuments(Long employeeId);

	Resource downloadDocument(Long documentId);

	void deleteDocument(Long documentId);
	DocumentResponseDTO getDocument(Long documentId);

}
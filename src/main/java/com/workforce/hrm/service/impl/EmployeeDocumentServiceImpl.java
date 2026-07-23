package com.workforce.hrm.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.response.DocumentResponseDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.EmployeeDocument;
import com.workforce.hrm.enums.DocumentType;
import com.workforce.hrm.exception.DocumentNotFoundException;
import com.workforce.hrm.exception.EmployeeNotFoundException;
import com.workforce.hrm.repository.EmployeeDocumentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.service.EmployeeDocumentService;
import com.workforce.hrm.service.FileStorageService;

@Service
public class EmployeeDocumentServiceImpl implements EmployeeDocumentService {

	private final EmployeeRepository employeeRepository;
	private final EmployeeDocumentRepository documentRepository;
	private final FileStorageService fileStorageService;

	public EmployeeDocumentServiceImpl(EmployeeRepository employeeRepository,
			EmployeeDocumentRepository documentRepository, FileStorageService fileStorageService) {

		this.employeeRepository = employeeRepository;
		this.documentRepository = documentRepository;
		this.fileStorageService = fileStorageService;
	}

	@Override
	public DocumentResponseDTO uploadDocument(Long employeeId, MultipartFile file, DocumentType documentType) {

		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));

		String storedFileName = fileStorageService.storeFile(file);

		EmployeeDocument document = new EmployeeDocument();

		document.setEmployee(employee);

		document.setDocumentName(file.getOriginalFilename()); // <-- FIX

		document.setFileName(storedFileName);

		document.setOriginalFileName(file.getOriginalFilename());

		document.setFileType(file.getContentType());

		document.setFileSize(file.getSize());

		document.setDocumentType(documentType);

		document.setFilePath(storedFileName);

		document.setUploadedBy(employee.getFirstName() + " " + employee.getLastName());

		EmployeeDocument savedDocument = documentRepository.save(document);

		return mapToDTO(savedDocument);
	}

	@Override
	public List<DocumentResponseDTO> getEmployeeDocuments(Long employeeId) {

		return documentRepository.findByEmployeeEmployeeId(employeeId).stream().map(this::mapToDTO)
				.collect(Collectors.toList());

	}

	@Override
	public Resource downloadDocument(Long documentId) {

		EmployeeDocument document = documentRepository.findById(documentId)
				.orElseThrow(() -> new DocumentNotFoundException("Document not found"));

		return fileStorageService.loadFile(document.getFileName());

	}

	@Override
	public void deleteDocument(Long documentId) {

		EmployeeDocument document = documentRepository.findById(documentId)
				.orElseThrow(() -> new DocumentNotFoundException("Document not found"));

		fileStorageService.deleteFile(document.getFileName());

		documentRepository.delete(document);

	}

	private DocumentResponseDTO mapToDTO(EmployeeDocument document) {

		DocumentResponseDTO dto = new DocumentResponseDTO();

		dto.setDocumentId(document.getDocumentId());
		dto.setFileName(document.getFileName());
		dto.setOriginalFileName(document.getOriginalFileName());
		dto.setFileType(document.getFileType());
		dto.setFileSize(document.getFileSize());
		dto.setDocumentType(document.getDocumentType());
		dto.setUploadDate(document.getUploadDate());

		return dto;
	}
	@Override
	public DocumentResponseDTO getDocument(Long documentId) {

	    EmployeeDocument document = documentRepository.findById(documentId)
	            .orElseThrow(() -> new DocumentNotFoundException("Document Not Found"));

	    return mapToDTO(document);
	}

}
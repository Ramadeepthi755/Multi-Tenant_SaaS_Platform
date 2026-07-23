package com.workforce.hrm.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.response.DocumentResponseDTO;
import com.workforce.hrm.entity.EmployeeDocument;
import com.workforce.hrm.enums.DocumentType;
import com.workforce.hrm.service.EmployeeDocumentService;

@RestController
@RequestMapping("/api/documents")
public class EmployeeDocumentController {

	private final EmployeeDocumentService documentService;

	public EmployeeDocumentController(EmployeeDocumentService documentService) {
		this.documentService = documentService;
	}

	@PostMapping(value = "/upload/{employeeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<DocumentResponseDTO> uploadDocument(

			@PathVariable Long employeeId,

			@RequestParam DocumentType documentType,

			@RequestParam MultipartFile file

	) throws IOException {

		return ResponseEntity.ok(documentService.uploadDocument(employeeId, file, documentType));
	}

	@GetMapping("/employee/{employeeId}")
	public ResponseEntity<List<DocumentResponseDTO>> getDocuments(@PathVariable Long employeeId) {

		return ResponseEntity.ok(documentService.getEmployeeDocuments(employeeId));
	}

	@GetMapping("/download/{documentId}")
	public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {

		Resource resource = documentService.downloadDocument(documentId);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}

	@DeleteMapping("/{documentId}")
	public ResponseEntity<String> deleteDocument(@PathVariable Long documentId) throws IOException {

		documentService.deleteDocument(documentId);

		return ResponseEntity.ok("Document deleted successfully.");
	}
}
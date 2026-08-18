package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.response.DocumentResponseDTO;
import com.workforce.hrm.enums.DocumentType;
import com.workforce.hrm.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // =========================================================
    // UPLOAD DOCUMENT
    // =========================================================

    @PostMapping(
            value = "/upload/{employeeId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('DOCUMENT_UPLOAD')")
    public ResponseEntity<DocumentResponseDTO> uploadDocument(

            @PathVariable Long employeeId,

            @RequestParam DocumentType documentType,

            @RequestPart("file") MultipartFile file) {

        DocumentResponseDTO response =
                documentService.uploadDocument(
                        employeeId,
                        documentType,
                        file);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET ALL EMPLOYEE DOCUMENTS
    // =========================================================

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('DOCUMENT_DOWNLOAD')")
    public ResponseEntity<List<DocumentResponseDTO>>
            getEmployeeDocuments(
                    @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                documentService.getEmployeeDocuments(employeeId));
    }

    // =========================================================
    // GET EMPLOYEE DOCUMENTS BY TYPE
    // =========================================================

    @GetMapping("/employee/{employeeId}/type/{documentType}")
    @PreAuthorize("hasAuthority('DOCUMENT_DOWNLOAD')")
    public ResponseEntity<List<DocumentResponseDTO>>
            getDocumentsByType(

                    @PathVariable Long employeeId,

                    @PathVariable DocumentType documentType) {

        return ResponseEntity.ok(
                documentService.getDocumentsByType(
                        employeeId,
                        documentType));
    }

    // =========================================================
    // GET DOCUMENT DETAILS
    // =========================================================

    @GetMapping("/{documentId}")
    @PreAuthorize("hasAuthority('DOCUMENT_DOWNLOAD')")
    public ResponseEntity<DocumentResponseDTO>
            getDocumentById(
                    @PathVariable Long documentId) {

        return ResponseEntity.ok(
                documentService.getDocumentById(documentId));
    }

    // =========================================================
    // DOWNLOAD DOCUMENT
    // =========================================================

    @GetMapping("/download/{documentId}")
    @PreAuthorize("hasAuthority('DOCUMENT_DOWNLOAD')")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable Long documentId) {

        DocumentResponseDTO document =
                documentService.getDocumentById(documentId);

        byte[] file =
                documentService.downloadDocument(documentId);

        String originalFileName =
                document.getOriginalFileName();

        if (originalFileName == null
                || originalFileName.isBlank()) {

            originalFileName = "document";
        }

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_OCTET_STREAM);

        headers.setContentDisposition(
                ContentDisposition
                        .attachment()
                        .filename(originalFileName)
                        .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(file);
    }

    // =========================================================
    // DELETE DOCUMENT
    // =========================================================

    @DeleteMapping("/{documentId}")
    @PreAuthorize("hasAuthority('DOCUMENT_DELETE')")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long documentId) {

        documentService.deleteDocument(documentId);

        return ResponseEntity.ok(
                "Document deleted successfully.");
    }
}
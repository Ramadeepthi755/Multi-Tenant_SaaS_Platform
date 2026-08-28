package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;

import com.workforce.hrm.enums.DocumentType;

public class DocumentResponseDTO {

	private Long documentId;
	private String fileName;
	private String originalFileName;
	private String fileType;
	private Long fileSize;
	private DocumentType documentType;
	private LocalDateTime uploadDate;
	private Long employeeId;
	private String employeeName;
	private Long companyId;

	public DocumentResponseDTO() {
	}

	public Long getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getOriginalFileName() {
		return originalFileName;
	}

	public void setOriginalFileName(String originalFileName) {
		this.originalFileName = originalFileName;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public Long getFileSize() {
		return fileSize;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}

	public DocumentType getDocumentType() {
		return documentType;
	}

	public void setDocumentType(DocumentType documentType) {
		this.documentType = documentType;
	}

	public LocalDateTime getUploadDate() {
		return uploadDate;
	}

	public void setUploadDate(LocalDateTime uploadDate) {
		this.uploadDate = uploadDate;
	}

	public Long getEmployeeId() { return employeeId; }
	public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
	public String getEmployeeName() { return employeeName; }
	public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
	public Long getCompanyId() { return companyId; }
	public void setCompanyId(Long companyId) { this.companyId = companyId; }
}

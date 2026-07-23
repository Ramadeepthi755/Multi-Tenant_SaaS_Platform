package com.workforce.hrm.dto.request;

import com.workforce.hrm.enums.DocumentType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeDocumentRequestDTO {

	private String documentName;

	private DocumentType documentType;

}
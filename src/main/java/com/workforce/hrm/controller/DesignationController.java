package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.DesignationRequestDTO;
import com.workforce.hrm.dto.response.DesignationResponseDTO;
import com.workforce.hrm.service.DesignationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/designations")
public class DesignationController {

    private final DesignationService designationService;

    public DesignationController(
            DesignationService designationService) {

        this.designationService = designationService;
    }

    // =========================================================
    // CREATE DESIGNATION
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAuthority('DESIGNATION_CREATE')")
    public ResponseEntity<DesignationResponseDTO>
            createDesignation(
                    @Valid @RequestBody
                    DesignationRequestDTO request) {

        DesignationResponseDTO response =
                designationService
                        .createDesignation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // GET ALL DESIGNATIONS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('DESIGNATION_READ')")
    public ResponseEntity<List<DesignationResponseDTO>>
            getAllDesignations() {

        List<DesignationResponseDTO> designations =
                designationService
                        .getAllDesignations();

        return ResponseEntity.ok(designations);
    }

    // =========================================================
    // GET DESIGNATION BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DESIGNATION_READ')")
    public ResponseEntity<DesignationResponseDTO>
            getDesignationById(
                    @PathVariable Long id) {

        DesignationResponseDTO response =
                designationService
                        .getDesignationById(id);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // UPDATE DESIGNATION
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DESIGNATION_UPDATE')")
    public ResponseEntity<DesignationResponseDTO>
            updateDesignation(
                    @PathVariable Long id,
                    @Valid @RequestBody
                    DesignationRequestDTO request) {

        DesignationResponseDTO response =
                designationService
                        .updateDesignation(
                                id,
                                request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // DELETE DESIGNATION
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DESIGNATION_DELETE')")
    public ResponseEntity<Void> deleteDesignation(
            @PathVariable Long id) {

        designationService.deleteDesignation(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    // =========================================================
    // GET DESIGNATIONS BY DEPARTMENT
    // =========================================================

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAuthority('DESIGNATION_READ')")
    public ResponseEntity<List<DesignationResponseDTO>>
            getByDepartment(
                    @PathVariable Long departmentId) {

        List<DesignationResponseDTO> designations =
                designationService
                        .getByDepartment(departmentId);

        return ResponseEntity.ok(designations);
    }
}
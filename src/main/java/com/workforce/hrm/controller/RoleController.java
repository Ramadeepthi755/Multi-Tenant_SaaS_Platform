package com.workforce.hrm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.RoleRequestDTO;
import com.workforce.hrm.dto.response.ApiResponse;
import com.workforce.hrm.dto.response.PermissionResponseDTO;
import com.workforce.hrm.dto.response.RoleResponseDTO;
import com.workforce.hrm.service.RoleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@Tag(name = "Role & Permission Management", description = "Endpoints for managing roles and access permissions")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/api/roles")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    @Operation(summary = "Get all roles with pagination and search")
    public ResponseEntity<Page<RoleResponseDTO>> getRoles(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(roleService.getRoles(search, pageable));
    }

    @GetMapping("/api/roles/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    @Operation(summary = "Get role by ID")
    public ResponseEntity<RoleResponseDTO> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping("/api/roles")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create a new role")
    public ResponseEntity<RoleResponseDTO> createRole(@Valid @RequestBody RoleRequestDTO request) {
        RoleResponseDTO created = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/api/roles/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update an existing role")
    public ResponseEntity<RoleResponseDTO> updateRole(@PathVariable Long id, @Valid @RequestBody RoleRequestDTO request) {
        return ResponseEntity.ok(roleService.updateRole(id, request));
    }

    @PutMapping("/api/roles/{id}/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update permissions assigned to a role")
    public ResponseEntity<RoleResponseDTO> updateRolePermissions(
            @PathVariable Long id,
            @RequestBody Map<String, List<String>> payload) {
        List<String> permissions = payload.get("permissions");
        return ResponseEntity.ok(roleService.updateRolePermissions(id, permissions));
    }

    @PatchMapping("/api/roles/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update role active status")
    public ResponseEntity<RoleResponseDTO> updateRoleStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        Boolean active = payload.get("active");
        return ResponseEntity.ok(roleService.updateRoleStatus(id, active));
    }

    @DeleteMapping("/api/roles/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete custom role")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success("Role deleted successfully", null));
    }

    @GetMapping("/api/permissions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    @Operation(summary = "List all available system permissions")
    public ResponseEntity<List<PermissionResponseDTO>> getPermissions() {
        return ResponseEntity.ok(roleService.getAllPermissions());
    }
}

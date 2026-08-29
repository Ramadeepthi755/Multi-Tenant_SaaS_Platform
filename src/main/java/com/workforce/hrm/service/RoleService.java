package com.workforce.hrm.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.workforce.hrm.dto.request.RoleRequestDTO;
import com.workforce.hrm.dto.response.PermissionResponseDTO;
import com.workforce.hrm.dto.response.RoleResponseDTO;

public interface RoleService {

    Page<RoleResponseDTO> getRoles(String search, Pageable pageable);

    RoleResponseDTO getRoleById(Long roleId);

    RoleResponseDTO createRole(RoleRequestDTO request);

    RoleResponseDTO updateRole(Long roleId, RoleRequestDTO request);

    RoleResponseDTO updateRolePermissions(Long roleId, List<String> permissions);

    RoleResponseDTO updateRoleStatus(Long roleId, Boolean active);

    void deleteRole(Long roleId);

    List<PermissionResponseDTO> getAllPermissions();
}

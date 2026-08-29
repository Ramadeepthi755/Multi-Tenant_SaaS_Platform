package com.workforce.hrm.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.RoleRequestDTO;
import com.workforce.hrm.dto.response.PermissionResponseDTO;
import com.workforce.hrm.dto.response.RoleResponseDTO;
import com.workforce.hrm.entity.Permission;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.exception.DuplicateResourceException;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.repository.PermissionRepository;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.service.RoleService;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    private static final Set<String> IMMUTABLE_SYSTEM_ROLES = Set.of(
            "SUPER_ADMIN", "COMPANY_ADMIN", "HR", "MANAGER", "EMPLOYEE"
    );

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoleResponseDTO> getRoles(String search, Pageable pageable) {
        List<Role> allRoles = roleRepository.findAll();
        List<RoleResponseDTO> filtered = allRoles.stream()
                .filter(r -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase(Locale.ROOT);
                    return (r.getRoleName() != null && r.getRoleName().toLowerCase(Locale.ROOT).contains(s)) ||
                            (r.getDescription() != null && r.getDescription().toLowerCase(Locale.ROOT).contains(s));
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<RoleResponseDTO> pageContent = start > filtered.size() ? List.of() : filtered.subList(start, end);
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponseDTO getRoleById(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleId));
        return mapToDTO(role);
    }

    @Override
    public RoleResponseDTO createRole(RoleRequestDTO request) {
        String roleName = request.getName() != null ? request.getName().trim().toUpperCase(Locale.ROOT) : "";
        if (roleName.isBlank()) {
            throw new IllegalArgumentException("Role name cannot be empty");
        }
        if (roleRepository.existsByRoleName(roleName)) {
            throw new DuplicateResourceException("Role with name '" + roleName + "' already exists");
        }

        Role role = new Role();
        role.setRoleName(roleName);
        role.setDescription(request.getDescription());
        role.setActive(request.getActive() != null ? request.getActive() : true);

        if (request.getPermissions() != null && !request.getPermissions().isEmpty()) {
            Set<Permission> perms = new HashSet<>();
            for (String permName : request.getPermissions()) {
                permissionRepository.findByPermissionName(permName).ifPresent(perms::add);
            }
            role.setPermissions(perms);
        }

        Role saved = roleRepository.save(role);
        return mapToDTO(saved);
    }

    @Override
    public RoleResponseDTO updateRole(Long roleId, RoleRequestDTO request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleId));

        if (IMMUTABLE_SYSTEM_ROLES.contains(role.getRoleName())) {
            // Description and active can still be edited if needed, but not name
            if (request.getDescription() != null) {
                role.setDescription(request.getDescription());
            }
            if (request.getActive() != null) {
                role.setActive(request.getActive());
            }
        } else {
            if (request.getName() != null && !request.getName().isBlank()) {
                String newName = request.getName().trim().toUpperCase(Locale.ROOT);
                if (!newName.equalsIgnoreCase(role.getRoleName()) && roleRepository.existsByRoleName(newName)) {
                    throw new DuplicateResourceException("Role with name '" + newName + "' already exists");
                }
                role.setRoleName(newName);
            }
            if (request.getDescription() != null) {
                role.setDescription(request.getDescription());
            }
            if (request.getActive() != null) {
                role.setActive(request.getActive());
            }
        }

        if (request.getPermissions() != null) {
            Set<Permission> perms = new HashSet<>();
            for (String permName : request.getPermissions()) {
                permissionRepository.findByPermissionName(permName).ifPresent(perms::add);
            }
            role.setPermissions(perms);
        }

        Role saved = roleRepository.save(role);
        return mapToDTO(saved);
    }

    @Override
    public RoleResponseDTO updateRolePermissions(Long roleId, List<String> permissions) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleId));

        Set<Permission> perms = new HashSet<>();
        if (permissions != null) {
            for (String permName : permissions) {
                permissionRepository.findByPermissionName(permName).ifPresent(perms::add);
            }
        }
        role.setPermissions(perms);
        Role saved = roleRepository.save(role);
        return mapToDTO(saved);
    }

    @Override
    public RoleResponseDTO updateRoleStatus(Long roleId, Boolean active) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleId));
        if (IMMUTABLE_SYSTEM_ROLES.contains(role.getRoleName()) && Boolean.FALSE.equals(active)) {
            throw new IllegalArgumentException("System roles cannot be deactivated");
        }
        role.setActive(active != null ? active : true);
        Role saved = roleRepository.save(role);
        return mapToDTO(saved);
    }

    @Override
    public void deleteRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleId));
        if (IMMUTABLE_SYSTEM_ROLES.contains(role.getRoleName())) {
            throw new IllegalArgumentException("System default roles cannot be deleted");
        }
        roleRepository.delete(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponseDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(p -> new PermissionResponseDTO(
                        p.getPermissionId(),
                        p.getPermissionName(),
                        p.getDescription(),
                        p.getModule(),
                        p.getCreatedAt()))
                .collect(Collectors.toList());
    }

    private RoleResponseDTO mapToDTO(Role role) {
        Set<String> permNames = role.getPermissions() != null
                ? role.getPermissions().stream().map(Permission::getPermissionName).collect(Collectors.toSet())
                : Set.of();
        return new RoleResponseDTO(
                role.getRoleId(),
                role.getRoleName(),
                role.getDescription(),
                role.getActive(),
                permNames,
                role.getCreatedAt(),
                role.getUpdatedAt()
        );
    }
}

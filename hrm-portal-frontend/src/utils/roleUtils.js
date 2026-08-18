export const SYSTEM_ROLES = [
  "SUPER_ADMIN",
  "COMPANY_ADMIN",
  "HR",
  "MANAGER",
  "EMPLOYEE"
];


export const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  COMPANY_ADMIN: "Company Admin",
  HR: "HR",
  MANAGER: "Manager",
  EMPLOYEE: "Employee"
};


export const getRoleLabel = (
  role
) => {

  if (!role) {
    return "Unknown Role";
  }

  const normalized =
    String(role)
      .trim()
      .toUpperCase();

  if (ROLE_LABELS[normalized]) {
    return ROLE_LABELS[normalized];
  }

  return normalized
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      char => char.toUpperCase()
    );
};


export const getRoleDescription = (
  role
) => {

  switch (
    String(role || "").toUpperCase()
  ) {

    case "SUPER_ADMIN":
      return "Full platform administration and tenant management.";

    case "COMPANY_ADMIN":
      return "Company-wide administration and workforce management.";

    case "HR":
      return "Human resource and employee administration.";

    case "MANAGER":
      return "Team-level workforce and operational management.";

    case "EMPLOYEE":
      return "Employee self-service access.";

    default:
      return "Custom role with assigned permissions.";

  }
};


export const normalizePermission = (
  permission
) => {

  if (
    typeof permission === "string"
  ) {
    return permission;
  }

  if (
    permission?.permissionName
  ) {
    return permission.permissionName;
  }

  if (
    permission?.name
  ) {
    return permission.name;
  }

  if (
    permission?.code
  ) {
    return permission.code;
  }

  return String(
    permission || ""
  );
};


export const normalizeRole = (
  role = {}
) => {

  const rawPermissions =
    role.permissions ||
    role.permissionList ||
    [];


  return {

    id:
      role.id ??
      role.roleId ??
      null,

    name:
      role.name ||
      role.roleName ||
      role.code ||
      "",

    displayName:
      role.displayName ||
      getRoleLabel(
        role.name ||
        role.roleName ||
        role.code
      ),

    description:
      role.description ||
      getRoleDescription(
        role.name ||
        role.roleName ||
        role.code
      ),

    active:
      role.active ??
      role.enabled ??
      role.status === "ACTIVE" ??
      true,

    systemRole:
      role.systemRole ??
      role.isSystemRole ??
      SYSTEM_ROLES.includes(
        String(
          role.name ||
          role.roleName ||
          role.code ||
          ""
        ).toUpperCase()
      ),

    permissions:
      rawPermissions
        .map(
          normalizePermission
        )
        .filter(Boolean)

  };
};


export const normalizeRoleResponse =
  response => {

    const content =
      Array.isArray(
        response?.content
      )
        ? response.content
        : Array.isArray(response)
          ? response
          : response
            ? [response]
            : [];


    return {

      content:
        content.map(
          normalizeRole
        ),

      totalPages:
        Number(
          response?.totalPages ?? 1
        ),

      totalElements:
        Number(
          response?.totalElements ??
          content.length
        ),

      page:
        Number(
          response?.number ?? 0
        ),

      size:
        Number(
          response?.size ?? 20
        )

    };

  };


export const normalizePermissionList =
  response => {

    const list =
      Array.isArray(response)
        ? response
        : Array.isArray(
            response?.content
          )
          ? response.content
          : Array.isArray(
              response?.permissions
            )
            ? response.permissions
            : [];

    return list
      .map(
        normalizePermission
      )
      .filter(Boolean);

  };


export const getPermissionModule = (
  permission
) => {

  const value =
    normalizePermission(
      permission
    );

  const parts =
    value.split("_");

  if (
    parts.length < 2
  ) {
    return "OTHER";
  }

  /*
   * DASHBOARD_VIEW
   * EMPLOYEE_CREATE
   * DOCUMENT_DOWNLOAD
   */

  return parts
    .slice(0, -1)
    .join("_");

};


export const getPermissionAction = (
  permission
) => {

  const value =
    normalizePermission(
      permission
    );

  const parts =
    value.split("_");

  if (
    parts.length < 2
  ) {
    return "ACCESS";
  }

  return parts[
    parts.length - 1
  ];

};


export const getPermissionLabel = (
  permission
) => {

  return normalizePermission(
    permission
  )
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      char => char.toUpperCase()
    );

};


export const groupPermissionsByModule =
  permissions => {

    const groups = {};

    permissions.forEach(
      permission => {

        const module =
          getPermissionModule(
            permission
          );

        if (!groups[module]) {
          groups[module] = [];
        }

        groups[module].push(
          permission
        );

      }
    );

    return groups;
  };


export const sortPermissions =
  permissions => {

    return [...permissions].sort(
      (a, b) =>
        String(a).localeCompare(
          String(b)
        )
    );

  };


export const getRoleErrorMessage = (
  error,
  fallback =
    "Unable to process role request."
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );

};
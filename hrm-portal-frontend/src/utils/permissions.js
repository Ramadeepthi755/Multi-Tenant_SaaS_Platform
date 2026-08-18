// ============================================================
// HRM PORTAL
// PERMISSION UTILITIES
// ============================================================

/**
 * Normalize permission collection.
 *
 * Backend nunchi array vachina,
 * null/undefined vachina safe ga handle chestundi.
 */
export const normalizePermissions = (
  permissions
) => {

  if (!Array.isArray(permissions)) {
    return [];
  }

  return permissions
    .filter(
      permission =>
        typeof permission === "string"
    )
    .map(
      permission =>
        permission.trim()
    )
    .filter(Boolean);
};


// ============================================================
// HAS PERMISSION
// ============================================================

export const hasPermission = (
  user,
  permission
) => {

  if (!user) {
    return false;
  }

  if (!permission) {
    return true;
  }

  const permissions =
    normalizePermissions(
      user.permissions
    );

  return permissions.includes(
    permission
  );
};


// ============================================================
// HAS ANY PERMISSION
// ============================================================

export const hasAnyPermission = (
  user,
  permissions
) => {

  if (!user) {
    return false;
  }

  if (
    !Array.isArray(permissions) ||
    permissions.length === 0
  ) {
    return true;
  }

  const userPermissions =
    normalizePermissions(
      user.permissions
    );

  return permissions.some(
    permission =>
      userPermissions.includes(
        permission
      )
  );
};


// ============================================================
// HAS ALL PERMISSIONS
// ============================================================

export const hasAllPermissions = (
  user,
  permissions
) => {

  if (!user) {
    return false;
  }

  if (
    !Array.isArray(permissions) ||
    permissions.length === 0
  ) {
    return true;
  }

  const userPermissions =
    normalizePermissions(
      user.permissions
    );

  return permissions.every(
    permission =>
      userPermissions.includes(
        permission
      )
  );
};


// ============================================================
// HAS ROLE
// ============================================================

export const hasRole = (
  user,
  role
) => {

  if (!user || !role) {
    return false;
  }

  return user.role === role;
};


// ============================================================
// HAS ANY ROLE
// ============================================================

export const hasAnyRole = (
  user,
  roles
) => {

  if (!user) {
    return false;
  }

  if (
    !Array.isArray(roles) ||
    roles.length === 0
  ) {
    return true;
  }

  return roles.includes(
    user.role
  );
};


// ============================================================
// IS ACTIVE USER
// ============================================================

export const isActiveUser = (
  user
) => {

  if (!user) {
    return false;
  }

  return (
    user.active !== false &&
    user.accountLocked !== true &&
    (
      !user.status ||
      user.status === "ACTIVE"
    )
  );
};


// ============================================================
// PERMISSION OBJECT
// ============================================================

export const permissionCheck = (
  user,
  {
    permission,
    permissions = [],
    mode = "any",
    role,
    roles = []
  } = {}
) => {

  if (!user) {
    return false;
  }


  // ----------------------------------------------------------
  // USER STATUS
  // ----------------------------------------------------------

  if (!isActiveUser(user)) {
    return false;
  }


  // ----------------------------------------------------------
  // SINGLE ROLE
  // ----------------------------------------------------------

  if (
    role &&
    !hasRole(
      user,
      role
    )
  ) {
    return false;
  }


  // ----------------------------------------------------------
  // MULTIPLE ROLES
  // ----------------------------------------------------------

  if (
    Array.isArray(roles) &&
    roles.length > 0 &&
    !hasAnyRole(
      user,
      roles
    )
  ) {
    return false;
  }


  // ----------------------------------------------------------
  // SINGLE PERMISSION
  // ----------------------------------------------------------

  if (
    permission &&
    !hasPermission(
      user,
      permission
    )
  ) {
    return false;
  }


  // ----------------------------------------------------------
  // MULTIPLE PERMISSIONS
  // ----------------------------------------------------------

  if (
    Array.isArray(permissions) &&
    permissions.length > 0
  ) {

    if (mode === "all") {

      if (
        !hasAllPermissions(
          user,
          permissions
        )
      ) {
        return false;
      }

    } else {

      if (
        !hasAnyPermission(
          user,
          permissions
        )
      ) {
        return false;
      }
    }
  }


  return true;
};


// ============================================================
// EXPORT DEFAULT
// ============================================================

const permissionUtils = {

  normalizePermissions,

  hasPermission,

  hasAnyPermission,

  hasAllPermissions,

  hasRole,

  hasAnyRole,

  isActiveUser,

  permissionCheck

};


export default permissionUtils;
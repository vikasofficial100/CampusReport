export const USER_ROLES = {
  STUDENT: "STUDENT",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const roleLabels = {
  STUDENT: "Student",
  STAFF: "Staff",    
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_ALIASES = {
  CITIZEN: USER_ROLES.STUDENT,
  STUDENT: USER_ROLES.STUDENT,
  DEPARTMENT_OFFICER: USER_ROLES.STAFF,
  STAFF: USER_ROLES.STAFF,
  ADMIN: USER_ROLES.ADMIN,
  SUPER_ADMIN: USER_ROLES.SUPER_ADMIN,
};

export const normalizeRole = (role) => {
  if (!role) return "";

  const normalized = String(role).trim().toUpperCase();
  return ROLE_ALIASES[normalized] || normalized;
};

export const getDashboardPathByRole = (role) => {
  switch (normalizeRole(role)) {
    case USER_ROLES.SUPER_ADMIN:
      return "/super-admin-dashboard";
    case USER_ROLES.ADMIN:
      return "/admin-dashboard";
    case USER_ROLES.STAFF:
      return "/department-dashboard";
    default:
      return "/dashboard";
  }
};

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

export const getDashboardPathByRole = (role) => {
  switch (role) {
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
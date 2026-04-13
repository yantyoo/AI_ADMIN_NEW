export type UserRole = "MASTER" | "OPERATOR";

export type AdminUser = {
  id: string;
  name: string;
  role: UserRole;
  department: string;
};

export type NavItem = {
  key: string;
  label: string;
  href: string;
  roles: UserRole[];
};

export type PageMeta = {
  title: string;
  description: string;
};

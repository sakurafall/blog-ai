import { ROLES, type Role } from "./roles";

export function isAdmin(role?: Role) {
  return role === ROLES.ADMIN;
}
export type UserRole = "PATIENT" | "DOCTOR" | "HOSPITAL" | "AMBULANCE" | "VOLUNTEER" | "ADMIN";

export interface NavItem {
  label: string;
  href: string;
  roles?: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Health",     href: "/health",   roles: ["PATIENT", "DOCTOR", "ADMIN"] },
  { label: "Rescue",     href: "/rescue",   roles: ["PATIENT", "HOSPITAL", "AMBULANCE", "ADMIN"] },
  { label: "Heroes",     href: "/heroes",   roles: ["VOLUNTEER", "ADMIN"] },
];

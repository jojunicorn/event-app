import { Roles } from "@/enums/roles"

export interface UserAuthInfo {
  id: string;
  role: Roles;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Roles | null;
  birthdate: Date;
  preferences: Array<string>;
  location: string;
}

export interface UserRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    role: Roles;
    birthdate: string;
}
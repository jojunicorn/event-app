import { Roles } from "@/enums/roles"
import { EventType } from "./event";

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

export interface UserUpdateRequest {
  location: string;
  preferences: Array<EventType>;
}
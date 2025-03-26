package webdev2.eventmanagement.model.dto;

import webdev2.eventmanagement.model.enums.Role;

import java.util.Date;

public record UserRequest(String name, String userName, String email, String password, Role role, Date birthdate) {
}

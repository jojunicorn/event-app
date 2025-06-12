package webdev2.eventmanagement.model.dto;

import webdev2.eventmanagement.model.enums.Role;

public record LoginResponse(String token, Role role, String userId) {
}

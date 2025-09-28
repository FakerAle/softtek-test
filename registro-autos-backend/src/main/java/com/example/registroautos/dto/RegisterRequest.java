package com.example.registroautos.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;
    @NotBlank @Email
    private String email;
    @NotBlank          private String password;
    private List<String> roles = List.of();
}

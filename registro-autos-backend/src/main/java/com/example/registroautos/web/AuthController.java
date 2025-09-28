package com.example.registroautos.web;

import com.example.registroautos.dto.LoginRequest;
import com.example.registroautos.dto.UserDTO;
import com.example.registroautos.model.User;
import com.example.registroautos.service.JwtService;
import com.example.registroautos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userSvc;
    private final JwtService  jwtSvc;


    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody UserDTO dto) {

        userSvc.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "¡Usuario registrado!"));
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody LoginRequest req) {

        User user = userSvc.authenticate(req);
        String token = jwtSvc.generateToken(user.getUsername(), user.getId());

        return ResponseEntity.ok(Map.of("token", token));
    }
}

package com.example.registroautos.service;

import com.example.registroautos.dto.LoginRequest;
import com.example.registroautos.dto.UserDTO;
import com.example.registroautos.exception.DuplicateResourceException;
import com.example.registroautos.exception.InvalidCredentialsException;
import com.example.registroautos.exception.ResourceNotFoundException;
import com.example.registroautos.model.User;
import com.example.registroautos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Long findIdByUsername(String username) {
        return repo.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado")
                );
    }
    public User register(UserDTO dto) {

        if (repo.existsByUsername(dto.getUsername()))
            throw new DuplicateResourceException("El nombre de usuario ya existe");

        if (repo.existsByEmail(dto.getEmail()))
            throw new DuplicateResourceException("El correo ya existe");

        User user = new User(
                null,
                dto.getUsername(),
                encoder.encode(dto.getPassword()),
                dto.getEmail());

        return repo.save(user);
    }


    public User authenticate(LoginRequest req) {
        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (!encoder.matches(req.getPassword(), user.getPasswordHash()))
            throw new InvalidCredentialsException();
        return user;
    }
}

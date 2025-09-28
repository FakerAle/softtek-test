package com.example.registroautos.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends ApiException {
    public ForbiddenException() {
        super("Operación no permitida", HttpStatus.FORBIDDEN); // 403
    }
}

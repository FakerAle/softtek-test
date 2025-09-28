package com.example.registroautos.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String msg) {
        super(msg, HttpStatus.NOT_FOUND);        // 404
    }
}

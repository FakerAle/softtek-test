package com.example.registroautos.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends ApiException {
    public DuplicateResourceException(String msg) {
        super(msg, HttpStatus.CONFLICT);        // 409
    }
}

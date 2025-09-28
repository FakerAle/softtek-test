package com.example.registroautos.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class ApiException extends RuntimeException {
    private final HttpStatus status;
    protected ApiException(String msg, HttpStatus status) {
        super(msg);
        this.status = status;
    }
}


package com.example.registroautos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class CarDTO {
    private String plate;
    private String brand;
    private String model;
    private Integer year;
    private String color;


}

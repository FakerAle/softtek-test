package com.example.registroautos.dto;

import com.example.registroautos.model.Car;
import com.example.registroautos.model.User;
import org.springframework.stereotype.Component;

@Component
public class CarMapper {

    public Car toEntity(CarDTO dto, User owner) {
        return new Car(
                null,
                owner,
                dto.getBrand(),
                dto.getModel(),
                dto.getYear(),
                dto.getPlate(),
                dto.getColor()
        );
    }

    public CarDTO toResponse(Car car) {
        return new CarDTO(
                car.getPlate(),
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getColor()
        );
    }
}

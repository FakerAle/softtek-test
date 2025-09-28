package com.example.registroautos.service;

import com.example.registroautos.dto.CarDTO;
import com.example.registroautos.exception.DuplicateResourceException;
import com.example.registroautos.exception.ForbiddenException;
import com.example.registroautos.exception.ResourceNotFoundException;
import com.example.registroautos.model.Car;
import com.example.registroautos.model.User;
import com.example.registroautos.repository.CarRepository;
import com.example.registroautos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepo;
    private final UserRepository userRepo;

    /* ----------- READ ----------- */
    public List<Car> listByOwner(String ownerUsername) {
        return carRepo.findByOwnerUsername(ownerUsername);
    }

    public Car getByPlate(String plate) {
        return carRepo.findByPlate(plate)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehículo no encontrado"));
    }

    /* ----------- CREATE ----------- */
    public Car create(CarDTO dto, String ownerUsername) {
        if (carRepo.existsByPlate(dto.getPlate())) {
            throw new DuplicateResourceException("La placa ya está registrada");
        }

        // Cargamos el User persistido desde la base de datos
        User owner = userRepo.findByUsername(ownerUsername)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado"));

        Car car = new Car(
                null,
                owner,
                dto.getBrand(),
                dto.getModel(),
                dto.getYear(),
                dto.getPlate(),
                dto.getColor()
        );

        return carRepo.save(car);
    }

    /* ----------- UPDATE ----------- */
    public Car update(String plate, CarDTO dto, String ownerUsername) {
        Car car = getByPlate(plate);

        if (!car.getOwner().getUsername().equals(ownerUsername)) {
            throw new ForbiddenException();
        }

        car.setBrand(dto.getBrand());
        car.setModel(dto.getModel());
        car.setYear(dto.getYear());
        car.setColor(dto.getColor());
        return carRepo.save(car);
    }

    /* ----------- DELETE ----------- */
    public void delete(String plate, String ownerUsername) {
        Car car = getByPlate(plate);

        if (!car.getOwner().getUsername().equals(ownerUsername)) {
            throw new ForbiddenException();
        }

        carRepo.delete(car);
    }
}

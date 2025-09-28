package com.example.registroautos.repository;

import com.example.registroautos.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {

    Optional<Car> findByPlate(String plate);

    // 🔸 busca por el username del dueño 🔸
    List<Car> findByOwnerUsername(String username);

    boolean existsByPlate(String plate);
}

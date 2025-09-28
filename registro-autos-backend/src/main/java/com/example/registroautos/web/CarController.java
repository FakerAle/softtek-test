package com.example.registroautos.web;

import com.example.registroautos.config.JwtUtils;
import com.example.registroautos.dto.CarDTO;
import com.example.registroautos.dto.CarMapper;
import com.example.registroautos.model.Car;
import com.example.registroautos.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService service;
    private final CarMapper  mapper;
    private final JwtUtils   jwt;

    /* helper → username del token */
    private String username(HttpServletRequest r) {
        String token = jwt.getTokenFromRequest(r);
        return jwt.getUsername(token);
    }

    /* ----------- CRUD ----------- */

    /* LIST */
    @GetMapping
    public List<CarDTO> listMine(HttpServletRequest req) {
        return service.listByOwner(username(req))
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    /* CREATE */
    @PostMapping
    public CarDTO create(@RequestBody CarDTO dto, HttpServletRequest req) {
        Car car = service.create(dto, username(req));
        return mapper.toResponse(car);
    }

    /* READ */
    @GetMapping("/{plate}")
    public CarDTO get(@PathVariable String plate) {
        return mapper.toResponse(service.getByPlate(plate));
    }

    /* UPDATE */
    @PutMapping("/{plate}")
    public CarDTO update(@PathVariable String plate,
                         @RequestBody CarDTO dto,
                         HttpServletRequest req) {
        Car car = service.update(plate, dto, username(req));
        return mapper.toResponse(car);
    }

    /* DELETE */
    @DeleteMapping("/{plate}")
    public ResponseEntity<Void> delete(@PathVariable String plate,
                                       HttpServletRequest req) {
        service.delete(plate, username(req));
        return ResponseEntity.noContent().build();
    }
}

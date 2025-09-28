package com.example.registroautos.model;

import lombok.*;
import javax.persistence.*;

@Entity @Table(name = "cars")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Car {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) @JoinColumn(name = "user_id")
    private User owner;

    private String brand;
    private String model;
    private int    year;

    @Column(length = 10, unique = true)
    private String plate;

    private String color;
}

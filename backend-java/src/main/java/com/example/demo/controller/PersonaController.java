package com.example.demo.controller;

import com.example.demo.model.Persona;
import com.example.demo.repository.PersonaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;

    @GetMapping("/personas")
    public List<Persona> obtenerTodas() {
        return personaRepository.findAll();
    }

    // 🟢 Registro genérico (CRUD)
    @PostMapping("/personas")
    public ResponseEntity<?> crearPersona(@Valid @RequestBody Persona persona) {

        if (persona.getRut() == null || persona.getRut().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("El RUT es obligatorio.");
        }

        if (persona.getEmail() == null || persona.getEmail().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("El correo electrónico es obligatorio.");
        }

        persona.setRut(persona.getRut().trim());
        persona.setEmail(persona.getEmail().trim().toLowerCase());

        if (personaRepository.existsByRut(persona.getRut())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("El RUT " + persona.getRut() + " ya se encuentra registrado.");
        }

        if (personaRepository.existsByEmail(persona.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("El correo " + persona.getEmail() + " ya se encuentra registrado.");
        }

        Persona nuevaPersona = personaRepository.save(persona);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPersona);
    }
}
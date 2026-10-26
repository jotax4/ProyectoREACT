package com.example.demo.controller;

import com.example.demo.entity.Persona;
import com.example.demo.repository.PersonaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "*") // Permite peticiones desde cualquier origen (React, Vue, etc.)
public class PersonaController {

    private final PersonaRepository personaRepository;

    public PersonaController(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    @GetMapping
    public List<Persona> obtenerTodas() {
        return personaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearPersona(@Valid @RequestBody Persona persona) {
        Map<String, String> errores = new HashMap<>();

        if (personaRepository.existsByRut(persona.getRut())) {
            errores.put("rut", "El RUT ingresado ya se encuentra registrado.");
        }

        if (personaRepository.existsByEmail(persona.getEmail())) {
            errores.put("email", "El correo electrónico ingresado ya se encuentra registrado.");
        }

        if (!errores.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
        }

        Persona nuevaPersona = personaRepository.save(persona);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPersona);
    }
}
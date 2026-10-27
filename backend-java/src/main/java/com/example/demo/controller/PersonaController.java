package com.example.demo.controller;

import com.example.demo.model.Persona;
import com.example.demo.repository.PersonaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    // 🟢 Registro con ruta única
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

    // 🟢 Login con ruta única
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Debe ingresar correo y contraseña.");
        }

        String cleanEmail = email.trim().toLowerCase();
        String cleanPassword = password.trim();

        Optional<Persona> personaOpt = personaRepository.findByEmail(cleanEmail);

        if (personaOpt.isPresent()) {
            Persona persona = personaOpt.get();
            String dbPassword = persona.getPassword() != null ? persona.getPassword().trim() : "";

            if (cleanPassword.equals(dbPassword)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Inicio de sesión exitoso");
                response.put("user", persona);
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Credenciales inválidas. Correo o contraseña incorrectos.");
    }
}
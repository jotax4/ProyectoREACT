package com.example.demo.controller;

import com.example.demo.model.Persona;
import com.example.demo.model.Rol;
import com.example.demo.repository.PersonaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/personas")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Personas / Usuarios", description = "Administración de usuarios y asignación de roles (Solo rol ADMIN)")
@SecurityRequirement(name = "Bearer Authentication")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios", description = "Obtiene la lista completa de personas registradas en el sistema (Solo rol ADMIN)")
    public ResponseEntity<List<Persona>> obtenerTodas() {
        return ResponseEntity.ok(personaRepository.findAll());
    }

    @PostMapping
    @Operation(summary = "Crear usuario con rol", description = "Permite al administrador registrar usuarios (ADMIN, VENDEDOR o CLIENTE) encriptando su contraseña")
    public ResponseEntity<?> crearPersona(@Valid @RequestBody Persona persona) {

        if (persona.getRut() == null || persona.getRut().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El RUT es obligatorio."));
        }

        if (persona.getEmail() == null || persona.getEmail().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El correo electrónico es obligatorio."));
        }

        if (persona.getPassword() == null || persona.getPassword().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "La contraseña es obligatoria."));
        }

        persona.setRut(persona.getRut().trim());
        persona.setEmail(persona.getEmail().trim().toLowerCase());

        if (personaRepository.existsByRut(persona.getRut())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El RUT " + persona.getRut() + " ya se encuentra registrado."));
        }

        if (personaRepository.existsByEmail(persona.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El correo " + persona.getEmail() + " ya se encuentra registrado."));
        }

        // Encriptar contraseña para que el usuario pueda iniciar sesión con JWT
        persona.setPassword(passwordEncoder.encode(persona.getPassword()));

        if (persona.getRol() == null) {
            persona.setRol(Rol.CLIENTE);
        }

        Persona nuevaPersona = personaRepository.save(persona);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPersona);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema por su ID (Solo rol ADMIN)")
    public ResponseEntity<Void> eliminarPersona(@PathVariable Long id) {
        if (!personaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        personaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
package com.example.demo.controller;

import com.example.demo.entity.PersonaEntity;
import com.example.demo.model.Rol;
import com.example.demo.repository.PersonaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/personas")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Personas / Usuarios", description = "CRUD de usuarios y asignación de roles (Solo rol ADMIN)")
@SecurityRequirement(name = "Bearer Authentication")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public ResponseEntity<List<PersonaEntity>> obtenerTodas() {
        return ResponseEntity.ok(personaRepository.findAll());
    }

    @PostMapping
    @Operation(summary = "Crear usuario con rol")
    public ResponseEntity<?> crearPersona(@RequestBody PersonaEntity persona) {
        if (persona.getRut() == null || persona.getRut().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El RUT es obligatorio."));
        }
        if (persona.getEmail() == null || persona.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El correo electrónico es obligatorio."));
        }
        if (persona.getPassword() == null || persona.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es obligatoria."));
        }

        persona.setRut(persona.getRut().trim());
        persona.setEmail(persona.getEmail().trim().toLowerCase());

        if (personaRepository.existsByRut(persona.getRut())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El RUT ya se encuentra registrado."));
        }
        if (personaRepository.existsByEmail(persona.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El correo ya se encuentra registrado."));
        }

        persona.setPassword(passwordEncoder.encode(persona.getPassword()));
        if (persona.getRol() == null) {
            persona.setRol(Rol.CLIENTE);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(personaRepository.save(persona));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario existente")
    public ResponseEntity<?> actualizarPersona(@PathVariable Long id, @RequestBody PersonaEntity datos) {
        Optional<PersonaEntity> existenteOpt = personaRepository.findById(id);
        if (existenteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PersonaEntity existente = existenteOpt.get();

        if (datos.getRut() != null && !datos.getRut().isBlank()) {
            String nuevoRut = datos.getRut().trim();
            if (!nuevoRut.equalsIgnoreCase(existente.getRut()) && personaRepository.existsByRut(nuevoRut)) {
                return ResponseEntity.badRequest().body(Map.of("error", "El RUT ya pertenece a otro usuario."));
            }
            existente.setRut(nuevoRut);
        }

        if (datos.getEmail() != null && !datos.getEmail().isBlank()) {
            String nuevoEmail = datos.getEmail().trim().toLowerCase();
            if (!nuevoEmail.equalsIgnoreCase(existente.getEmail()) && personaRepository.existsByEmail(nuevoEmail)) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya pertenece a otro usuario."));
            }
            existente.setEmail(nuevoEmail);
        }

        if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
            existente.setNombre(datos.getNombre().trim());
        }

        if (datos.getFechaNacimiento() != null) {
            existente.setFechaNacimiento(datos.getFechaNacimiento());
        }

        if (datos.getRol() != null) {
            existente.setRol(datos.getRol());
        }

        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            existente.setPassword(passwordEncoder.encode(datos.getPassword()));
        }

        return ResponseEntity.ok(personaRepository.save(existente));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<Void> eliminarPersona(@PathVariable Long id) {
        if (!personaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        personaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
package com.example.demo.controller;

import com.example.demo.model.Persona;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registrarPersona(@RequestBody Persona persona) {
        try {
            Persona nuevaPersona = authService.registrar(persona);
            return ResponseEntity.ok(nuevaPersona);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginPersona(@RequestBody Map<String, String> credenciales) {
        try {
            Persona persona = authService.login(credenciales.get("email"), credenciales.get("password"));
            return ResponseEntity.ok(Map.of("mensaje", "Login exitoso", "usuario", persona.getNombre()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
}
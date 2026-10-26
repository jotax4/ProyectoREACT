package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        
        // Validación de Edad (Mayor o igual a 18 años)
        int edad = Period.between(request.getFechaNacimiento(), LocalDate.now()).getYears();

        if (edad < 18) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Acceso denegado: Debes ser mayor de 18 años para ingresar.");
        }

        // Aquí iría la lógica de autenticación contra BD/JWT que tenías en Node
        return ResponseEntity.ok("Autenticación exitosa. Edad verificada: " + edad + " años.");
    }
}
package com.example.demo.controller;

import com.example.demo.model.Persona;
import com.example.demo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Autenticación", description = "Endpoints públicos para registro e inicio de sesión con JWT")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Registrar usuario", description = "Valida mayoría de edad (+18), encripta la contraseña y crea una cuenta con rol CLIENTE por defecto")
    public ResponseEntity<?> registrarPersona(@RequestBody Persona persona) {
        try {
            Persona nuevaPersona = authService.registrar(persona);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Usuario registrado correctamente");
            respuesta.put("id", nuevaPersona.getId());
            respuesta.put("nombre", nuevaPersona.getNombre());
            respuesta.put("email", nuevaPersona.getEmail());
            respuesta.put("rol", nuevaPersona.getRol());

            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Valida credenciales y retorna el token JWT junto con los datos y rol del usuario")
    public ResponseEntity<?> loginPersona(@RequestBody Map<String, String> credenciales) {
        try {
            Map<String, Object> datosSesion = authService.login(
                    credenciales.get("email"),
                    credenciales.get("password")
            );
            return ResponseEntity.ok(datosSesion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
}
package com.example.demo.service;

import com.example.demo.model.Persona;
import com.example.demo.model.Rol;
import com.example.demo.repository.PersonaRepository;
import com.example.demo.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public Persona registrar(Persona persona) throws Exception {
        // 1. Validación de edad (+18)
        if (persona.getFechaNacimiento() == null) {
            throw new Exception("La fecha de nacimiento es obligatoria.");
        }
        int edad = Period.between(persona.getFechaNacimiento(), LocalDate.now()).getYears();
        if (edad < 18) {
            throw new Exception("El usuario debe ser mayor de 18 años.");
        }

        // 2. Verificar duplicados de correo y RUT
        if (personaRepository.existsByEmail(persona.getEmail())) {
            throw new Exception("El correo ya está registrado.");
        }
        if (persona.getRut() != null && personaRepository.existsByRut(persona.getRut())) {
            throw new Exception("El RUT ya está registrado.");
        }

        // 3. Encriptar contraseña con BCrypt
        persona.setPassword(passwordEncoder.encode(persona.getPassword()));

        // 4. Asignar rol CLIENTE por defecto si no viene especificado
        if (persona.getRol() == null) {
            persona.setRol(Rol.CLIENTE);
        }

        return personaRepository.save(persona);
    }

    public Map<String, Object> login(String email, String password) throws Exception {
        Optional<Persona> personaOpt = personaRepository.findByEmail(email);

        if (personaOpt.isPresent() && passwordEncoder.matches(password, personaOpt.get().getPassword())) {
            Persona persona = personaOpt.get();
            String token = jwtService.generarToken(persona);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("token", token);
            respuesta.put("id", persona.getId());
            respuesta.put("nombre", persona.getNombre());
            respuesta.put("email", persona.getEmail());
            respuesta.put("rol", persona.getRol().name());

            return respuesta;
        }

        throw new Exception("Credenciales inválidas.");
    }
}
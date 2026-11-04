package com.example.demo.service;

import com.example.demo.model.Persona;
import com.example.demo.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private PersonaRepository personaRepository;

    public Persona registrar(Persona persona) throws Exception {
        // Validación de edad (+18) usando tu campo fechaNacimiento
        int edad = Period.between(persona.getFechaNacimiento(), LocalDate.now()).getYears();
        if (edad < 18) {
            throw new Exception("El usuario debe ser mayor de 18 años.");
        }
        
        // Verificar si el correo ya existe
        if (personaRepository.findByEmail(persona.getEmail()).isPresent()) {
            throw new Exception("El correo ya está registrado.");
        }

        return personaRepository.save(persona);
    }

    public Persona login(String email, String password) throws Exception {
        Optional<Persona> persona = personaRepository.findByEmail(email);
        
        if (persona.isPresent() && persona.get().getPassword().equals(password)) {
            return persona.get();
        }
        throw new Exception("Credenciales inválidas.");
    }
}
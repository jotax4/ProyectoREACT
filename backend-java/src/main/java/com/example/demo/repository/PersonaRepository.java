package com.example.demo.repository;

import com.example.demo.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {
    boolean existsByRut(String rut);
    boolean existsByEmail(String email);
    Optional<Persona> findByEmail(String email); // 👈 Requerido para la autenticación
}
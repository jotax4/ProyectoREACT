package com.example.demo.repository;

import com.example.demo.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {
    Optional<Persona> findByEmail(String email);
    Optional<Persona> findByRut(String rut);
    
    boolean existsByEmail(String email);
    boolean existsByRut(String rut);
}
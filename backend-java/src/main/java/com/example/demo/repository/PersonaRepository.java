package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.PersonaEntity;

import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<PersonaEntity, Long> {
    boolean existsByRut(String rut);
    boolean existsByEmail(String email);
    Optional<PersonaEntity> findByEmail(String email); // 👈 Requerido para la autenticación
}
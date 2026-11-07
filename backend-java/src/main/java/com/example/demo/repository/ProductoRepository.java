package com.example.demo.repository;

import com.example.demo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Permite buscar productos filtrando por categoría (ej. "Consolas", "Juegos")
    List<Producto> findByCategoriaIgnoreCase(String categoria);

    // Permite obtener únicamente los productos marcados con oferta (oferta = true)
    List<Producto> findByOfertaTrue();
}
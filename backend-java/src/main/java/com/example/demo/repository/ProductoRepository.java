package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.ProductoEntity;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<ProductoEntity, Long> {

    // Permite buscar productos filtrando por el nombre de la categoría (ej. "Consolas", "Juegos")
    List<ProductoEntity> findByCategoriaNombreIgnoreCase(String nombre);

    // Permite buscar productos filtrando por el ID de la categoría
    List<ProductoEntity> findByCategoriaId(Long categoriaId);

    // Permite obtener únicamente los productos marcados con oferta (oferta = true)
    List<ProductoEntity> findByOfertaTrue();
}
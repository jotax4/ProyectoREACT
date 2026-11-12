package com.example.demo.repository;

import com.example.demo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Permite buscar productos filtrando por el nombre de la categoría (ej. "Consolas", "Juegos")
    List<Producto> findByCategoriaNombreIgnoreCase(String nombre);

    // Permite buscar productos filtrando por el ID de la categoría
    List<Producto> findByCategoriaId(Long categoriaId);

    // Permite obtener únicamente los productos marcados con oferta (oferta = true)
    List<Producto> findByOfertaTrue();
}
package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Productos", description = "Gestión del catálogo de productos y filtros por categoría u oferta")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    @Operation(
            summary = "Listar o filtrar productos",
            description = "Obtiene todos los productos disponibles, o filtra por categoría (?categoria=...) o por ofertas (?oferta=true). Acceso público."
    )
    public ResponseEntity<List<Producto>> obtenerProductos(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Boolean oferta) {

        if (Boolean.TRUE.equals(oferta)) {
            return ResponseEntity.ok(productoService.obtenerOfertas());
        }
        if (categoria != null && !categoria.trim().isEmpty() && !categoria.equalsIgnoreCase("Todas")) {
            return ResponseEntity.ok(productoService.obtenerPorCategoria(categoria));
        }
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Crear un nuevo producto",
            description = "Registra un producto en el catálogo (Solo rol ADMIN)"
    )
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.guardarProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Eliminar un producto",
            description = "Elimina un producto del catálogo por su ID (Solo rol ADMIN)"
    )
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
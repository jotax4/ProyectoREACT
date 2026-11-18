package com.example.demo.controller;

import com.example.demo.entity.ProductoEntity;
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
    @Operation(summary = "Listar o filtrar productos")
    public ResponseEntity<List<ProductoEntity>> obtenerProductos(
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
    @Operation(summary = "Crear un nuevo producto (Solo rol ADMIN)")
    public ResponseEntity<ProductoEntity> crearProducto(@RequestBody ProductoEntity producto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.guardarProducto(producto));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Actualizar un producto (Solo rol ADMIN)")
    public ResponseEntity<ProductoEntity> actualizarProducto(
            @PathVariable Long id,
            @RequestBody ProductoEntity producto) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, producto));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Eliminar un producto (Solo rol ADMIN)")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
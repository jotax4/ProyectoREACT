package com.example.demo.controller;

import com.example.demo.model.Categoria;
import com.example.demo.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Categorías", description = "CRUD para la gestión de categorías de productos")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    @Operation(summary = "Listar todas las categorías")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(categoriaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una categoría por su ID")
    public ResponseEntity<Categoria> obtenerCategoria(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.obtenerPorId(id));
    }

    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Crear una nueva categoría (Requiere rol ADMIN)")
    public ResponseEntity<Categoria> crearCategoria(@Valid @RequestBody Categoria categoria) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crear(categoria));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Actualizar una categoría existente (Requiere rol ADMIN)")
    public ResponseEntity<Categoria> actualizarCategoria(@PathVariable Long id, @Valid @RequestBody Categoria categoria) {
        return ResponseEntity.ok(categoriaService.actualizar(id, categoria));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Eliminar una categoría (Requiere rol ADMIN)")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173") 
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // Obtiene todos los productos, o filtra por categoría (/api/productos?categoria=Consolas) 
    // o por ofertas (/api/productos?oferta=true)
    @GetMapping
    public List<Producto> obtenerProductos(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Boolean oferta) {
        
        if (Boolean.TRUE.equals(oferta)) {
            return productoService.obtenerOfertas();
        }
        if (categoria != null && !categoria.trim().isEmpty() && !categoria.equalsIgnoreCase("Todas")) {
            return productoService.obtenerPorCategoria(categoria);
        }
        return productoService.listarTodos();
    }

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.guardarProducto(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }
}
package com.example.demo.service;

import com.example.demo.entity.CategoriaEntity;
import com.example.demo.entity.ProductoEntity;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<ProductoEntity> listarTodos() {
        return productoRepository.findAll();
    }

    public List<ProductoEntity> obtenerPorCategoria(String categoria) {
        return productoRepository.findByCategoriaNombreIgnoreCase(categoria);
    }

    public List<ProductoEntity> obtenerOfertas() {
        return productoRepository.findByOfertaTrue();
    }

    public ProductoEntity guardarProducto(ProductoEntity producto) {
        vincularCategoria(producto);
        return productoRepository.save(producto);
    }

    public ProductoEntity actualizarProducto(Long id, ProductoEntity detalles) {
        ProductoEntity existente = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        existente.setNombre(detalles.getNombre());
        existente.setPrecio(detalles.getPrecio());
        existente.setOferta(detalles.getOferta());
        existente.setPrecioOferta(detalles.getPrecioOferta());
        existente.setImagen(detalles.getImagen());
        existente.setCategoria(detalles.getCategoria());
        vincularCategoria(existente);

        return productoRepository.save(existente);
    }

    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    private void vincularCategoria(ProductoEntity producto) {
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            CategoriaEntity cat = categoriaRepository.findById(producto.getCategoria().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría no válida"));
            producto.setCategoria(cat);
        }
    }
}
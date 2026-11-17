package com.example.demo.service;

import com.example.demo.entity.ProductoEntity;
import com.example.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

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
        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }
}
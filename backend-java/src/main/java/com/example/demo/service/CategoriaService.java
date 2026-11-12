package com.example.demo.service;

import com.example.demo.model.Categoria;
import com.example.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Categoria obtenerPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con ID: " + id));
    }

    public Categoria crear(Categoria categoria) {
        if (categoriaRepository.existsByNombreIgnoreCase(categoria.getNombre().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe una categoría con ese nombre");
        }
        categoria.setNombre(categoria.getNombre().trim());
        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Long id, Categoria detalles) {
        Categoria categoriaExistente = obtenerPorId(id);
        categoriaExistente.setNombre(detalles.getNombre().trim());
        categoriaExistente.setDescripcion(detalles.getDescripcion());
        return categoriaRepository.save(categoriaExistente);
    }

    public void eliminar(Long id) {
        Categoria categoria = obtenerPorId(id);
        categoriaRepository.delete(categoria);
    }
}
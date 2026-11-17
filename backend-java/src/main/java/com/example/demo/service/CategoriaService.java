package com.example.demo.service;

import com.example.demo.entity.CategoriaEntity;
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

    public List<CategoriaEntity> listarTodas() {
        return categoriaRepository.findAll();
    }

    public CategoriaEntity obtenerPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con ID: " + id));
    }

    public CategoriaEntity crear(CategoriaEntity categoria) {
        if (categoriaRepository.existsByNombreIgnoreCase(categoria.getNombre().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe una categoría con ese nombre");
        }
        categoria.setNombre(categoria.getNombre().trim());
        return categoriaRepository.save(categoria);
    }

    public CategoriaEntity actualizar(Long id, CategoriaEntity detalles) {
        CategoriaEntity categoriaExistente = obtenerPorId(id);
        categoriaExistente.setNombre(detalles.getNombre().trim());
        categoriaExistente.setDescripcion(detalles.getDescripcion());
        return categoriaRepository.save(categoriaExistente);
    }

    public void eliminar(Long id) {
        CategoriaEntity categoria = obtenerPorId(id);
        categoriaRepository.delete(categoria);
    }
}
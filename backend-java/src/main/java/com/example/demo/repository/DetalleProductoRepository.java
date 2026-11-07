package com.example.demo.repository;

import com.example.demo.model.DetalleProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleProductoRepository extends JpaRepository<DetalleProducto, Long> {

    // Obtener todos los detalles pertenecientes a un pedido en específico
    List<DetalleProducto> findByPedidoId(Long pedidoId);
}
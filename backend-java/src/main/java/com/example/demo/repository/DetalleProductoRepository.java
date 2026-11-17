package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.DetalleProductoEntity;

import java.util.List;

@Repository
public interface DetalleProductoRepository extends JpaRepository<DetalleProductoEntity, Long> {

    // Obtener todos los detalles pertenecientes a un pedido en específico
    List<DetalleProductoEntity> findByPedidoId(Long pedidoId);
}
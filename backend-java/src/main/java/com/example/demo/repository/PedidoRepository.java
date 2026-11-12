package com.example.demo.repository;

import com.example.demo.model.EstadoPedido;
import com.example.demo.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Método derivado para buscar pedidos por su estado (PENDIENTE, ENVIADO, etc.)
    List<Pedido> findByEstado(EstadoPedido estado);
}
package com.example.demo.repository;

import com.example.demo.entity.PedidoEntity;
import com.example.demo.model.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<PedidoEntity, Long> {

    List<PedidoEntity> findByEstado(EstadoPedido estado);

    List<PedidoEntity> findAllByOrderByFechaDesc();

    List<PedidoEntity> findByPersonaEmailOrderByFechaDesc(String email);
}
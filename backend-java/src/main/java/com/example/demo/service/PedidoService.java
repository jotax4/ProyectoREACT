package com.example.demo.service;

import com.example.demo.model.DetalleProducto;
import com.example.demo.model.Pedido;
import com.example.demo.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPedidos() {
        return listarTodos();
    }

    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        int totalCalculado = 0;

        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            for (DetalleProducto detalle : pedido.getDetalles()) {
                detalle.setPedido(pedido);
                if (detalle.getPrecioUnitario() != null && detalle.getCantidad() != null) {
                    int subtotal = detalle.getPrecioUnitario() * detalle.getCantidad();
                    detalle.setSubtotal(subtotal);
                    totalCalculado += subtotal;
                }
            }
        }

        if (pedido.getTotal() == null || pedido.getTotal() == 0) {
            pedido.setTotal(totalCalculado);
        }

        return pedidoRepository.save(pedido);
    }

    public Pedido guardarPedido(Pedido pedido) {
        return crearPedido(pedido);
    }
}
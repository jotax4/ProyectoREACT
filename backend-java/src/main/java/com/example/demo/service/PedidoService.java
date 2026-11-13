package com.example.demo.service;

import com.example.demo.model.DetalleProducto;
import com.example.demo.model.EstadoPedido;
import com.example.demo.model.Pedido;
import com.example.demo.model.Persona;
import com.example.demo.model.Producto;
import com.example.demo.repository.PedidoRepository;
import com.example.demo.repository.PersonaRepository;
import com.example.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Pedido> obtenerPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        if (pedido.getFecha() == null) {
            pedido.setFecha(LocalDateTime.now());
        }
        if (pedido.getEstado() == null) {
            pedido.setEstado(EstadoPedido.PENDIENTE);
        }

        // Normalizar datos de despacho y contacto
        if (pedido.getDireccion() != null) {
            pedido.setDireccion(pedido.getDireccion().trim());
        }
        if (pedido.getTelefono() != null) {
            pedido.setTelefono(pedido.getTelefono().trim());
        }
        if (pedido.getMetodoEnvio() == null || pedido.getMetodoEnvio().isBlank()) {
            boolean tieneDireccion = pedido.getDireccion() != null && !pedido.getDireccion().isEmpty();
            pedido.setMetodoEnvio(tieneDireccion ? "Despacho a domicilio" : "Retiro en tienda");
        } else {
            pedido.setMetodoEnvio(pedido.getMetodoEnvio().trim());
        }

        // Vincular Persona existente desde la base de datos
        if (pedido.getPersona() != null && pedido.getPersona().getId() != null) {
            Persona persona = personaRepository.findById(pedido.getPersona().getId())
                    .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + pedido.getPersona().getId()));
            pedido.setPersona(persona);
        }

        // Vincular cada DetalleProducto con el Pedido y su Producto real
        double totalCalculado = 0.0;
        if (pedido.getDetalles() != null) {
            for (DetalleProducto detalle : pedido.getDetalles()) {
                detalle.setPedido(pedido);

                if (detalle.getProducto() != null && detalle.getProducto().getId() != null) {
                    Producto producto = productoRepository.findById(detalle.getProducto().getId())
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + detalle.getProducto().getId()));
                    detalle.setProducto(producto);

                    if (detalle.getPrecioUnitario() == null && producto.getPrecio() != null) {
                        detalle.setPrecioUnitario(((Number) producto.getPrecio()).intValue());
                    }
                }

                if (detalle.getCantidad() != null && detalle.getPrecioUnitario() != null) {
                    int subtotal = detalle.getCantidad() * detalle.getPrecioUnitario();
                    detalle.setSubtotal(subtotal);
                    totalCalculado += subtotal;
                }
            }
        }

        if (pedido.getTotal() == null) {
            pedido.setTotal(totalCalculado);
        }

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido actualizarEstado(Long id, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));

        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }
}
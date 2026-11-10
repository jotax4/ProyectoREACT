package com.example.demo.controller;

import com.example.demo.model.EstadoPedido;
import com.example.demo.model.Pedido;
import com.example.demo.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // GET /api/pedidos - Obtener todos los pedidos
    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerTodos() {
        return ResponseEntity.ok(pedidoService.obtenerTodos());
    }

    // GET /api/pedidos/{id} - Obtener un pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long id) {
        return pedidoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/pedidos - Crear un nuevo pedido
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        Pedido nuevoPedido = pedidoService.crearPedido(pedido);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
    }

    // PATCH /api/pedidos/{id}/estado - Actualizar unicamente el estado del pedido
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload
    ) {
        String estadoStr = payload.get("estado");
        if (estadoStr == null || estadoStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El campo 'estado' es obligatorio.");
        }

        try {
            EstadoPedido nuevoEstado = EstadoPedido.valueOf(estadoStr.toUpperCase());
            Pedido pedidoActualizado = pedidoService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado no válido. Valores aceptados: PENDIENTE, EN_PREPARACION, ENVIADO, ENTREGADO, CANCELADO");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
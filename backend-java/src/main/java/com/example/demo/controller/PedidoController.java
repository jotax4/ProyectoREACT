package com.example.demo.controller;

import com.example.demo.model.EstadoPedido;
import com.example.demo.model.Pedido;
import com.example.demo.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Pedidos", description = "Gestión de órdenes de compra y actualización de estados")
@SecurityRequirement(name = "Bearer Authentication")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    @Operation(summary = "Listar todos los pedidos", description = "Obtiene el listado completo de pedidos registrados (Roles: ADMIN, VENDEDOR)")
    public ResponseEntity<List<Pedido>> obtenerTodos() {
        return ResponseEntity.ok(pedidoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pedido por ID", description = "Consulta el detalle de un pedido específico por su identificador (Roles: ADMIN, VENDEDOR)")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long id) {
        return pedidoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo pedido", description = "Registra una nueva orden de compra con datos de despacho y detalle de productos (Requiere sesión iniciada)")
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido) {
        try {
            if (pedido.getMetodoEnvio() == null || pedido.getMetodoEnvio().isBlank()) {
                boolean tieneDireccion = pedido.getDireccion() != null && !pedido.getDireccion().isBlank();
                pedido.setMetodoEnvio(tieneDireccion ? "Despacho a domicilio" : "Retiro en tienda");
            }

            Pedido nuevoPedido = pedidoService.crearPedido(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Error al procesar el pedido"));
        }
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado del pedido", description = "Cambia el estado a PENDIENTE, EN_PREPARACION, ENVIADO, ENTREGADO o CANCELADO (Roles: ADMIN, VENDEDOR)")
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
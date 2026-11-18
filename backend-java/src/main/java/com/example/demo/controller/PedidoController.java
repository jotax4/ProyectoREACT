package com.example.demo.controller;

import com.example.demo.entity.PedidoEntity;
import com.example.demo.model.EstadoPedido;
import com.example.demo.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    @Operation(summary = "Listar todos los pedidos (Roles: ADMIN, VENDEDOR)")
    public ResponseEntity<List<PedidoEntity>> obtenerTodos() {
        return ResponseEntity.ok(pedidoService.obtenerTodos());
    }

    @GetMapping("/mis-pedidos")
    @Operation(summary = "Listar los pedidos del cliente autenticado")
    public ResponseEntity<List<PedidoEntity>> obtenerMisPedidos(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(pedidoService.obtenerPorEmailCliente(email));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pedido por ID (Roles: ADMIN, VENDEDOR)")
    public ResponseEntity<PedidoEntity> obtenerPorId(@PathVariable Long id) {
        return pedidoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo pedido (Requiere sesión iniciada)")
    public ResponseEntity<?> crearPedido(@RequestBody PedidoEntity pedido, Authentication authentication) {
        try {
            if (pedido.getMetodoEnvio() == null || pedido.getMetodoEnvio().isBlank()) {
                boolean tieneDireccion = pedido.getDireccion() != null && !pedido.getDireccion().isBlank();
                pedido.setMetodoEnvio(tieneDireccion ? "Despacho a domicilio" : "Retiro en tienda");
            }

            String emailAuth = authentication != null ? authentication.getName() : null;
            PedidoEntity nuevoPedido = pedidoService.crearPedido(pedido, emailAuth);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Error al procesar el pedido"));
        }
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado del pedido (Roles: ADMIN, VENDEDOR)")
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
            PedidoEntity pedidoActualizado = pedidoService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado no válido. Valores aceptados: PENDIENTE, EN_PREPARACION, ENVIADO, ENTREGADO, CANCELADO");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
package com.example.demo.controller;

import com.example.demo.model.Pedido;
import com.example.demo.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public List<Pedido> obtenerPedidos() {
        return pedidoService.listarPedidos();
    }

    @PostMapping
    public Pedido crearPedido(@RequestBody Map<String, Object> payload) {
        // Extraemos los datos del JSON que envía React
        Map<String, String> cliente = (Map<String, String>) payload.get("cliente");
        Integer total = (Integer) payload.get("total");
        String envio = (String) payload.get("envio");

        
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setNombreCliente(cliente.get("nombre"));
        nuevoPedido.setEmailCliente(cliente.get("email"));
        nuevoPedido.setDireccion(cliente.get("direccion"));
        nuevoPedido.setTelefono(cliente.get("telefono"));
        nuevoPedido.setMetodoEnvio(envio);
        nuevoPedido.setTotal(total);

        return pedidoService.guardarPedido(nuevoPedido);
    }
}
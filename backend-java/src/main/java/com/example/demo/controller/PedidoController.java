package com.example.demo.controller;

import com.example.demo.model.DetalleProducto;
import com.example.demo.model.Pedido;
import com.example.demo.model.Producto;
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
        return pedidoService.listarTodos();
    }

    @PostMapping
    @SuppressWarnings({"unchecked", "rawtypes"})
    public Pedido crearPedido(@RequestBody Map<String, Object> payload) {
        Map cliente = (Map) payload.get("cliente");
        Number totalNum = (Number) payload.get("total");
        String envio = (String) payload.get("envio");

        Pedido nuevoPedido = new Pedido();

        if (cliente != null) {
            nuevoPedido.setNombreCliente((String) cliente.get("nombre"));
            nuevoPedido.setEmailCliente((String) cliente.get("email"));
            nuevoPedido.setDireccion((String) cliente.get("direccion"));
            nuevoPedido.setTelefono((String) cliente.get("telefono"));
        }

        nuevoPedido.setMetodoEnvio(envio);
        nuevoPedido.setTotal(totalNum != null ? totalNum.intValue() : 0);

        List items = (List) payload.get("items");
        if (items != null) {
            for (Object obj : items) {
                Map item = (Map) obj;
                DetalleProducto detalle = new DetalleProducto();

                Producto producto = new Producto();
                Number prodId = (Number) item.get("id");
                if (prodId != null) {
                    producto.setId(prodId.longValue());
                }
                detalle.setProducto(producto);

                Number cantidad = (Number) item.get("cantidad");
                Number precio = (Number) item.get("precio");

                detalle.setCantidad(cantidad != null ? cantidad.intValue() : 1);
                detalle.setPrecioUnitario(precio != null ? precio.intValue() : 0);

                nuevoPedido.agregarDetalle(detalle);
            }
        }

        return pedidoService.crearPedido(nuevoPedido);
    }
}
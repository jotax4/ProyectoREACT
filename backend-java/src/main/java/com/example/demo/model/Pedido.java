package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreCliente;
    private String emailCliente;
    private String direccion;
    private String telefono;
    private String metodoEnvio;
    private Integer total;
    private LocalDateTime fechaCompra;

    // Relación maestro-detalle con la lista de productos comprados en esta boleta/pedido
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleProducto> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        fechaCompra = LocalDateTime.now();
    }

    // Método helper para asociar ítems al pedido
    public void agregarDetalle(DetalleProducto detalle) {
        detalles.add(detalle);
        detalle.setPedido(this);
    }

    // --- GETTERS Y SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }

    public String getEmailCliente() { return emailCliente; }
    public void setEmailCliente(String emailCliente) { this.emailCliente = emailCliente; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getMetodoEnvio() { return metodoEnvio; }
    public void setMetodoEnvio(String metodoEnvio) { this.metodoEnvio = metodoEnvio; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public LocalDateTime getFechaCompra() { return fechaCompra; }
    public void setFechaCompra(LocalDateTime fechaCompra) { this.fechaCompra = fechaCompra; }

    public List<DetalleProducto> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleProducto> detalles) { this.detalles = detalles; }
}
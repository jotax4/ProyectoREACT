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

    private LocalDateTime fecha;

    private Double total;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "metodo_envio")
    private String metodoEnvio;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    @ManyToOne
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleProducto> detalles = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
        if (this.estado == null) {
            this.estado = EstadoPedido.PENDIENTE;
        }
        if (this.detalles != null) {
            for (DetalleProducto detalle : this.detalles) {
                detalle.setPedido(this);
            }
        }
    }

    public Pedido() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getMetodoEnvio() { return metodoEnvio; }
    public void setMetodoEnvio(String metodoEnvio) { this.metodoEnvio = metodoEnvio; }

    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }

    public Persona getPersona() { return persona; }
    public void setPersona(Persona persona) { this.persona = persona; }

    public List<DetalleProducto> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleProducto> detalles) {
        this.detalles = detalles;
        if (detalles != null) {
            for (DetalleProducto detalle : detalles) {
                detalle.setPedido(this);
            }
        }
    }
}
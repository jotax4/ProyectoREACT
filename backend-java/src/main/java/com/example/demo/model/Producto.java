package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String categoria;
    private Integer precio;
    private Boolean oferta;
    private Integer precioOferta;
    private String imagen;

    // Getters y Setters (puedes generarlos automáticamente en tu IDE)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Integer getPrecio() { return precio; }
    public void setPrecio(Integer precio) { this.precio = precio; }
    public Boolean getOferta() { return oferta; }
    public void setOferta(Boolean oferta) { this.oferta = oferta; }
    public Integer getPrecioOferta() { return precioOferta; }
    public void setPrecioOferta(Integer precioOferta) { this.precioOferta = precioOferta; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}
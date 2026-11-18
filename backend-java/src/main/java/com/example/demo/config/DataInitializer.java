package com.example.demo.config;

import com.example.demo.entity.CategoriaEntity;
import com.example.demo.entity.PersonaEntity;
import com.example.demo.entity.ProductoEntity;
import com.example.demo.model.Rol;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.PersonaRepository;
import com.example.demo.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            CategoriaRepository categoriaRepository,
            ProductoRepository productoRepository,
            PersonaRepository personaRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.personaRepository = personaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Crear usuario ADMIN por defecto si no existe
        if (!personaRepository.existsByEmail("admin@levelupgamer.cl")) {
            PersonaEntity admin = new PersonaEntity();
            admin.setRut("11111111-1");
            admin.setNombre("Administrador LevelUp");
            admin.setEmail("admin@levelupgamer.cl");
            admin.setFechaNacimiento(LocalDate.of(1995, 5, 15));
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ADMIN);
            personaRepository.save(admin);
        }

        // 2. Poblar categorías y productos en MySQL si la tabla está vacía
        if (categoriaRepository.count() == 0 && productoRepository.count() == 0) {
            CategoriaEntity consolas = categoriaRepository.save(
                    new CategoriaEntity(null, "Consolas", "Consolas de última generación y portátiles")
            );
            CategoriaEntity juegos = categoriaRepository.save(
                    new CategoriaEntity(null, "Juegos", "Videojuegos físicos y ediciones especiales")
            );
            CategoriaEntity accesorios = categoriaRepository.save(
                    new CategoriaEntity(null, "Accesorios", "Periféricos, mandos, audio y sillas gamer")
            );

            List<ProductoEntity> productosIniciales = List.of(
                    crearProducto("Consola PlayStation 5", consolas, 549990, true, 499990,
                            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500"),
                    crearProducto("Nintendo Switch OLED", consolas, 349990, false, 0,
                            "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500"),
                    crearProducto("Xbox Series X", consolas, 479990, false, 0,
                            "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500"),
                    crearProducto("Consola Portátil PlayStation Portal", consolas, 249990, true, 219990,
                            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500"),
                    crearProducto("The Legend of Zelda: Tears of the Kingdom", juegos, 59990, false, 0,
                            "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500"),
                    crearProducto("Spider-Man 2 PS5", juegos, 59990, false, 0,
                            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500"),
                    crearProducto("Control Inalámbrico Xbox", accesorios, 69990, true, 54990,
                            "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500"),
                    crearProducto("Audífonos Gamer Inalámbricos HyperX", accesorios, 89990, true, 69990,
                            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"),
                    crearProducto("Silla Gamer Ergonómica Premium", accesorios, 159990, false, 0,
                            "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500")
            );

            productoRepository.saveAll(productosIniciales);
        }
    }

    private ProductoEntity crearProducto(
            String nombre, CategoriaEntity categoria, int precio, boolean oferta, int precioOferta, String imagen
    ) {
        ProductoEntity p = new ProductoEntity();
        p.setNombre(nombre);
        p.setCategoria(categoria);
        p.setPrecio(precio);
        p.setOferta(oferta);
        p.setPrecioOferta(precioOferta);
        p.setImagen(imagen);
        return p;
    }
}
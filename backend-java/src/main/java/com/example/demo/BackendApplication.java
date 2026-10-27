package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void printRunningMessage() {
        System.out.println("\n----------------------------------------------------------");
        System.out.println("🚀 ¡EL BACKEND ESTÁ CORRIENDO CORRECTAMENTE!");
        System.out.println("URL Local: http://localhost:8081");
        System.out.println("----------------------------------------------------------\n");
    }
}
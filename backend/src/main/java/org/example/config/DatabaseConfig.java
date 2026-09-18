package org.example.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.PostConstruct;

@Configuration
public class DatabaseConfig {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void testConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("Database connection successful");
        } catch (Exception e) {
            System.err.println("Database connection failed: " + e.getMessage());
        }
    }
}
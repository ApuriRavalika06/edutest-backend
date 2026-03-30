package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import com.example.demo.util.JwtUtil;

import java.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ✅ REGISTER (password hashed with BCrypt)
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Student student) {
        Map<String, Object> response = new HashMap<>();

        Optional<Student> existing = studentRepository.findByUsername(student.getUsername());
        if (existing.isPresent()) {
            response.put("success", false);
            response.put("message", "Username already exists!");
            return response;
        }

        // Hash password before saving
        student.setPassword(encoder.encode(student.getPassword()));

        if (student.getRole() == null || student.getRole().isEmpty()) {
            student.setRole("ROLE_STUDENT");
        }
        studentRepository.save(student);

        response.put("success", true);
        response.put("message", "Registered successfully");
        return response;
    }

    // ✅ LOGIN (verify with BCrypt)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Student student) {
        Map<String, Object> response = new HashMap<>();

        Optional<Student> dbStudent = studentRepository.findByUsername(student.getUsername());

        if (dbStudent.isPresent()) {
            String storedPassword = dbStudent.get().getPassword();
            boolean matches;

            // Support both plain-text (admin seeded) and BCrypt hashed passwords
            if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
                matches = encoder.matches(student.getPassword(), storedPassword);
            } else {
                matches = storedPassword.equals(student.getPassword());
            }

            if (matches) {
                String token = JwtUtil.generateToken(student.getUsername());
                response.put("success", true);
                response.put("token", token);
                response.put("username", student.getUsername());
                response.put("role", dbStudent.get().getRole());
                return response;
            }
        }

        response.put("success", false);
        response.put("message", "Invalid Username or Password");
        return response;
    }
}
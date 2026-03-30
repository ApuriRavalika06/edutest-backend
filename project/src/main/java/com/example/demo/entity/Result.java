package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private int score;
    private int totalQuestions;
    private double percentage;

    // Getters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public int getScore() { return score; }
    public int getTotalQuestions() { return totalQuestions; }
    public double getPercentage() { return percentage; }

    // Setters
    public void setUsername(String username) { this.username = username; }
    public void setScore(int score) { this.score = score; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
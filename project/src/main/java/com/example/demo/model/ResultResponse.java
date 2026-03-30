package com.example.demo.model;

import java.util.List;
import java.util.Map;

public class ResultResponse {

    private int score;
    private int totalQuestions;
    private double percentage;
    private String message;
    private List<Map<String, String>> reviewData;

    public ResultResponse() {}

    public int getScore() { return score; }
    public int getTotalQuestions() { return totalQuestions; }
    public double getPercentage() { return percentage; }
    public String getMessage() { return message; }
    public List<Map<String, String>> getReviewData() { return reviewData; }

    public void setScore(int score) { this.score = score; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
    public void setMessage(String message) { this.message = message; }
    public void setReviewData(List<Map<String, String>> reviewData) { this.reviewData = reviewData; }
}
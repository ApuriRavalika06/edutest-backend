package com.example.demo.Result;

public class Result {

    private int score;
    private int totalQuestions;
    private double percentage;

    public Result() {
    }

    public Result(int score, int totalQuestions, double percentage) {
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
package com.example.demo.model;

public class StudentAnswer {

    private Long questionId;
    private String answer;

    // ✅ Default constructor
    public StudentAnswer() {
    }

    // ✅ Getters
    public Long getQuestionId() {
        return questionId;
    }

    public String getAnswer() {
        return answer;
    }

    // ✅ Setters
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Question;
import com.example.demo.entity.Result;
import com.example.demo.model.StudentAnswer;
import com.example.demo.model.ResultResponse;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.ResultRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/exam")
@CrossOrigin(origins = "http://localhost:3000")
public class ExamController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ResultRepository resultRepository;

    private Map<String, Long> sessionMap = new HashMap<>();

    // ✅ START EXAM
    @GetMapping("/start/{username}")
    public List<Question> startExam(@PathVariable String username) {
        sessionMap.put(username, System.currentTimeMillis());
        List<Question> questions = questionRepository.findRandomQuestions();
        Collections.shuffle(questions);
        return questions;
    }

    // ✅ SUBMIT EXAM — returns result + reviewData with explanations
    @PostMapping("/submit/{username}")
    public ResultResponse submitExam(@PathVariable String username,
                                     @RequestBody List<StudentAnswer> answers) {

        if (!sessionMap.containsKey(username)) {
            throw new RuntimeException("Exam not started!");
        }

        int score = 0;
        List<Map<String, String>> reviewData = new ArrayList<>();

        for (StudentAnswer ans : answers) {
            Optional<Question> optQ = questionRepository.findById(ans.getQuestionId());
            if (optQ.isPresent()) {
                Question q = optQ.get();
                boolean isCorrect = q.getCorrectAnswer() != null
                        && ans.getAnswer() != null
                        && q.getCorrectAnswer().equalsIgnoreCase(ans.getAnswer());

                if (isCorrect) score++;

                Map<String, String> entry = new HashMap<>();
                entry.put("question",      q.getQuestion());
                entry.put("yourAnswer",    ans.getAnswer() != null ? ans.getAnswer() : "Not answered");
                entry.put("correctAnswer", q.getCorrectAnswer());
                entry.put("optionA",       q.getOptionA());
                entry.put("optionB",       q.getOptionB());
                entry.put("optionC",       q.getOptionC());
                entry.put("optionD",       q.getOptionD());
                entry.put("correct",       String.valueOf(isCorrect));
                entry.put("category",      q.getCategory() != null ? q.getCategory() : "General");
                // ✅ Include explanation so student can learn after quiz
                entry.put("explanation",   q.getExplanation() != null ? q.getExplanation() : "");
                reviewData.add(entry);
            }
        }

        int total = answers.size();
        double percentage = total > 0 ? ((double) score / total) * 100 : 0;

        // Save to DB
        Result resultEntity = new Result();
        resultEntity.setUsername(username);
        resultEntity.setScore(score);
        resultEntity.setTotalQuestions(total);
        resultEntity.setPercentage(percentage);
        resultRepository.save(resultEntity);

        // Build response
        ResultResponse response = new ResultResponse();
        response.setScore(score);
        response.setTotalQuestions(total);
        response.setPercentage(percentage);
        response.setReviewData(reviewData);

        if (percentage >= 80) response.setMessage("Excellent Performance!");
        else if (percentage >= 50) response.setMessage("Good Job! You Passed!");
        else response.setMessage("Better luck next time!");

        sessionMap.remove(username);
        return response;
    }

    // ✅ LEADERBOARD
    @GetMapping("/leaderboard")
    public List<Result> getLeaderboard() {
        List<Result> all = resultRepository.findAll();
        all.sort((a, b) -> Double.compare(b.getPercentage(), a.getPercentage()));
        return all;
    }

    // ✅ STUDENT HISTORY — personal quiz results
    @GetMapping("/results/{username}")
    public List<Result> getByUsername(@PathVariable String username) {
        return resultRepository.findByUsernameOrderByIdDesc(username);
    }

    // ✅ FLASHCARD STUDY MODE — returns all questions with correctAnswer + explanation exposed
    @GetMapping("/flashcards")
    public List<Map<String, String>> getFlashcards() {
        List<Question> questions = questionRepository.findAll();
        Collections.shuffle(questions);
        return questions.stream().map(q -> {
            Map<String, String> card = new LinkedHashMap<>();
            card.put("id",            String.valueOf(q.getId()));
            card.put("question",      q.getQuestion());
            card.put("optionA",       q.getOptionA());
            card.put("optionB",       q.getOptionB());
            card.put("optionC",       q.getOptionC());
            card.put("optionD",       q.getOptionD());
            card.put("correctAnswer", q.getCorrectAnswer() != null ? q.getCorrectAnswer() : "");
            card.put("explanation",   q.getExplanation() != null ? q.getExplanation() : "No explanation provided.");
            card.put("category",      q.getCategory() != null ? q.getCategory() : "General");
            return card;
        }).collect(Collectors.toList());
    }
}
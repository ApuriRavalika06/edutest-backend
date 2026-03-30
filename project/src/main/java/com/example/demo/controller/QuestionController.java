package com.example.demo.controller;

import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ GET all questions
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // ✅ POST add question
    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionRepository.save(question);
    }

    // ✅ PUT update question (for admin edit)
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question updated) {
        Optional<Question> existing = questionRepository.findById(id);
        if (existing.isPresent()) {
            Question q = existing.get();
            q.setQuestion(updated.getQuestion());
            q.setOptionA(updated.getOptionA());
            q.setOptionB(updated.getOptionB());
            q.setOptionC(updated.getOptionC());
            q.setOptionD(updated.getOptionD());
            q.setCorrectAnswer(updated.getCorrectAnswer());
            q.setCategory(updated.getCategory());
            return questionRepository.save(q);
        }
        throw new RuntimeException("Question not found");
    }

    // ✅ DELETE question
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
    }

    // ✅ GET random questions
    @GetMapping("/random")
    public List<Question> getRandomQuestions() {
        return questionRepository.findRandomQuestions();
    }

    // ✅ GET questions by category
    @GetMapping("/category/{category}")
    public List<Question> getByCategory(@PathVariable String category) {
        return questionRepository.findByCategory(category);
    }

    // ✅ GET all distinct categories
    @GetMapping("/categories")
    public List<String> getCategories() {
        return questionRepository.findDistinctCategories();
    }

    // ✅ GET all students (admin only)
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}
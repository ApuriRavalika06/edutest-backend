package com.example.demo.repository;

import com.example.demo.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Get random 5 questions
    @Query(value = "SELECT * FROM question ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<Question> findRandomQuestions();

    // Get by category
    List<Question> findByCategory(String category);

    // Get distinct categories
    @Query(value = "SELECT DISTINCT category FROM question WHERE category IS NOT NULL", nativeQuery = true)
    List<String> findDistinctCategories();
}
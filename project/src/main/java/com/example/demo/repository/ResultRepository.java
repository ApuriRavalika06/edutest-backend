package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Result;
import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findTop5ByOrderByScoreDesc();
    List<Result> findByUsernameOrderByIdDesc(String username);
}
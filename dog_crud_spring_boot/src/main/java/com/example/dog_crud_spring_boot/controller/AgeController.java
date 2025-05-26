package com.example.dog_crud_spring_boot.controller;

import com.example.dog_crud_spring_boot.dto.PostRequestDto;
import com.example.dog_crud_spring_boot.model.Age;
import com.example.dog_crud_spring_boot.repository.AgeRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 年齢に関するAPIを提供するコントローラ
 * ※ユーザーは年齢に関する値を使用することはできるが編集することはできない。
 * すべて取得するもの処理のみを行う
 */
@RestController
@RequestMapping("/api/ages")
public class AgeController {

    private final AgeRepository ageRepository;

    /**
     * AgeControllerのコンストラクタ
     * 
     * @param ageRepository 年齢データへのアクセスを提供するリポジトリ
     */
    public AgeController(AgeRepository ageRepository) {
        this.ageRepository = ageRepository;
    }

    @GetMapping("/all")
    public  ResponseEntity<List<Age>> getAll(){
        List<Age> ageList = ageRepository.findAllByOrderBySortOrderAsc();
        return ResponseEntity.ok(ageList);
    }
}
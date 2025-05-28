package com.example.dog_crud_spring_boot.config;

import com.example.dog_crud_spring_boot.model.Age;
import com.example.dog_crud_spring_boot.repository.AgeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * アプリケーション起動時に Ageテーブルへ初期データを登録するクラス。
 * CommandLineRunnerを使用して、データベースに既存データが存在しない場合のみ、
 * デフォルトの年齢データ（例：「子犬」「成犬」「老犬」）を登録する。
 */
@Configuration
public class DataInitializer {

    /**
     * AgeRepositoryを使用してAgeテーブルに初期データを投入するCommandLineRunnerを生成する
     *
     * @param ageRepository Ageエンティティのリポジトリ
     * @return 初期化処理を行うCommandLineRunner
     */
    @Bean
    CommandLineRunner initDatabase(AgeRepository ageRepository) {
        return args -> {
            if (ageRepository.count() == 0) {
                ageRepository.save(new Age("子犬", 1L));
                ageRepository.save(new Age("成犬", 2L));
                ageRepository.save(new Age("老犬", 3L));
            }
        };
    }
}

package com.blaze.elmis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ElmisApplication {

	public static void main(String[] args) {
		SpringApplication.run(ElmisApplication.class, args);
	}

}

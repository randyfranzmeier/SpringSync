package com.springsync.springsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class SpringSyncApplication {

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				// Allow all origins for now as this is only enabled in a local dev environment
				registry.addMapping("/**").allowedOrigins("*");
			}
		};
	}

	public static void main(String[] args) {

		SpringApplication.run(SpringSyncApplication.class, args);
		System.out.println("Successfully started server!");
	}

}

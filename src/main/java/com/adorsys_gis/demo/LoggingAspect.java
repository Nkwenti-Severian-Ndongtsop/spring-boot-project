package com.adorsys_gis.demo;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    
    @Before("execution(* com.adorsys_gis.demo.HelloWorldController.greet())")
    public void logBeforeGreeting() {
        logger.info("About to execute greeting.");
    }
}
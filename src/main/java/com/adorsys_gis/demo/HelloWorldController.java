package com.adorsys_gis.demo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Slf4j
@Controller
@ResponseBody
public class HelloWorldController {

    @RequestMapping("/hello")
    public String greet() {
        log.info("Executing the /hello endpoint");
        return "Hello World";
    }
}

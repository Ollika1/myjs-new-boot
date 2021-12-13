package ol.js.boot.myjsnewboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping
public class UserController {

    @GetMapping("/admin")
    public String getIndex() {
        return "pages/index";
    }
    @GetMapping("/user")
    public String pageForUser(){
        return "pages/user";
    }
    @GetMapping("/login")
    public String loginPage(){
        return "pages/login";
    }

}

package ol.js.boot.myjsnewboot.controller;

import ol.js.boot.myjsnewboot.ExeptionHandler.DataInfoHandler;
import ol.js.boot.myjsnewboot.ExeptionHandler.UserWithSuchEmailExist;
import ol.js.boot.myjsnewboot.model.User;
import ol.js.boot.myjsnewboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class RestUserController {

    private final UserService userService;

    @Autowired
    public RestUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<Set<User>> getAllUsers() {
        Set<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getOneUser(@PathVariable("id") long id) {
        User user = userService.findUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<DataInfoHandler> addNewUser(@Valid @RequestBody User user,
                                                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String error = getErrorsFromBindingResult(bindingResult);
            return new ResponseEntity<>(new DataInfoHandler(error), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.addNewUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new UserWithSuchEmailExist("User with such email exists");
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<DataInfoHandler> updateUser(@PathVariable("id") long id,
                                              @RequestBody @Valid User user,
                                              BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String error = getErrorsFromBindingResult(bindingResult);
            return new ResponseEntity<>(new DataInfoHandler(error), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.updateUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new UserWithSuchEmailExist("User with such email exists");
        }
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<DataInfoHandler> deleteUser(@PathVariable("id") long id) {
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @DeleteMapping("users/{id}")
//    public ResponseEntity<DataInfoHandler> deleteUser(@PathVariable("id") long id) {
//        userService.deleteUserById(id);
//        return new ResponseEntity<>(new DataInfoHandler("User was deleted"), HttpStatus.OK);
//    }

    private String getErrorsFromBindingResult(BindingResult bindingResult) {
        return bindingResult.getFieldErrors()
                .stream()
                .map(x -> x.getDefaultMessage())
                .collect(Collectors.joining("; "));
    }

}

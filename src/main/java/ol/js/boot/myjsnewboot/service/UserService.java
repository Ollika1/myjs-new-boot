package ol.js.boot.myjsnewboot.service;


import ol.js.boot.myjsnewboot.model.User;

import java.util.Set;

public interface UserService {
    User findByEmail(String email);
    void addNewUser(User user);
    Set<User> findAllUsers();
    User findUserById(long id);
    void deleteUserById(long id);
    void updateUser(User user);

}

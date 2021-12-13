package ol.js.boot.myjsnewboot.dao;

import ol.js.boot.myjsnewboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, Long> {
    User findByEmail(String email);
}

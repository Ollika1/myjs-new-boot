package ol.js.boot.myjsnewboot.ExeptionHandler;

import org.springframework.dao.DataIntegrityViolationException;

public class UserWithSuchEmailExist extends DataIntegrityViolationException {
    public UserWithSuchEmailExist(String msg) {
        super(msg);
    }
}

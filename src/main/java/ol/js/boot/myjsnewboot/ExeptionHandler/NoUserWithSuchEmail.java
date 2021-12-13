package ol.js.boot.myjsnewboot.ExeptionHandler;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class NoUserWithSuchEmail extends UsernameNotFoundException {

    public NoUserWithSuchEmail(String msg) {
        super(msg);
    }
}

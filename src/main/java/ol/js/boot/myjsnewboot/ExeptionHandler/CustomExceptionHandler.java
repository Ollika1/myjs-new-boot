package ol.js.boot.myjsnewboot.ExeptionHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {

    private final DataInfoHandler dataInfoHandler;

    @Autowired
    public CustomExceptionHandler(DataInfoHandler dataInfoHandler) {
        this.dataInfoHandler = dataInfoHandler;
    }

    @ExceptionHandler
    public ResponseEntity<DataInfoHandler> handleException(UserWithSuchEmailExist e) {
        return new ResponseEntity<>(dataInfoHandler.getInstanceWithInfo(e.getMessage()),
                HttpStatus.CONFLICT);
    }

}

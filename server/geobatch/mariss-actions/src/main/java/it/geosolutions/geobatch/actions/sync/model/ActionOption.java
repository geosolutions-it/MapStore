package it.geosolutions.geobatch.actions.sync.model;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * Mode for Input and Output
 * 
 * @author Lorenzo Natali, GeoSolutions
 *
 */
@XStreamAlias("ActionOption")
public class ActionOption {
    /**
     * The actionId of the source output must be used
     */
    private String inputSource;

    /**
     * Clone the Event Queue or consume it
     */
    private Mode mode;

    public String getInputSource() {
        return inputSource;
    }

    public void setInputSource(String inputSource) {
        this.inputSource = inputSource;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public enum Mode {
        CLONE, NORMAL
    }

}

/** ****************************************************************************
    Script Utility Classes...
    **************************************************************************** **/

import org.apache.commons.io.FileUtils
import org.apache.commons.io.FilenameUtils

/**
 * Utility Class for filtering Ship Detections files
 **/
public class NetCDFNameFilter implements FilenameFilter {

    public boolean accept(File dir, String name) {
        return name.matches(".*\\.nc");
    }
}

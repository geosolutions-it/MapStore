/** ****************************************************************************
    Script Utility Classes...
    **************************************************************************** **/

import org.apache.commons.io.FileUtils
import org.apache.commons.io.FilenameUtils

/**
 * Utility Class for filtering OilSpill files
 **/
public class OilSpillNameFilter implements FilenameFilter {

    public boolean accept(File dir, String name) {
        return name.matches(".*OS.\\.xml");
    }
}

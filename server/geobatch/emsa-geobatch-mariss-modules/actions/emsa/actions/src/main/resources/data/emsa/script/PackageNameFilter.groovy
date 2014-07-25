/** ****************************************************************************
    Script Utility Classes...
    **************************************************************************** **/

import org.apache.commons.io.FileUtils
import org.apache.commons.io.FilenameUtils

/**
 * Utility Class for filtering packages with same name
 **/
public class PackageNameFilter implements FilenameFilter {

    String prefix;

    public PackageNameFilter(String prefix) {
        this.prefix = prefix;
    }

    private PackageNameFilter() {

    }

    public boolean accept(File dir, String name) {
        String baseName = FilenameUtils.getBaseName(name);
        if (name.length() > 12 && name.substring(11).startsWith(prefix)) {
            return true;
        }

        return false;
    }
}


import it.geosolutions.geobatch.action.scripting.ScriptingConfiguration;
import it.geosolutions.geobatch.flow.event.ProgressListenerForwarder;
import it.geosolutions.geobatch.tools.file.Collector;
import it.geosolutions.geobatch.tools.file.Extract;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.DirectoryWalker;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOCase;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;

import java.util.logging.Level
import java.util.logging.Logger

import it.geosolutions.geobatch.flow.event.IProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListenerForwarder

/** 
 * Script Main "execute" function
 * @eventFilePath
 **/
public List execute(ScriptingConfiguration configuration, String eventFilePath, ProgressListenerForwarder listenerForwarder) throws Exception {
    // ////////////////////////////////////////////////////////////////////
    // Initializing input variables from Flow configuration
    // ////////////////////////////////////////////////////////////////////
     /*Map props = configuration.getProperties();
     String example0 = props.get("key0");
     String example1 = props.get("key1");*/
    
    /* ----------------------------------------------------------------- */
    // Main Input Variables: must be configured
    /**
     * The physical folder where to extract emsa packages
     **/
    def emsaExchangePhysicalDir = "/emsa/out/nfs/registered/";
    //def emsaExchangePhysicalDir = "C:/work/E-GEOS/EMSA/GEOBATCH_DATA_DIR/EMSA/EMSA_out_dir/registered/";
    //def emsaExchangePhysicalDir = "/home/carlo/work/data/emsa/out/";
    
    def readyFileName="PackagesReady.txt";

    final Logger LOGGER = Logger.getLogger(EMSA.class.toString());
    
    // results
    List results = new ArrayList();
    
    listenerForwarder.started();
//DEBUG
//System.out.println("FILE: "+eventFilePath);
    // check if in the incoming eventFilePath is present the PackagesReady.txt file
    // check if in the incoming eventFilePath is present the EOP Package
    
    //FileFilter filter=FileFilterUtils.nameFileFilter(readyFileName);
    FileFilter filter=FileFilterUtils.or(
				FileFilterUtils.nameFileFilter(readyFileName),
				new WildcardFileFilter("*_EOP.tgz",IOCase.SENSITIVE));
    // recived something/PackagesReady.txt
    File inDir=new File(eventFilePath).getParentFile(); // should be "something/"
    
    File[] readyFile=inDir.listFiles((FileFilter)filter);
//DEBUG
//int i=0;
//for (File f : readyFile) {
//System.out.println("Filtered "+(++i)+"FILE: "+f.getAbsolutePath());
//}
    // 1 - PackagesReady.txt file
    // 2 - EOP Package
    if (readyFile.length!=2){
//DEBUG
//System.out.println("ERROR");
        String message="::EMSAService : do not contain the needed \"" + readyFileName 
							+ "\" file and the EOP package ... STOPPING!"

        LOGGER.log(Level.SEVERE, message);
        // ////
        // fake event to avoid Failed Status!
        results.add("DONE");
        return results;
    }
    // if the directory is complete move it
    try {
		//	from: /emsa/out/nfs/ to: /emsa/tmp/
        outDir=new File(inDir.getParent()+"/../../tmp/"+inDir.getName());
        if (outDir.exists())
			FileUtils.deleteQuietly(outDir);
        FileUtils.copyDirectory(inDir,outDir.getCanonicalFile());
        FileUtils.deleteQuietly(inDir);
    } catch (IOException ioe) {
        String message="::EMSAService : problem moving dir " + inDir + " to out dir "+outDir;

        LOGGER.log(Level.SEVERE, message);
        Exception e=new Exception(message);
        listenerForwarder.failed(e);
        throw e;
    }

    // listing all the other files
    filter=FileFilterUtils.notFileFilter(FileFilterUtils.nameFileFilter(readyFileName));
    File[] list=outDir.listFiles((FileFilter)filter);
    for (file in list){
        String inputFileName = Extract.extract(file.getAbsolutePath());
//System.out.println("FILE:"+inputFileName);
    }
    
    // search for needed files
    Collector c=new Collector(
        FileFilterUtils.or(
                new WildcardFileFilter("*_PCK.xml",IOCase.INSENSITIVE),
                new WildcardFileFilter("*_PRO",IOCase.INSENSITIVE)));
    list=c.collect(outDir);
	
	EOPfile = null;
    for (file in list){
	    if (!file.getAbsolutePath().contains("_EOP")) {
			results.add(file.getAbsolutePath());
		} else {
			EOPfile = file;
		}
    }

	if (EOPfile != null) {
		results.add(0, EOPfile.getAbsolutePath());
	} else {
		String message="::EMSAService : do not contain the needed \"" + readyFileName 
							+ "\" file and the EOP package ... STOPPING!"

        LOGGER.log(Level.SEVERE, message);
        // ////
        // fake event to avoid Failed Status!
        results.add("DONE");
        return results;
    }

    // forwarding some logging information to Flow Logger Listener
    listenerForwarder.setTask("::EMSAService : Processing event " + eventFilePath)

    // defining the Input Data Dir:
    //  - here the input packages will be extracted to be further processed
    //  - please provide an absolute path
    //  - where to extract the packages for further processing
   File outDataDir = new File(emsaExchangePhysicalDir);
   if (!outDataDir.exists()){
       if (!outDataDir.mkdirs()) {
            String message="::EMSAService : Could not create EMSA input data dir:"+emsaExchangePhysicalDir;

            LOGGER.log(Level.SEVERE, message);
            Exception e=new Exception(message);
            listenerForwarder.failed(e);
            throw e;
       }
   }

//   System.out.println(" >>>>>> RESULTS >>>>>> " + results)
   
    // ////
    // forwarding event to the next action
    return results;
}

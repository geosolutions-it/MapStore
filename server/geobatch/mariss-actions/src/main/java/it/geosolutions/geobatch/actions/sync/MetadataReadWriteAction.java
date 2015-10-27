package it.geosolutions.geobatch.actions.sync;


import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.sync.model.FileMetadataWrapper;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.Queue;

import org.apache.commons.io.IOUtils;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.XStreamException;

/**
 * Action that dispatch to many flows the files to parse.
 * gets a <FileMetadataWrapper> object and a <FileSystemEvent> object with a directory as source
 * It has configured a filename, the <FileMetadataWriter> will be written into the directory
 * and writes a XStream 
 * Returns <FileSystemEvent> with the file created
 * 
 * @author Lorenzo Natali, GeoSolutions
 *
 */
@Action(configurationClass = MetadataReadWriteConfiguration.class)
public class MetadataReadWriteAction extends BaseAction<EventObject>{
	MetadataReadWriteConfiguration configuration;
	public MetadataReadWriteAction(MetadataReadWriteConfiguration actionConfiguration) {
		super(actionConfiguration);
		configuration = actionConfiguration;
	}

	@Override
	public Queue<EventObject> execute(Queue<EventObject> events)
			throws ActionException {
	    File directory = null;
	    File input = null;
	    FileMetadataWrapper object = null;
		while (events.size() > 0) {
		    EventObject event = events.remove();
		    if (LOGGER.isTraceEnabled()) {
                LOGGER.trace("Working on incoming event: "
                        + event.getSource());
            }
            if (event instanceof FileSystemEvent) {
                
                FileSystemEvent fileEvent = (FileSystemEvent) event;
                File source = fileEvent.getSource();
                if(source.exists() && source.isDirectory()){
                    directory = source;
                }else if (source.exists()){
                    input = source;
                }   
            }else if (event.getSource() instanceof FileMetadataWrapper){
                object = (FileMetadataWrapper) event.getSource();
            }
		}
		if(directory != null && object != null ){
		    File outputFile = null;
		    if(configuration.getfileName() != null){
		        outputFile = new File(directory,configuration.getfileName());
		    }
		    XStream xstream = new XStream();
		    FileWriter fw = null;
	        try {
	            
	            fw = new FileWriter(outputFile);
	            xstream.toXML(object, fw);
	            LinkedList<EventObject> outList = new LinkedList<EventObject>();
	            outList.add(new FileSystemEvent(outputFile,FileSystemEventType.FILE_ADDED));
	            return outList;
	        } catch (XStreamException e) {
	            if (LOGGER.isErrorEnabled())
	                LOGGER.error("The passed event object cannot be serialized to: "
	                                 + outputFile.getAbsolutePath(), e);
	            if (!configuration.isFailIgnored()) {
	                listenerForwarder.failed(e);
	                throw new ActionException(this, e.getLocalizedMessage());
	            }
	        } catch (Throwable e) {
	            // the object cannot be deserialized
	            if (LOGGER.isErrorEnabled())
	                LOGGER.error(e.getLocalizedMessage(), e);
	            if (!configuration.isFailIgnored()){
	                listenerForwarder.failed(e);
	                throw new ActionException(this, e.getLocalizedMessage());
	            }
	        } finally {
	            IOUtils.closeQuietly(fw);
	        }
		}else if(directory != null){
		    if(input ==null){
		        input = new File(directory,configuration.getfileName());
		    }
		    if(input.exists()){
		        object = readMetaDataWrapper(input);
		        events = new LinkedList<EventObject>(); 
		        events.add(new EventObject(object));
		    }
		}
		
		return events;
		
	}

	

	private FileMetadataWrapper readMetaDataWrapper(File input) throws ActionException {
	    FileInputStream inputStream = null;
        try {
            inputStream = new FileInputStream(input);
            XStream xstream = new XStream();
            return (FileMetadataWrapper) xstream.fromXML(inputStream);

        } catch (XStreamException e) {
            // the object cannot be deserialized
            if (LOGGER.isErrorEnabled())
                LOGGER.error("The passed FileSystemEvent reference to a not deserializable file: "
                             + input.getAbsolutePath(), e);
            if (!configuration.isFailIgnored()) {
                listenerForwarder.failed(e);
                throw new ActionException(this, e.getLocalizedMessage());
            }
        } catch (Throwable e) {
            // the object cannot be deserialized
            if (LOGGER.isErrorEnabled())
                LOGGER.error("XstreamAction.adapter(): " + e.getLocalizedMessage(), e);
            if (!configuration.isFailIgnored()) {
                listenerForwarder.failed(e);
                throw new ActionException(this, e.getLocalizedMessage());
            }
        } finally {
            IOUtils.closeQuietly(inputStream);
        }
        return null;
    }

    @Override
	public boolean checkConfiguration() {
		// TODO Auto-generated method stub
		return false;
	}
	
}

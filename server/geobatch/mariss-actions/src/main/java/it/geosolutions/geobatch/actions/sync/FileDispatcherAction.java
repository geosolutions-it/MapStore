package it.geosolutions.geobatch.actions.sync;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.sync.model.FileMetadataWrapper;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;

import java.io.File;
import java.util.ArrayList;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.Queue;

/**
 * Action that translate between file events and 
 * <FileMetadataWrapper> object to collect and send files to actions.
 * 
 * 
 * @author Lorenzo Natali, GeoSolutions
 *
 */
@Action(configurationClass = FileDispacherConfiguration.class)
public class FileDispatcherAction extends BaseAction<EventObject> {

	public FileDispatcherAction(FileDispacherConfiguration actionConfiguration) {
		super(actionConfiguration);
	}

	@Override
	public Queue<EventObject> execute(Queue<EventObject> events)
			throws ActionException {
		// the output
        final Queue<EventObject> ret = new LinkedList<EventObject>();
        listenerForwarder.started();
        FileMetadataWrapper wrapper = new FileMetadataWrapper();
        while (events.size() > 0) {
            final EventObject event = events.remove();
            if (event == null) {
                final String message = "The passed event object is null";
                if (LOGGER.isWarnEnabled())
                    LOGGER.warn(message);
                if (getConfiguration().isFailIgnored()) {
                    continue;
                } else {
                    final ActionException e = new ActionException(this, message);
                    listenerForwarder.failed(e);
                    throw e;
                }
            }
            //create the FileMetadataWrapper
            if (event instanceof FileSystemEvent) {
            	FileSystemEvent fsEvent = (FileSystemEvent) event;
            	
            	if(wrapper.getFiles()==null){
            		wrapper.setFiles(new ArrayList<String>());
            	}
            	
            	File f= fsEvent.getSource();
            	wrapper.getFiles().add(f.getAbsolutePath());
            	ret.add(new EventObject(wrapper));
    		//create Event Files
            } else {
            	Object obj = event.getSource();
            	if(obj instanceof FileMetadataWrapper){
            		wrapper = (FileMetadataWrapper) obj;
            		for(String file: wrapper.getFiles()){
            			File f = new File(file);
            			if(f.exists()){
            				ret.add(new FileSystemEvent(f,FileSystemEventType.FILE_ADDED));
            			}
            		}
            	}
            }
        }
        
		return ret;
	}

	@Override
	public boolean checkConfiguration() {
		// TODO Auto-generated method stub
		return true;
	}

	
}

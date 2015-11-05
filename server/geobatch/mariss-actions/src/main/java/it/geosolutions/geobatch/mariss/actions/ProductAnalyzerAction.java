package it.geosolutions.geobatch.mariss.actions;

import java.util.EventObject;
import java.util.LinkedList;
import java.util.Queue;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FilenameUtils;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.actions.sync.model.FileMetadataWrapper;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.flow.event.action.ActionException;

@Action(configurationClass = ProductAnalizerConfiguration.class)
public class ProductAnalyzerAction extends MarissBaseAction {

    public ProductAnalyzerAction(ProductAnalizerConfiguration actionConfiguration) {
        super(actionConfiguration);
        // TODO Auto-generated constructor stub
    }

    /**
     * Execute process
     */
    @Override
    public Queue<EventObject> execute(Queue<EventObject> events) throws ActionException {

        // return object
        final Queue<EventObject> ret = new LinkedList<EventObject>();
        FileMetadataWrapper eventWrapper = null;

        while (events.size() > 0) {
            final EventObject ev;

            if ((ev = events.remove()) != null) {
                if (LOGGER.isTraceEnabled()) {
                    LOGGER.trace("Working on incoming event: " + ev.getSource());
                }

                if (ev.getSource() instanceof FileMetadataWrapper) {
                    eventWrapper = (FileMetadataWrapper) ev.getSource();

                } else if (ev instanceof FileSystemEvent) {
                    ev.getSource(); // TODO manage
                    throw new ActionException(this, "input file system event not supported");
                }

            } else {
                if (LOGGER.isErrorEnabled()) {
                    LOGGER.error("Encountered a NULL event: SKIPPING...");
                }
                continue;
            }

        }
        if (eventWrapper != null) {
            processEventWrapper(eventWrapper);
        }
        ret.add(new EventObject(eventWrapper));
        return ret;
    }

    private void processEventWrapper(FileMetadataWrapper eventWrapper) {

        getTimeStart(eventWrapper);

    }

    private void getTimeStart(FileMetadataWrapper eventWrapper) {
        String filePath = (String) eventWrapper.getMetadata()
                .get(MarissConstants.ORIGINAL_FILE_PATH_KEY);
        String baseName = FilenameUtils.getBaseName(filePath);
        String patternList = configuration.getContainer().getPattern();
        for (String patternString : patternList.split(",")) {
            // Getting Time dimension if present
            Pattern pattern = Pattern.compile(patternString);
            Matcher m = pattern.matcher(baseName);
            if (m.matches()) {
                String timeStamp = m.group(1);
                java.util.Date d = guessTimeStamp(timeStamp);
                eventWrapper.getMetadata().put(MarissConstants.TIME_START, d);

            }
        }
    }

    @Override
    public boolean checkConfiguration() {
        // TODO Auto-generated method stub
        return true;
    }

}

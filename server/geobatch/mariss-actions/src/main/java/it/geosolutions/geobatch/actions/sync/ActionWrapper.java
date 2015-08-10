package it.geosolutions.geobatch.actions.sync;

import it.geosolutions.geobatch.actions.sync.model.ActionOption;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.annotations.GenericActionService;
import it.geosolutions.geobatch.catalog.Catalog;
import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;
import it.geosolutions.geobatch.configuration.event.listener.ProgressListenerConfiguration;
import it.geosolutions.geobatch.configuration.event.listener.ProgressListenerService;
import it.geosolutions.geobatch.flow.event.ProgressListener;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.global.CatalogHolder;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;

import org.apache.commons.lang.StringUtils;

/**
 * Wrapper to Execute Actions. Allows to forward output events to between sub-actions
 * @author Lorenzo Natali, GeoSolutions
 *
 */
@Action(configurationClass = ActionWrapperConfiguration.class)
public class ActionWrapper extends BaseAction<EventObject> {
	public ActionWrapper(ActionWrapperConfiguration actionConfiguration) throws IllegalArgumentException, InterruptedException, IOException {
		super(actionConfiguration);
		configuration = actionConfiguration;
		initialize();
	}



	protected ActionWrapperConfiguration configuration;
	
	List<BaseAction<EventObject>> actions;
	
	BaseAction<EventObject> currentAction;
	
	private void initialize() throws InterruptedException, IllegalArgumentException, IOException {

	      

	        // ////////////////////////////////////////////////////////////////////
	        // ACTIONS
	        // ////////////////////////////////////////////////////////////////////

	        final List<BaseAction<EventObject>> loadedActions = new ArrayList<BaseAction<EventObject>>();

	        final Catalog catalog = CatalogHolder.getCatalog();

	        for (ActionConfiguration actionConfig : configuration.getActions()) {
	            //final String actionServiceID = actionConfig.getServiceID();
	            // Geobatch 1.4.x way: service name convention:  actionServiceID is <configuration name> + "Service"
	        	final String actionServiceID = actionConfig.getServiceID();
	            if(LOGGER.isDebugEnabled())
	                LOGGER.debug("Loading actionService " + actionServiceID 
	                        + " from " + actionConfig.getClass().getSimpleName()
	                        + " " + actionConfig.getId()+":"+actionConfig.getName());
	            
	            final  GenericActionService service = catalog.getResource(actionServiceID, GenericActionService.class);
	            catalog.getResource(actionServiceID, GenericActionService.class);
	            if (service != null) {
	            	it.geosolutions.geobatch.flow.event.action.Action<? extends EventObject> action = null;
	                Class actionType = service.getType();

	                if (configuration.isIgnoreConfigurationFail() || service.checkConfiguration(actionConfig)) {
	                    action = service.createAction(actionType, actionConfig);
	                    if (action == null) { // TODO this control may be useless due to createAction never returns null...
	                        throw new IllegalArgumentException(
	                                "Action could not be instantiated for config " + actionConfig);
	                    }
	                } else {
	                    throw new IllegalArgumentException(
	                            "Cannot create the action using the service " + actionServiceID
	                                    + " check the configuration.");
	                }
	                // end of the patch
	                
	                // attach listeners to actions
	                if(actionConfig.getListenerConfigurations()!=null){
    	                for (ProgressListenerConfiguration plConfig : actionConfig
    	                        .getListenerConfigurations()) {
    	                    final String listenerServiceID = plConfig.getServiceID();
    	                    final ProgressListenerService progressListenerService = CatalogHolder
    	                            .getCatalog().getResource(listenerServiceID,
    	                                    ProgressListenerService.class);
    	                    if (progressListenerService != null) {
    	                        ProgressListener progressListener = progressListenerService
    	                                .createProgressListener(plConfig, action);
    	                        // @see {@link ProgressListenerConfiguration#appendToListenerForwarder}
    	                        if(Boolean.TRUE.equals(plConfig.getAppendToListenerForwarder())){
    	                            listenerForwarder.addListener(progressListener);
    	                        }
    	                        //action.addListener(progressListener);
    	                    } else {
    	                        throw new IllegalArgumentException("Could not find '" + listenerServiceID
    	                                + "' listener," + " declared in " + actionConfig.getId()
    	                                + " action configuration," + " in " + configuration.getId()
    	                                + " consumer");
    	                    }
    	                }
	                }

	                loadedActions.add((BaseAction<EventObject>) action);
	            } else {
	                throw new IllegalArgumentException("ActionService not found '" + actionServiceID
	                        + "' for ActionConfig '" + actionConfig.getName() + "'");
	            }
	        }
	        addActions(loadedActions);

	        if (loadedActions.isEmpty()) {
	            if (LOGGER.isWarnEnabled()) {
	                LOGGER.warn(getClass().getSimpleName() + " initialized with " + loadedActions.size()
	                            + " actions");
	            }
	        }
	    }

	private void addActions(List<BaseAction<EventObject>> loadedActions) {
		actions = loadedActions;
		
	}
	
	@Override
	public Queue<EventObject> execute(Queue<EventObject> events) throws ActionException {
			Queue<EventObject> originalEvents = new LinkedList<EventObject>();
			Queue<EventObject> preprocessedEvents = new LinkedList<EventObject>();
			originalEvents.addAll(events);
			preprocessedEvents.addAll(generateInputs(events));
			events = preprocessedEvents;
	        if (LOGGER.isTraceEnabled()) {
	            LOGGER.trace("Applying " + actions.size() + " actions on " + events.size() + " events.");
	        }

	        // apply all the actions
	        int step = 0;
	        BaseAction<EventObject> currentAction = null;
	        Map<String,Queue<EventObject>> outputs = new HashMap<String,Queue<EventObject>>();
			try {
	            for (BaseAction<EventObject> action : this.actions) {
	                try {
	                    float progress = 100f * (float)step / this.actions.size();
	                    listenerForwarder.setProgress(progress);//TODO progress is global
	                    listenerForwarder.setTask("Running " + action.getName() + "("
	                                              + (step + 1) + "/" + this.actions.size() + ")");
	                    // notify there has been some progressing
	                    listenerForwarder.progressing();

	                    // setting the action context same as the event consumer
	                    action.setRunningContext(getRunningContext());

	                    // setting current action
	                    currentAction = action;

	                    // // let child classes perform their init
	                    setupAction(action, step);

	                    // execute the action
	                    Queue<EventObject> inputEvents = getInputEvents(action,events,outputs,originalEvents,preprocessedEvents);
	                    events = action.execute(inputEvents);
	                    
	                    //save the outputs
	                    LinkedList<EventObject> eventCopy = new LinkedList<EventObject> ();
	                    eventCopy.addAll(events);
	                    outputs.put(action.getConfiguration().getId(), eventCopy);
	                    if (events == null) {
	                        throw new IllegalArgumentException("Action " + action.getName()
	                                                           + " returns a null queue.");
	                    }
	                    if (events.isEmpty()) {
	                        if (LOGGER.isWarnEnabled()) {
	                            LOGGER.warn("Action " + action.getName()
	                                        + " left no event in queue.");
	                        }
	                    }
	                    step++;

	                } catch (ActionException e) {
	                    if (LOGGER.isDebugEnabled()) {
	                        LOGGER.error(e.getLocalizedMessage(), e);
	                    } else {
	                        LOGGER.error(e.getLocalizedMessage());
	                    }

	                    listenerForwarder.setTask("Action " + action.getName() + " failed (" + e
	                                              + ")");
	                    listenerForwarder.progressing();

	                    if (!currentAction.isFailIgnored()) {
	                        events.clear();
	                        throw e;
	                    } else {
	                        // CHECKME: eventlist is not modified in this case. will
	                        // it
	                        // work?
	                    }

	                } catch (Exception e) { // exception not handled by the Action
	                    if (LOGGER.isErrorEnabled()) {
	                        LOGGER.error("Action threw an unhandled exception: " + e.getLocalizedMessage(), e);
	                    }

	                    listenerForwarder.setTask("Action " + action.getName() 
	                                            + " failed (" + e + ")");
	                    listenerForwarder.progressing();

	                    if (!currentAction.isFailIgnored()) {
	                        if (events == null) {
	                            throw new IllegalArgumentException("Action " + action.getName()
	                                                               + " left no event in queue.");
	                        } else {
	                            events.clear();
	                        }
	                        // wrap the unhandled exception
	                        throw new ActionException(currentAction, e.getMessage(), e);
	                    } else {
	                        // CHECKME: eventlist is not modified in this case. will it work?
	                    }
	                } finally {
	                    // currentAction = null; // don't null the action: we'd like to read which was the last action run
	                }
	            }
	        } catch (Error ex) { // this catch in not in the loop: it will catch Errors, which cant usually be recovered
	            LOGGER.error("Error in Action", ex);
	            throw ex;
	        } 

	        // end of loop: all actions have been executed
	        // checkme: what shall we do with the events left in the queue?
	        if (events != null && !events.isEmpty()) {
	            LOGGER.info("There are " + events.size() + " events left in the queue after last action ("
	                        + currentAction.getName() + ")");
	        }
	        listenerForwarder.completed();
	        return generateOutput(originalEvents,outputs);
	    }

	/**
	 * Overridable method to pre-process input events for sub-actions
	 * @param events
	 * @return
	 */
	protected Queue<EventObject> generateInputs(Queue<EventObject> events) {
		return events;
	}

	/**
	 * Overridable method to generate output.
	 * 
	 * @param originalEvents
	 * @param outputs
	 * @return
	 */
	protected Queue<EventObject> generateOutput(
			Queue<EventObject> originalEvents,
			Map<String, Queue<EventObject>> outputs) {
	    if(configuration.getOutputId() != null && outputs.containsKey(configuration.getOutputId())){
	        return outputs.get(configuration.getOutputId());
	    }
		return originalEvents;
		
	}

	/**
	 * Find input source and dispatch to the action execution.
	 * Allows to get ORIGINAL_EVENTS, PREPROCESSED_EVENTS to get input events at all
	 * You can dispatch also multiple inputs/outputs separating action ids with a ","
	 * 
	 * E.g. ORIGINAL_EVENTS,csv will get the original events (of the wrapper) and the output of the action named csv as input
	 * of the action. 
	 * @param action current action
	 * @param events last events produced
	 * @param outputs outputs produced
	 * @param originalEvents original events
	 * @param preprocessedEvents events generated by generateInput method
	 * @return
	 */
	private Queue<EventObject> getInputEvents(BaseAction<EventObject> action, Queue<EventObject> events, Map<String, Queue<EventObject>> outputs, Queue<EventObject> originalEvents, Queue<EventObject>  preprocessedEvents) {
		String inIds = configuration.getInputSource(action.getConfiguration().getId());
		ActionOption opt = null;
		if(configuration.getActionOptions()!=null){
			 opt = configuration.getActionOptions().get(action.getConfiguration().getId());
			
		}

		
		if(inIds != null){
			return collectEvents(outputs, originalEvents, preprocessedEvents,inIds, opt);
		}
		
		return events;
	}

	
	/**
	 * Returns the Events collected using the String idIds
	 * @param outputs a map of Queues to use by key
	 * @param originalEvents a particular event collection of original event for the wrapper
	 * @param preprocessedEvents a particular event collection for preprocessed events 
	 * @param inIds a comma separated list of id to use to get the proper events to collect
	 * @param opt 
	 * @return a <Queue> of <EventObject> collected from the outputs, originalEvents and preprocessed Events retrieved using the ids string
	 */
	private Queue<EventObject> collectEvents(
			Map<String, Queue<EventObject>> outputs,
			Queue<EventObject> originalEvents,
			Queue<EventObject> preprocessedEvents, String inIds, ActionOption opt) {
	    inIds = StringUtils.trim(inIds);
		String[] ids = inIds.split(",");
		Queue<EventObject> returnEvent = new LinkedList<EventObject>();
		for(int i = 0; i < ids.length;i++){
			String inId = ids[i];
			Queue<EventObject> current = null;
			if(outputs.containsKey(inId)){
				current = outputs.get(inId);
			}
			if("ORIGINAL_EVENTS".equals(inId)){
				current = originalEvents;
			}
			if("PREPROCESSED_EVENTS".equals(inId)){
				current = preprocessedEvents;
			}
			if(outputs.containsKey(inId)){
				ActionOption.Mode m = ActionOption.Mode.CLONE;
				if(opt!=null){
					 m = opt.getMode();
					 if(m == null){
					      returnEvent.addAll(new LinkedList(current));
					 }else{
					     switch (m) {
		                    case CLONE:
		                        returnEvent.addAll(new LinkedList(current));
		                        break;

		                    default:
		                        returnEvent.addAll(current);
		                        break;
		                }
					 }
				}
				
			}
		}
		return returnEvent;
	}

	@Override
	public boolean checkConfiguration() {
		// TODO Auto-generated method stub
		return false;
	}
	
	protected void setupAction(BaseAction action, int step) throws IllegalStateException {
        // random id
        //
        action.setId(UUID.randomUUID().toString());
        
        // tempDir
        String actionTempDirName = step + "_" + action.getConfiguration().getId();
        File actionTempDir = new File(getTempDir(), actionTempDirName);
        if (!actionTempDir.mkdirs()) {
            throw new IllegalStateException("Unable to create the action temporary dir: " + actionTempDir);
        }
        action.setTempDir(actionTempDir);
        
        File actionConfigDir = initConfigDir(action.getConfiguration(), getConfigDir());
        action.setConfigDir(actionConfigDir);
    }
	
	private File initConfigDir(ActionConfiguration actionCfg, File flowConfigDir) {
        File ret = null;
        File ovr = actionCfg.getOverrideConfigDir(); 
        if( ovr != null) {
            if( ! ovr.isAbsolute())
                ret = new File(flowConfigDir, ovr.getPath());
            else 
                ret = ovr;
        } else
            ret = new File(flowConfigDir, actionCfg.getId());
        
        if(LOGGER.isDebugEnabled())
            LOGGER.debug("Action config dir set to " + ret);
        return ret;
    }

}

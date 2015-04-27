package it.geosolutions.npa.rest.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Generic wrapper for a REST service response holding a list of objects.
 *  
 * @author Lorenzo Natali, GeoSolutions
 *
 * @param <CLASS> the type of the returned objects
 */
public class RestResultWrapper<CLASS> {
    
    private List<CLASS> list = new ArrayList<CLASS>();
    private boolean success;
    private int totalCount;

    /**
     * @return true if the request was successfully processed, false otherwise
     */
    public boolean isSuccess() {
        return success;
    }
    
    /**
     * 
     * @param success the success to set
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    /**
     * 
     * @return the number of records that would be listed in the result, 
     *          if pagination was disabled 
     */
    public int getTotalCount() {
        return totalCount;
    }
    
    /**
     * 
     * @param totalCount the totalCount to set
     */
    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
    
    /**
     * 
     * @return the list of records
     */
    public List<CLASS> getList() {
        return list;
    }
    
    /**
     * 
     * @param records the list of records to set
     */
    public void setList(List<CLASS> records) {
        this.list = records;
    }

    /**
     * 
     * @return the actual number of records in the result
     */
    int getCount() {
        return this.list != null ? this.list.size() : 0;
    }
}

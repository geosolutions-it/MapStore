package it.geosolutions.geobatch.metocs.base;

import java.util.EventObject;

import ucar.nc2.dataset.NetcdfDataset;

/**
 * TODO this class should be moved to a more general package
 * @author carlo cancellieri - carlo.cancellieri@geo-solutions.it
 *
 */
public class NetcdfEvent extends EventObject{
     
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    // remove source files
    private boolean performBackup=false;
    
    public NetcdfEvent(NetcdfDataset d, boolean backup) {
        super(d);
        performBackup=backup;
    }
    
    public NetcdfEvent(NetcdfDataset d) {
        super(d);
        performBackup=false;
    }
    
    public boolean getPerformBackup(){
        return performBackup;
    }
    
    public String getPath(){
        return getSource().getReferencedFile().getLocation();
    }
    
    @Override
    public NetcdfDataset getSource() {
        return (NetcdfDataset) super.getSource();
    }

}

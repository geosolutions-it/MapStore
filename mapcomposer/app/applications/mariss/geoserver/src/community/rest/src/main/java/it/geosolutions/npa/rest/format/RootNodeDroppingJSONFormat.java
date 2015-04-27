package it.geosolutions.npa.rest.format;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import org.geoserver.rest.format.ReflectiveJSONFormat;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.StreamException;
import com.thoughtworks.xstream.io.json.JettisonMappedXmlDriver;
import com.thoughtworks.xstream.io.json.JsonWriter;

/**
 * Customized {@link ReflectiveJSONFormat} that automatically drops the root
 * node when serializing JSON.
 * 
 * @author Stefano Costa
 */
public class RootNodeDroppingJSONFormat extends ReflectiveJSONFormat {

    private XStream xstream;
    
    public RootNodeDroppingJSONFormat() {
        super();
        this.xstream = new XStream(new JettisonMappedXmlDriver() {
            public HierarchicalStreamWriter createWriter(Writer writer) {
                return new JsonWriter(writer, JsonWriter.DROP_ROOT_MODE);
            }
    
            public HierarchicalStreamWriter createWriter(OutputStream output) {
                try {
                    return new JsonWriter(new OutputStreamWriter(output, "UTF-8"),
                            JsonWriter.DROP_ROOT_MODE);
                } catch (UnsupportedEncodingException e) {
                    throw new StreamException(e);
                }
            }
        });
    }
    
    @Override
    public XStream getXStream() {
        return xstream;
    }
    
    @Override
    protected Object read(InputStream input) throws IOException {
        return xstream.fromXML(input);
    }
    
    @Override
    protected void write(Object data, OutputStream output) throws IOException {
        xstream.toXML(data, output);
    }

}

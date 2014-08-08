package it.geosolutions.geobatch.action.egeos.emsa.features;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.namespace.NamespaceContext;

/**
 * The simplest possible implementation of a namespace context
 */
public class SimpleNamespaceContext implements NamespaceContext {
    private Map<String, String> context;

    public SimpleNamespaceContext() {
        context = new HashMap<String, String>();
    }

    public void setNamespace(String prefix, String namespaceURI) {
        context.put(prefix, namespaceURI);
    }

    public String getNamespaceURI(String prefix) {
        return (String) context.get(prefix);
    }

    @SuppressWarnings("unchecked")
    public String getPrefix(String namespaceURI) {
        Set keys = context.keySet();
        for (Iterator iterator = keys.iterator(); iterator.hasNext();) {
            String prefix = (String) iterator.next();
            String uri = (String) context.get(prefix);
            if (uri.equals(namespaceURI))
                return prefix;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public Iterator getPrefixes(String namespaceURI) {
        List prefixes = new ArrayList();
        Set keys = context.keySet();
        for (Iterator iterator = keys.iterator(); iterator.hasNext();) {
            String prefix = (String) iterator.next();
            String uri = (String) context.get(prefix);
            if (uri.equals(namespaceURI))
                prefixes.add(prefix);
        }
        return prefixes.iterator();
    }
}
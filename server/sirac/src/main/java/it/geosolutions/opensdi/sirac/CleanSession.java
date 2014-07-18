/*
 *  OpenSDI Manager
 *  Copyright (C) 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package it.geosolutions.opensdi.sirac;

import it.geosolutions.opensdi2.session.UserSessionService;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * HttpSessionAttributeListener, used to synchronize
 * SiRAC session cleaning with MapStore one.
 * 
 * @author Mauro Bartolomeoli
 *
 */
public class CleanSession implements HttpSessionAttributeListener {

    UserSessionService sessionService;
    
    @Override
    public void attributeAdded(HttpSessionBindingEvent se) {
        
    }

    @Override
    public void attributeRemoved(HttpSessionBindingEvent se) {
        initSessionService(se);
        if(sessionService != null && se.getName().equals("mapstore_session_id")) {
            String sessionId = (String)se.getValue();
            // unregister the current MapStore session from the UserSessionService
            if(sessionId != null) {
                sessionService.removeSession(sessionId);
            }
        }
    }

    private void initSessionService(HttpSessionBindingEvent se) {
        if(sessionService == null) {
            ServletContext context = se.getSession().getServletContext();
            WebApplicationContext wac = WebApplicationContextUtils.
                            getRequiredWebApplicationContext(context);
            sessionService = (UserSessionService)wac.getBean("userSessionService");
        }
    }

    @Override
    public void attributeReplaced(HttpSessionBindingEvent se) {
        
    }

}

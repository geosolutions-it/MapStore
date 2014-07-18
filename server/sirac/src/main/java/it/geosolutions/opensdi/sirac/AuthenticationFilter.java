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
import it.geosolutions.opensdi2.session.impl.UserSessionImpl;
import it.people.sirac.authentication.beans.PplUserDataExtended;
import it.people.sirac.filters.SiracSSOAuthenticationFilter;

import java.io.IOException;
import java.util.Calendar;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Sira AuthenticationFilter extended.
 * Allows to handle the MapStore session using a UserSessionService.
 * 
 * The filter checks for Sirac session attributes and synchronizes the MapStore
 * session as needed.
 * 
 * @author Geo
 *
 */
public class AuthenticationFilter extends SiracSSOAuthenticationFilter {
    
    private static final Logger LOGGER = Logger
            .getLogger(AuthenticationFilter.class);

    private static final String MAPSTORE_SESSION_ID_KEY = "mapstore_session_id";
    private static final String SIRAC_AUTHENTICATED_USER_DATA_KEY = "it.people.sirac.authenticated_user_data";
    private static final String SIRAC_AUTHENTICATED_USER_KEY = "it.people.sirac.authenticated_user";
    
    UserSessionService sessionService;
    
    // default MapStore session expire time in minutes
    private int expireMinutes = 10;
    
    @Override
    public void destroy() {
        super.destroy();
    }

    @Override
    public void doFilter(ServletRequest _request, ServletResponse _response,
            FilterChain _chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) _request;
        HttpSession session = request.getSession();
        String userName = (String) session
                .getAttribute(SIRAC_AUTHENTICATED_USER_KEY);
        PplUserDataExtended userData = (PplUserDataExtended) session
                .getAttribute(SIRAC_AUTHENTICATED_USER_DATA_KEY);
    
        String sessionId = (String) session.getAttribute(MAPSTORE_SESSION_ID_KEY);
        if (sessionId != null) {
            if (userName != null && userData != null) {
                // if the mapstore session has expired, but the SiRAC one is not,
                // create a new mapstore session
                if (sessionService.getUserData(sessionId) == null) {
                    createMapStoreSession(session, userName, userData);
                }
            } else {
                // SiRAC session expired, remove MapStore one
                sessionService.removeSession(sessionId);
                session.removeAttribute(MAPSTORE_SESSION_ID_KEY);
            }
    
        } else if (userName != null && userData != null) {
            // SiRAC session defined, but MapStore session is not
            // let's create it
            createMapStoreSession(session, userName, userData);
        }
        super.doFilter(_request, _response, _chain);
    }

    /**
     * Creates and registers a new MapStore session.
     * 
     * @param session request session
     * @param userName userName for the session
     * @param userData complete userData from SiRAC
     */
    private void createMapStoreSession(HttpSession session, String userName,
            PplUserDataExtended userData) {
        // wrap userdata into a Spring UserDetail object
        MapStoreUserData mapStoreUserData = new MapStoreUserData(userName, userData);
        // internal expiration (synchronization with SiRAC is handled by the filter, if expire
        // times are not coincident)
        Calendar expire = Calendar.getInstance();
        expire.add(Calendar.MINUTE, expireMinutes);
        // register the session with the service and store the related id in request session
        String sessionId = sessionService.registerNewSession(new UserSessionImpl(mapStoreUserData, expire));
        session.setAttribute(MAPSTORE_SESSION_ID_KEY, sessionId);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        super.init(filterConfig);
        String expire = filterConfig.getInitParameter("expire");
        if(expire != null) {
            try {
                expireMinutes = Integer.parseInt(expire);
            } catch(NumberFormatException e) {
                LOGGER.error("The expire init-param is wrong: " + expire, e);
            }
        }
        // Initializes UserSessionService from Spring context
        if(this.sessionService == null) {
            ServletContext context = filterConfig.getServletContext();
            WebApplicationContext wac = WebApplicationContextUtils.
                            getRequiredWebApplicationContext(context);
            sessionService = (UserSessionService)wac.getBean("userSessionService");
        }
    }
    
}

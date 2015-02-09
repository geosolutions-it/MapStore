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

import it.geosolutions.geostore.core.model.User;
import it.geosolutions.geostore.core.model.UserAttribute;
import it.geosolutions.geostore.core.model.enums.Role;
import it.geosolutions.geostore.services.rest.AdministratorGeoStoreClient;
import it.geosolutions.geostore.services.rest.GeoStoreClient;
import it.geosolutions.opensdi2.session.UserSessionService;
import it.geosolutions.opensdi2.session.impl.UserSessionImpl;
import it.people.sirac.authentication.beans.PplUserDataExtended;
import it.people.sirac.filters.SiracSSOAuthenticationFilter;

import java.io.IOException;
import java.util.Calendar;
import java.util.Collections;

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

import com.sun.jersey.api.client.UniformInterfaceException;

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
    
    private AdministratorGeoStoreClient geostoreClient = null;
    
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
        
        try {
            synchronizeUser(userName, userData);
        } catch (IOException e) {
            LOGGER.error("Cannot synchronize user with GeoStore", e);
        }
    }

    private void synchronizeUser(String userName, PplUserDataExtended userData) throws IOException {
        if (geostoreClient != null) {
            User user = null;
            try {
                user = geostoreClient.getUser(userName);
            } catch(UniformInterfaceException e) {
                // we intercept 404 errors (user not found): this means we should create a new one
                if(!e.getMessage().contains("404")) {
                    throw new IOException("Cannot connect to GeoStore to get user existance");
                }
            }
            if (user == null) {
                User geostoreUser = new User();
                geostoreUser.setName(userName);
                geostoreUser.setRole(Role.USER);
                UserAttribute attribute = new UserAttribute();
                attribute.setName("provider");
                attribute.setValue("sirac");
                geostoreUser.setAttribute(Collections.singletonList(attribute));
                geostoreClient.insert(geostoreUser);
            }
        }
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
        
        ServletContext context = filterConfig.getServletContext();
        WebApplicationContext wac = WebApplicationContextUtils.
                        getRequiredWebApplicationContext(context);
        
        String geostoreBaseUrl = filterConfig.getInitParameter("geostoreBaseUrl");
        String geostoreUsername = filterConfig.getInitParameter("geostoreUsername");
        String geostorePassword = filterConfig.getInitParameter("geostorePassword");

        if (geostoreBaseUrl == null || geostoreUsername == null || geostorePassword == null) {
            geostoreClient = (AdministratorGeoStoreClient)wac.getBean("administratorGeoStoreClient");
            if(geostoreClient == null) {
                LOGGER.warn("GeoStore connection is invalid: users won't be synchronized. Please specify geostoreBaseUrl, geostoreUsername and geostorePassword init parameters");
            }
        } else {
            geostoreClient = new AdministratorGeoStoreClient();
            geostoreClient.setGeostoreRestUrl(geostoreBaseUrl);
            geostoreClient.setUsername(geostoreUsername);
            geostoreClient.setPassword(geostorePassword);
        }
        // Initializes UserSessionService from Spring context
        if(this.sessionService == null) {
            sessionService = (UserSessionService)wac.getBean("userSessionService");
        }
    }
    
}

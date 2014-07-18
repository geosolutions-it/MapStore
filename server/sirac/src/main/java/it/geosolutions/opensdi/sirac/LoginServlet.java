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

import it.people.sirac.authentication.beans.AuthenticationRequestBean;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet to implement redirection to SSO portal for not authenticated users.
 * It implements a "self submitting" form with authentication data to the configured SSO URL.
 *  
 * @author Mauro Bartolomeoli
 *
 */
public class LoginServlet extends HttpServlet {
    
    private static final long serialVersionUID = 1L;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, java.io.IOException {
    
        // SiRAC authentication request object
        AuthenticationRequestBean authRequest = (AuthenticationRequestBean) request
                .getAttribute("authRequest");
    
        response.setContentType("text/html");
    
        java.io.PrintWriter out = response.getWriter();
    
        String path = request.getContextPath();
        String basePath = request.getScheme() + "://" + request.getServerName()
                + ":" + request.getServerPort() + path + "/";
    
        out.println("<html><head>");
        out.println("<base href=\"" + basePath + "\">");
        out.println("<title>Authentication Redirect</title>");
        out.println("<meta http-equiv=\"pragma\" content=\"no-cache\">");
        out.println("<meta http-equiv=\"cache-control\" content=\"no-cache\">");
        out.println("<meta http-equiv=\"expires\" content=\"0\">");
        out.println("</head><body onload=\"javascript:document.forms[0].submit()\">");
        out.println("<body >");
        out.println("    <form method=\"post\" action=\""
                + authRequest.getFormAction() + "\" />");
        out.println("        <input type=\"hidden\" name=\"TARGET\" value=\""
                + authRequest.getTarget() + "\" />");
        out.println("        <input type=\"hidden\" name=\"AuthRequest\" value=\""
                + authRequest.getRequest() + "\" />");
        out.println("        <input type=\"submit\" value=\"Click here if you are not automatically redirected in 10 seconds\"/>");
        out.println("    </form>");
        out.println("</body>");
        out.println("</html>");
    
    }
}

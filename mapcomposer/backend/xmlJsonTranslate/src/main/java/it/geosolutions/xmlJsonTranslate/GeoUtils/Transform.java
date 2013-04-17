
package it.geosolutions.xmlJsonTranslate.GeoUtils;

import com.vividsolutions.jts.geom.Geometry;
import it.geosolutions.xmlJsonTranslate.utils.GeoUtil;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import org.apache.commons.io.IOUtils;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.opengis.referencing.crs.CRSAuthorityFactory;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;


public class Transform extends HttpServlet {

    private final static Logger LOGGER = Logger.getLogger(Transform.class.getSimpleName());
    /**
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {

            JSONObject jsonRequest = (JSONObject) JSONSerializer.toJSON(IOUtils.toString(
                    request.getInputStream()));

            CRSAuthorityFactory   factory = CRS.getAuthorityFactory(true);
            
            CoordinateReferenceSystem sourceCRS = 
                    factory.createCoordinateReferenceSystem(
                    jsonRequest.getString("sourceCRS"));
            
            CoordinateReferenceSystem targetCRS = 
                    factory.createCoordinateReferenceSystem(
                    jsonRequest.getString("targetCRS"));
            
            boolean lenient = true; // allow for some error due to different datums
            MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, lenient);
            
            Geometry sourceGeometry= GeoUtil.geoDataParse(
                    jsonRequest.getString("sourceType"),
                    jsonRequest.getString("data"));
            
            Geometry targetGeometry = JTS.transform(sourceGeometry, transform);

            out.println(GeoUtil.geometryWrite(jsonRequest.getString("targetType"), 
                    targetGeometry));
           
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, ex.getLocalizedMessage(),ex.fillInStackTrace());
            out.println(ex.fillInStackTrace());
        } finally {            
            out.close();
        }
    }


    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (Exception ex) {
            
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}

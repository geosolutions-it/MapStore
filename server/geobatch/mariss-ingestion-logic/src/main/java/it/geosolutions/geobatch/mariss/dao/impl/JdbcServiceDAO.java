/*
 *    GeoTools - The Open Source Java GIS Toolkit
 *    http://geotools.org
 *
 *    (C) 2014, Open Source Geospatial Foundation (OSGeo)
 *
 *    This library is free software; you can redistribute it and/or
 *    modify it under the terms of the GNU Lesser General Public
 *    License as published by the Free Software Foundation;
 *    version 2.1 of the License.
 *
 *    This library is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *    Lesser General Public License for more details.
 */
package it.geosolutions.geobatch.mariss.dao.impl;

import it.geosolutions.geobatch.mariss.dao.ServiceDAO;
import it.geosolutions.geobatch.mariss.model.AreaOfInterest;
import it.geosolutions.geobatch.mariss.model.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

/**
 * <pre>
 * {@code
 *  CREATE TYPE service_status AS ENUM ('NEW', 'AOI', 'ACQUISITIONLIST', 'ACQUISITIONPLAN', 'PRODUCTS', 'INGESTED');
 *  CREATE TABLE service
 *    (
 *      "ID" serial NOT NULL,
 *      "SERVICE_ID" text NOT NULL,
 *      "PARENT" text NOT NULL,
 *      "USER" varchar(80) NOT NULL,
 *      "STATUS" character varying(80) NOT NULL DEFAULT 'NEW',
 *      CONSTRAINT service_pkey PRIMARY KEY ("ID")
 *    )
 *    WITH (
 *      OIDS=FALSE
 *    );
 *    ALTER TABLE service
 *      OWNER TO mariss;
 * </pre>
 * 
 * @author Alessio
 * 
 */
public class JdbcServiceDAO implements ServiceDAO {

    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void insert(Service service) {

        String sql = "INSERT INTO SERVICE (\"SERVICE_ID\", \"PARENT\", \"USER\", \"STATUS\") VALUES (?, ?, ?, ?)";
        Connection conn = null;

        try {
            conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, service.getServiceId());
            ps.setString(2, service.getParent());
            ps.setString(3, service.getUser());
            ps.setString(4, service.getStatus());
            ps.executeUpdate();
            ps.close();

        } catch (SQLException e) {
            throw new RuntimeException(e);

        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                }
            }
        }

    }

    @Override
    public void insertOrUpdate(AreaOfInterest aoi) {

        boolean result = false;
        
        String sql = "SELECT * FROM AOIS WHERE service_name = ?";
        Connection conn = null;

        try {
            conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, aoi.getServiceId());
            ResultSet rs = ps.executeQuery();
            boolean performUpdate = rs.next();
            rs.close();

            if (performUpdate) 
            {
                // perform update
                sql = "UPDATE aois SET the_geom=?, start=?, \"end\"=?, status=?, \"desc\"=? WHERE service_name = ?";
                if (!ps.isClosed()) ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, aoi.getTheGeom());
                ps.setDate(2, aoi.getStartTime());
                ps.setDate(3, aoi.getEndTime());
                ps.setString(4, aoi.getStatus());
                ps.setString(5, aoi.getDescription());
                ps.setString(6, aoi.getServiceId());
                result = ps.execute() && ps.getUpdateCount() > 0;
            }
            else
            {
                // perform insert
                sql = "INSERT INTO aois(service_name, the_geom, start, \"end\", status, \"desc\") VALUES (?, ?, ?, ?, ?, ?)";
                if (!ps.isClosed()) ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, aoi.getServiceId());
                ps.setString(2, aoi.getTheGeom());
                ps.setDate(3, aoi.getStartTime());
                ps.setDate(4, aoi.getEndTime());
                ps.setString(5, aoi.getStatus());
                ps.setString(6, aoi.getDescription());
                result = ps.executeUpdate() > 0;
            }
            ps.close();
                        
        } catch (SQLException e) {
            throw new RuntimeException(e);

        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                }
            }
        }
        
    }

    @Override
    public Service findByServiceId(String serviceId) {

        String sql = "SELECT * FROM SERVICE WHERE \"SERVICE_ID\" = ?";

        Connection conn = null;

        try {
            conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, serviceId);
            Service service = null;
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                service = new Service(rs.getString("SERVICE_ID"), rs.getString("PARENT"),
                                      rs.getString("USER"), rs.getString("STATUS"));
                service.setId(rs.getInt("ID"));
            }
            rs.close();
            ps.close();
            
            // Retrieve the AOI
            sql = "SELECT fid, \"desc\", service_name, asewkt(the_geom) as thegeom, start, \"end\", status FROM AOIS WHERE service_name = ?";
            
            ps = conn.prepareStatement(sql);
            String userId = service.getUser();
            ps.setString(1, userId+"@"+serviceId);
            AreaOfInterest aoi = null;
            rs = ps.executeQuery();
            if (rs.next()) {
                aoi = new AreaOfInterest(serviceId,
                                         rs.getString("desc"),
                                         rs.getString("thegeom"), 
                                         rs.getDate("start"), 
                                         rs.getDate("end"), 
                                         rs.getString("status"));
                aoi.setId(rs.getInt("fid"));
                service.setAoi(aoi);
            }
            rs.close();
            ps.close();
            
            return service;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                }
            }
        }

    }

    @Override
    public List<Service> findByUser(String userId) {
    
        String sql = "SELECT * FROM SERVICE WHERE \"USER\" = ?";

        Connection conn = null;

        try {
            conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, userId);
            List<Service> services = new ArrayList<Service>();
            ResultSet rs = ps.executeQuery();
            Service service;
            while (rs.next()) {
                service = new Service(rs.getString("SERVICE_ID"), rs.getString("PARENT"),
                                      rs.getString("USER"), rs.getString("STATUS"));
                service.setId(rs.getInt("ID"));
                
                services.add(service);
            }
            rs.close();
            ps.close();
            
            for (Service ss : services) 
            {
                String serviceId = userId+"@"+ss.getServiceId();
                
                // Retrieve the AOI
                sql = "SELECT fid, \"desc\", service_name, asewkt(the_geom) as thegeom, start, \"end\", status FROM AOIS WHERE service_name = ?";
                
                ps = conn.prepareStatement(sql);
                ps.setString(1, serviceId);
                AreaOfInterest aoi = null;
                rs = ps.executeQuery();
                if (rs.next()) {
                    aoi = new AreaOfInterest(serviceId,
                                            rs.getString("desc"),
                                            rs.getString("thegeom"), 
                                            rs.getDate("start"), 
                                            rs.getDate("end"), 
                                            rs.getString("status"));
                    aoi.setId(rs.getInt("fid"));
                    ss.setAoi(aoi);
                }
                rs.close();
                ps.close();                
            }
            
            return services;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                }
            }
        }

    }

    @Override
    public boolean updateServiceStatus(Service service, String status) {
        boolean result = false;
        
        String sql = "UPDATE SERVICE SET \"STATUS\" = ? WHERE \"USER\" = ? AND \"SERVICE_ID\" = ?";

        Connection conn = null;

        try {
            conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, status);
            ps.setString(2, service.getUser());
            ps.setString(3, service.getServiceId());
            result = ps.execute() && ps.getUpdateCount() > 0;
            ps.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                }
            }
        }

        return result;
    }

}

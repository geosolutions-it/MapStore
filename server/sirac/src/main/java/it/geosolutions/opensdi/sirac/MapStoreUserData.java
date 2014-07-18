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

import it.people.sirac.authentication.beans.PplUserDataExtended;

import java.util.ArrayList;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

/**
 * Wrapper of People UserData implementing Spring UserDetails.
 * 
 * @author Mauro Bartolomeoli
 */
public class MapStoreUserData extends User {
    private PplUserDataExtended userData;
        
    public MapStoreUserData(String userId, PplUserDataExtended userData) {
        super(userId, "", true, true, true, true, new ArrayList<GrantedAuthority>());
        this.userData = userData;
    }
    
    public PplUserDataExtended getUserData() {
        return this.userData;
    }
}

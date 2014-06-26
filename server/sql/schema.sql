DROP VIEW aoi;
DROP AGGREGATE z_cat(anyelement);
DROP TABLE acquisitions;
DROP TABLE service_products;
DROP TABLE service_sensors;
DROP TABLE services;
DROP TABLE service_status;
DROP TABLE sensors_modes;
DROP TABLE sensors;

DROP TABLE products;

CREATE TABLE service_status ( 
        id integer NOT NULL, 
        status varchar(50) NOT NULL,
        PRIMARY KEY (id) 
);

insert into service_status (id, status) values (1, 'NEW');
insert into service_status (id, status) values (2, 'AOI');
insert into service_status (id, status) values (3, 'ACQUISITIONLIST');
insert into service_status (id, status) values (4, 'ACQUISITIONPLAN');
insert into service_status (id, status) values (5, 'INGESTED');

CREATE TABLE sensors ( 
        id serial NOT NULL, 
        name varchar(500) NOT NULL,
        PRIMARY KEY (id) 
);

CREATE TABLE sensors_modes ( 
        id serial NOT NULL, 
        fk_sensor integer NOT NULL,
        name varchar(500) NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT sensors_modes_sensors_fk FOREIGN KEY (fk_sensor) REFERENCES sensors (id)
);

CREATE TABLE products ( 
        id serial NOT NULL, 
        name varchar(500) NOT NULL,
        PRIMARY KEY (id) 
);

CREATE TABLE services ( 
        id serial NOT NULL, 
        name varchar(50) NOT NULL, 
        description varchar(500), 
        username varchar(50) NOT NULL, 
        interval_start timestamp with time zone, 
        interval_end timestamp with time zone, 
        fk_status integer NOT NULL, 
        geometry geometry('MULTIPOLYGON',4326),
        PRIMARY KEY (id),
        CONSTRAINT services_status_fk FOREIGN KEY (fk_status) REFERENCES service_status (id)
);

CREATE INDEX idx_services_geom ON services USING GIST ( geometry );
CREATE INDEX idx_services_user ON services( username );

CREATE TABLE service_sensors (
    fk_service integer,
    fk_sensor integer,
    PRIMARY KEY(fk_service, fk_sensor),
    CONSTRAINT service_sensors_service_fk FOREIGN KEY (fk_service) REFERENCES services (id),
    CONSTRAINT service_sensors_sensor_fk FOREIGN KEY (fk_sensor) REFERENCES sensors (id)
);

CREATE TABLE service_products (
    fk_service integer,
    fk_product integer,
    PRIMARY KEY(fk_service, fk_product),
    CONSTRAINT services_products_service_fk FOREIGN KEY (fk_service) REFERENCES services (id),
    CONSTRAINT services_products_product_fk FOREIGN KEY (fk_product) REFERENCES products (id)
);

CREATE TABLE acquisitions
    (
    id serial NOT NULL,
    fk_service integer NOT NULL,
    fk_sensor integer,
    fk_sensor_mode integer,
    geometry geometry('MULTIPOLYGON',4326),
    interval_start timestamp with time zone,
    interval_end timestamp with time zone,
    type varchar(255),
    duration double precision,
    region varchar(255),
    oza double precision,
    sza double precision,
    look_angle double precision,
    min_incid double precision,
    max_incid double precision,
    rel_orb double precision,
    pass varchar(255),
    nw_lat double precision,
    nw_lon double precision,
    ne_lat double precision,
    ne_lon double precision,
    se_lat double precision,
    se_lon double precision,
    sw_lat double precision,
    sw_lon double precision,
    center_lat double precision,
    center_lon double precision,
    mlst_start varchar(255),
    mlst_end varchar(255),
    data_size double precision,
    satellite varchar(255),
    orb_name varchar(255),
    orbit BIGINT,
    cycle INTEGER,
    track INTEGER,
    frames INTEGER,
    frame_start INTEGER,
    frame_end INTEGER,
    revisiting INTEGER,
    slew INTEGER,
    polarization varchar(255),
    service_provider varchar(255),
    inplan boolean DEFAULT(false),
    CONSTRAINT acquisitions_services_fk FOREIGN KEY (fk_service) REFERENCES services (id),
    CONSTRAINT acquisitions_sensors_fk FOREIGN KEY (fk_sensor) REFERENCES sensors (id),
    CONSTRAINT acquisitions_sensors_modes_fk FOREIGN KEY (fk_sensor_mode) REFERENCES sensors_modes (id),
    PRIMARY KEY (id)
);

CREATE INDEX idx_acquisitions_geom ON acquisitions USING GIST ( geometry );

CREATE AGGREGATE z_cat(anyelement) (
    SFUNC = array_append,
    STYPE = anyarray
);

CREATE VIEW aoi(
 id,name,description,username,interval_start,interval_end,geometry,products,sensors
)
as
select a.id,a.name,a.description, a.username,a.interval_start,a.interval_end, a.geometry,a.products,trim(both '{}' from cast(z_cat(sensors.name) as varchar)) sensors
from
(select services.id,services.name,services.description,services.username,services.interval_start,services.interval_end,services.geometry,trim(both '{}' from cast(z_cat(products.name) as varchar)) products
from services 
inner join service_products on services.id = service_products.fk_service
inner join products on products.id = service_products.fk_product
group by services.id
) a
inner join service_sensors on a.id = service_sensors.fk_service
inner join sensors on sensors.id = service_sensors.fk_sensor
group by a.id,a.name,a.description, a.username,a.interval_start,a.interval_end,a.products,a.geometry;

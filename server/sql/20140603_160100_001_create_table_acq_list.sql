-- Table: acq_list

-- DROP TABLE acq_list;

CREATE TABLE acq_list
(
  fid serial NOT NULL,
  service_name character varying(255) NOT NULL,
  sensor character varying(255) NOT NULL,
  sensor_mode character varying(255) NOT NULL,
  the_geom geometry,
  ships integer,
  start timestamp with time zone,
  "end" timestamp with time zone,
  lat_nw double precision,
  lon_nw double precision,
  lat_ne double precision,
  lon_ne double precision,
  lat_se double precision,
  lon_se double precision,
  lat_sw double precision,
  lon_sw double precision,
  lat_ce double precision,
  lon_ce double precision,
  CONSTRAINT acq_list_pk PRIMARY KEY (fid),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE acq_list
  OWNER TO mariss;
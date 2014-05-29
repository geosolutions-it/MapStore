-- Table: aois

-- DROP TABLE aois;

CREATE TABLE aois
(
  fid serial NOT NULL,
  service_name character varying(255) NOT NULL,
  the_geom geometry,
  start timestamp with time zone,
  "end" timestamp with time zone,
  sensor character varying(255),
  sensor_mode character varying(255),
  status character varying(255),
  CONSTRAINT aois_pkey PRIMARY KEY (fid),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326),
  CONSTRAINT unique_service_name UNIQUE (service_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aois
  OWNER TO mariss;
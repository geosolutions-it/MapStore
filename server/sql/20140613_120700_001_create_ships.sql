-- Table: dlr_ships

-- DROP TABLE dlr_ships;

CREATE TABLE dlr_ships
(
  fid serial NOT NULL,
  service_name character varying(255) NOT NULL,
  the_geom geometry,
  time timestamp with time zone,
  heading bigint,
  length double precision,
  width double precision,
  confidence_level double precision,
  image character varying(255),
  image_type character varying(255),
  speed double precision,
  include_in_report boolean,
  external_id character varying(255),
  CONSTRAINT dlr_ships_pk PRIMARY KEY (fid),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE dlr_ships
  OWNER TO mariss;

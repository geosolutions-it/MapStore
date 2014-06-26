-- Table: products_1to3

-- DROP TABLE products_1to3;

CREATE TABLE products_1to3
(
  fid serial NOT NULL,
  service_name character varying(255) NOT NULL,
  the_geom geometry,
  message_type integer,
  timestamp_sat timestamp with time zone,
  timestamp_db timestamp with time zone,
  -- uncomment if you want it unique
  -- user_id bigint UNIQUE,
  user_id bigint,
  repeat_indicator integer,
  navigational_status integer,
  rot_degrees_per_min double precision,
  sog_kt double precision,
  position_accuracy integer,
  cog_degrees double precision,
  true_heading_degrees integer,
  satellite_id integer,
  source character varying(255),
  latitude double precision,
  longitude double precision,
  CONSTRAINT products_1to3_pk PRIMARY KEY (fid),
  CONSTRAINT enforce_srid_the_geom_products_1to3 CHECK (st_srid(the_geom) = 4326)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE products_1to3
  OWNER TO mariss;
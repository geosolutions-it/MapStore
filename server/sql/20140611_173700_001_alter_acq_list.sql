-- Table: acq_list

-- DROP TABLE acq_list;

CREATE TABLE acq_list
(
  fid serial NOT NULL,
  service_name character varying(255) NOT NULL,
  sensor character varying(255) NOT NULL,
  sensor_mode character varying(255) NOT NULL,
  the_geom geometry,
  start timestamp with time zone,
  "end" timestamp with time zone,
  type character varying(255),
  duration double precision,
  region character varying(255),
  oza double precision,
  sza double precision,
  look_angle double precision,
  min_incid double precision,
  max_incid double precision,
  rel_orb double precision,
  pass character varying(255),
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
  mlst_start character varying(255), -- TODO: time only 6:04:59?
  mlst_end character varying(255), -- TODO: time only 6:04:59?
  data_size double precision,
  satellite character varying(255),
  orb_name character varying(255),
  orbit	bigint,
  cycle integer,
  track integer,
  frames integer,
  frame_start integer,
  frame_end integer,
  revisiting integer,
  slew integer,
  polarization character varying(255),
  service_provider character varying(255),
  CONSTRAINT acq_list_pk PRIMARY KEY (fid),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE acq_list
  OWNER TO mariss;
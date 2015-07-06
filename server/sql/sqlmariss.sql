-- This is a complete script to create empty tables for Mariss tested with Postgres 9.3


CREATE EXTENSION postgis;

SET default_with_oids = false;



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
  mlst_start character varying(255),
  mlst_end character varying(255),
  data_size double precision,
  satellite character varying(255),
  orb_name character varying(255),
  orbit bigint,
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


CREATE TABLE aois
(
  fid serial NOT NULL,
  "desc" text,
  service_name character varying(255) NOT NULL,
  the_geom geometry,
  start timestamp with time zone,
  "end" timestamp with time zone,
  status character varying(255),
  CONSTRAINT aois_pkey PRIMARY KEY (fid),
  CONSTRAINT unique_service_name UNIQUE (service_name),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aois
  OWNER TO mariss;

CREATE TABLE dirmet
(
  fid serial NOT NULL,
  the_geom geometry,
  location character varying,
  "time" timestamp without time zone,
  service character varying,
  identifier character varying,
  partition character varying,
  CONSTRAINT dirmet_pkey PRIMARY KEY (fid),
  CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(the_geom) = 2),
  CONSTRAINT enforce_geotype_the_geom CHECK (geometrytype(the_geom) = 'POLYGON'::text OR the_geom IS NULL),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE dirmet
  OWNER TO mariss;

-- Index: spatial_dirmet_the_geom

-- DROP INDEX spatial_dirmet_the_geom;

CREATE INDEX spatial_dirmet_the_geom
  ON dirmet
  USING gist
  (the_geom);
--
-- TOC entry 186 (class 1259 OID 23585)
-- Dependencies: 3646 3647 3648 1304 5
-- Name: hs; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE hs (
    fid integer NOT NULL,
    the_geom geometry,
    location character varying,
    "time" timestamp without time zone,
    service character varying,
    identifier character varying,
    partition character varying,
    CONSTRAINT enforce_dims_the_geom CHECK ((st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((geometrytype(the_geom) = 'POLYGON'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);


ALTER TABLE public.hs OWNER TO mariss;

--
-- TOC entry 185 (class 1259 OID 23583)
-- Dependencies: 186 5
-- Name: hs_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE hs_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hs_fid_seq OWNER TO mariss;

--
-- TOC entry 3823 (class 0 OID 0)
-- Dependencies: 185
-- Name: hs_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE hs_fid_seq OWNED BY hs.fid;


SET default_with_oids = true;

--
-- TOC entry 179 (class 1259 OID 22369)
-- Dependencies: 5 1304
-- Name: ingestionproducts; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE ingestionproducts (
    servicename character varying,
    identifier character varying,
    bbox geometry,
    "time" timestamp without time zone,
    variable character varying,
    sartype character varying,
    outfilelocation character varying,
    originalfilepath character varying,
    layername character varying,
    partition character varying(10),
    numoilspill character varying(10),
    numshipdetect character varying(10)
);


ALTER TABLE public.ingestionproducts OWNER TO mariss;

SET default_with_oids = false;

--
-- TOC entry 192 (class 1259 OID 23649)
-- Dependencies: 3658 3659 3660 1304 5
-- Name: products_1to3; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE products_1to3 (
    fid integer NOT NULL,
    service_name character varying(255) NOT NULL,
    message_type integer,
    timestamp_sat timestamp with time zone,
    timestamp_db timestamp with time zone,
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
    the_geom geometry,
    CONSTRAINT enforce_dims_the_geom CHECK ((st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((geometrytype(the_geom) = 'POLYGON'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);


ALTER TABLE public.products_1to3 OWNER TO mariss;

--
-- TOC entry 191 (class 1259 OID 23647)
-- Dependencies: 192 5
-- Name: products_1to3_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE products_1to3_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_1to3_fid_seq OWNER TO mariss;

--
-- TOC entry 3824 (class 0 OID 0)
-- Dependencies: 191
-- Name: products_1to3_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE products_1to3_fid_seq OWNED BY products_1to3.fid;


--
-- TOC entry 194 (class 1259 OID 23664)
-- Dependencies: 5
-- Name: products_5; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE products_5 (
    fid integer NOT NULL,
    service_name character varying(255) NOT NULL,
    message_type integer,
    timestamp_sat timestamp with time zone,
    timestamp_db timestamp with time zone,
    user_id bigint,
    name character varying(255),
    message_number bigint,
    ais_version integer,
    imo_number bigint,
    call_sign character varying(255),
    dimension_a_m integer,
    dimension_b_m integer,
    dimension_c_m integer,
    dimension_d_m integer,
    electronic_type integer,
    eta_datetime timestamp with time zone,
    max_static_draught_m double precision,
    destination character varying(255),
    dte integer
);


ALTER TABLE public.products_5 OWNER TO mariss;

--
-- TOC entry 193 (class 1259 OID 23662)
-- Dependencies: 5 194
-- Name: products_5_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE products_5_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_5_fid_seq OWNER TO mariss;

--
-- TOC entry 3825 (class 0 OID 0)
-- Dependencies: 193
-- Name: products_5_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE products_5_fid_seq OWNED BY products_5.fid;


--
-- TOC entry 176 (class 1259 OID 20963)
-- Dependencies: 5
-- Name: sensor; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE sensor (
    id integer NOT NULL,
    sensor_type character varying(255) NOT NULL,
    sensor_mode character varying(255) NOT NULL,
    service_id text NOT NULL
);


ALTER TABLE public.sensor OWNER TO mariss;

--
-- TOC entry 175 (class 1259 OID 20961)
-- Dependencies: 176 5
-- Name: sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE sensor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sensor_id_seq OWNER TO mariss;

--
-- TOC entry 3826 (class 0 OID 0)
-- Dependencies: 175
-- Name: sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE sensor_id_seq OWNED BY sensor.id;


--
-- TOC entry 174 (class 1259 OID 20955)
-- Dependencies: 5
-- Name: sensor_modes; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE sensor_modes (
    id integer NOT NULL,
    sensor_mode character varying(255) NOT NULL
);


ALTER TABLE public.sensor_modes OWNER TO mariss;

--
-- TOC entry 173 (class 1259 OID 20953)
-- Dependencies: 174 5
-- Name: sensor_modes_id_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE sensor_modes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sensor_modes_id_seq OWNER TO mariss;

--
-- TOC entry 3827 (class 0 OID 0)
-- Dependencies: 173
-- Name: sensor_modes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE sensor_modes_id_seq OWNED BY sensor_modes.id;


--
-- TOC entry 172 (class 1259 OID 20947)
-- Dependencies: 5
-- Name: sensors; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE sensors (
    id integer NOT NULL,
    sensor character varying(255) NOT NULL
);


ALTER TABLE public.sensors OWNER TO mariss;

--
-- TOC entry 171 (class 1259 OID 20945)
-- Dependencies: 172 5
-- Name: sensors_id_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE sensors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sensors_id_seq OWNER TO mariss;

--
-- TOC entry 3828 (class 0 OID 0)
-- Dependencies: 171
-- Name: sensors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE sensors_id_seq OWNED BY sensors.id;


--
-- TOC entry 170 (class 1259 OID 20935)
-- Dependencies: 3628 5
-- Name: service; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE service (
    "ID" integer NOT NULL,
    "SERVICE_ID" text NOT NULL,
    "PARENT" text NOT NULL,
    "USER" character varying(80) NOT NULL,
    "STATUS" character varying(80) DEFAULT 'NEW'::character varying NOT NULL
);


ALTER TABLE public.service OWNER TO mariss;

--
-- TOC entry 169 (class 1259 OID 20933)
-- Dependencies: 5 170
-- Name: service_ID_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE "service_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."service_ID_seq" OWNER TO mariss;

--
-- TOC entry 3829 (class 0 OID 0)
-- Dependencies: 169
-- Name: service_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE "service_ID_seq" OWNED BY service."ID";


SET default_with_oids = true;

--
-- TOC entry 180 (class 1259 OID 23257)
-- Dependencies: 3634 3635 3636 5 1304
-- Name: ship_detections; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE ship_detections (
    servicename character varying,
    identifier character varying,
    dsid character varying,
    "timeStamp" timestamp without time zone,
    heading double precision,
    speed double precision,
    length double precision,
    "MMSI" character varying,
    confidencelevel double precision,
    imageidentifier character varying,
    imagetype character varying,
    "RCS" double precision,
    maxpixelvalue double precision,
    shipcategory double precision,
    confidencelevelcat character varying,
    the_geom geometry,
    CONSTRAINT enforce_dims_the_geom CHECK ((st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((geometrytype(the_geom) = 'POINT'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);


ALTER TABLE public.ship_detections OWNER TO mariss;

SET default_with_oids = false;

--
-- TOC entry 178 (class 1259 OID 20997)
-- Dependencies: 3633 1304 5
-- Name: ships; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE ships (
    fid integer NOT NULL,
    service_name character varying(255) NOT NULL,
    the_geom geometry,
    "time" timestamp with time zone,
    heading bigint,
    length double precision,
    width double precision,
    confidence_level double precision,
    image character varying(255),
    image_type character varying(255),
    speed double precision,
    include_in_report boolean,
    external_id character varying(255),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);


ALTER TABLE public.ships OWNER TO mariss;

--
-- TOC entry 177 (class 1259 OID 20995)
-- Dependencies: 178 5
-- Name: ships_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE ships_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ships_fid_seq OWNER TO mariss;

--
-- TOC entry 3830 (class 0 OID 0)
-- Dependencies: 177
-- Name: ships_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE ships_fid_seq OWNED BY ships.fid;


--
-- TOC entry 162 (class 1259 OID 20324)
-- Dependencies: 5
-- Name: spatial_ref_sys; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

--
-- TOC entry 196 (class 1259 OID 23675)
-- Dependencies: 3663 3664 3665 1304 5
-- Name: tem_sd__1p; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE tem_sd__1p (
    ogc_fid integer NOT NULL,
    lat_centre numeric(7,5),
    lon_centre numeric(7,5),
    size_class character varying(1),
    target_qf numeric(10,3),
    target_dir numeric(10,3),
    target_vel numeric(10,3),
    target_utc character varying(19),
    pol_osd_id numeric(5,0),
    ref_osd_id numeric(5,0),
    "time" timestamp with time zone,
    wkb_geometry geometry,
    CONSTRAINT enforce_dims_wkb_geometry CHECK ((st_ndims(wkb_geometry) = 2)),
    CONSTRAINT enforce_geotype_wkb_geometry CHECK (((geometrytype(wkb_geometry) = 'POLYGON'::text) OR (wkb_geometry IS NULL))),
    CONSTRAINT enforce_srid_wkb_geometry CHECK ((st_srid(wkb_geometry) = 4326))
);


ALTER TABLE public.tem_sd__1p OWNER TO mariss;

--
-- TOC entry 195 (class 1259 OID 23673)
-- Dependencies: 5 196
-- Name: tem_sd__1p_ogc_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE tem_sd__1p_ogc_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tem_sd__1p_ogc_fid_seq OWNER TO mariss;

--
-- TOC entry 3832 (class 0 OID 0)
-- Dependencies: 195
-- Name: tem_sd__1p_ogc_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE tem_sd__1p_ogc_fid_seq OWNED BY tem_sd__1p.ogc_fid;
ALTER SEQUENCE tem_sd__1p_ogc_fid_seq OWNED BY tem_sd__1p.ogc_fid;


--
-- TOC entry 182 (class 1259 OID 23553)
-- Dependencies: 3638 3639 3640 5 1304
-- Name: wind-direction; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE "wind-direction" (
    fid integer NOT NULL,
    the_geom geometry,
    location character varying,
    "time" timestamp without time zone,
    service character varying,
    identifier character varying,
    sartype character varying,
    CONSTRAINT enforce_dims_the_geom CHECK ((st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((geometrytype(the_geom) = 'POLYGON'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);


ALTER TABLE public."wind-direction" OWNER TO mariss;

--
-- TOC entry 181 (class 1259 OID 23551)
-- Dependencies: 182 5
-- Name: wind-direction_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE "wind-direction_fid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."wind-direction_fid_seq" OWNER TO mariss;

--
-- TOC entry 3833 (class 0 OID 0)
-- Dependencies: 181
-- Name: wind-direction_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE "wind-direction_fid_seq" OWNED BY "wind-direction".fid;


--
-- TOC entry 184 (class 1259 OID 23569)
-- Dependencies: 3642 3643 3644 5 1304
-- Name: wind-speed; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE "wind-speed" (
    fid integer NOT NULL,
    the_geom geometry,
    location character varying,
    "time" timestamp without time zone,
    service character varying,
    identifier character varying,
    sartype character varying,
    CONSTRAINT enforce_dims_the_geom CHECK ((st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((geometrytype(the_geom) = 'POLYGON'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);


ALTER TABLE public."wind-speed" OWNER TO mariss;

--
-- TOC entry 183 (class 1259 OID 23567)
-- Dependencies: 5 184
-- Name: wind-speed_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE "wind-speed_fid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."wind-speed_fid_seq" OWNER TO mariss;

--
-- TOC entry 3834 (class 0 OID 0)
-- Dependencies: 183
-- Name: wind-speed_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE "wind-speed_fid_seq" OWNED BY "wind-speed".fid;


--
-- TOC entry 190 (class 1259 OID 23617)
-- Dependencies: 3654 3655 3656 1304 5
-- Name: wl; Type: TABLE; Schema: public; Owner: mariss; Tablespace: 
--

CREATE TABLE wl (
    fid integer NOT NULL,
    the_geom geometry,
    location character varying,
    "time" timestamp without time zone,
    service character varying,
    identifier character varying,
    partition character varying,
    CONSTRAINT enforce_dims_the_geom CHECK ((st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((geometrytype(the_geom) = 'POLYGON'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);


ALTER TABLE public.wl OWNER TO mariss;

--
-- TOC entry 189 (class 1259 OID 23615)
-- Dependencies: 5 190
-- Name: wl_fid_seq; Type: SEQUENCE; Schema: public; Owner: mariss
--

CREATE SEQUENCE wl_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wl_fid_seq OWNER TO mariss;

--
-- TOC entry 3835 (class 0 OID 0)
-- Dependencies: 189
-- Name: wl_fid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mariss
--

ALTER SEQUENCE wl_fid_seq OWNED BY wl.fid;


--
-- TOC entry 3623 (class 2604 OID 20912)
-- Dependencies: 166 165 166
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY acq_list ALTER COLUMN fid SET DEFAULT nextval('acq_list_fid_seq'::regclass);


--
-- TOC entry 3625 (class 2604 OID 20924)
-- Dependencies: 167 168 168
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY aois ALTER COLUMN fid SET DEFAULT nextval('aois_fid_seq'::regclass);


--
-- TOC entry 3649 (class 2604 OID 23604)
-- Dependencies: 187 188 188
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY dirmet ALTER COLUMN fid SET DEFAULT nextval('dirmet_fid_seq'::regclass);


--
-- TOC entry 3645 (class 2604 OID 23588)
-- Dependencies: 185 186 186
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY hs ALTER COLUMN fid SET DEFAULT nextval('hs_fid_seq'::regclass);


--
-- TOC entry 3657 (class 2604 OID 23652)
-- Dependencies: 191 192 192
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY products_1to3 ALTER COLUMN fid SET DEFAULT nextval('products_1to3_fid_seq'::regclass);


--
-- TOC entry 3661 (class 2604 OID 23667)
-- Dependencies: 194 193 194
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY products_5 ALTER COLUMN fid SET DEFAULT nextval('products_5_fid_seq'::regclass);


--
-- TOC entry 3631 (class 2604 OID 20966)
-- Dependencies: 175 176 176
-- Name: id; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY sensor ALTER COLUMN id SET DEFAULT nextval('sensor_id_seq'::regclass);


--
-- TOC entry 3630 (class 2604 OID 20958)
-- Dependencies: 173 174 174
-- Name: id; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY sensor_modes ALTER COLUMN id SET DEFAULT nextval('sensor_modes_id_seq'::regclass);


--
-- TOC entry 3629 (class 2604 OID 20950)
-- Dependencies: 172 171 172
-- Name: id; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY sensors ALTER COLUMN id SET DEFAULT nextval('sensors_id_seq'::regclass);


--
-- TOC entry 3627 (class 2604 OID 20938)
-- Dependencies: 169 170 170
-- Name: ID; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY service ALTER COLUMN "ID" SET DEFAULT nextval('"service_ID_seq"'::regclass);


--
-- TOC entry 3632 (class 2604 OID 21000)
-- Dependencies: 177 178 178
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY ships ALTER COLUMN fid SET DEFAULT nextval('ships_fid_seq'::regclass);


--
-- TOC entry 3662 (class 2604 OID 23678)
-- Dependencies: 196 195 196
-- Name: ogc_fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY tem_sd__1p ALTER COLUMN ogc_fid SET DEFAULT nextval('tem_sd__1p_ogc_fid_seq'::regclass);


--
-- TOC entry 3637 (class 2604 OID 23556)
-- Dependencies: 181 182 182
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY "wind-direction" ALTER COLUMN fid SET DEFAULT nextval('"wind-direction_fid_seq"'::regclass);


--
-- TOC entry 3641 (class 2604 OID 23572)
-- Dependencies: 184 183 184
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY "wind-speed" ALTER COLUMN fid SET DEFAULT nextval('"wind-speed_fid_seq"'::regclass);


--
-- TOC entry 3653 (class 2604 OID 23620)
-- Dependencies: 189 190 190
-- Name: fid; Type: DEFAULT; Schema: public; Owner: mariss
--

ALTER TABLE ONLY wl ALTER COLUMN fid SET DEFAULT nextval('wl_fid_seq'::regclass);





--
-- TOC entry 3693 (class 2606 OID 23593)
-- Dependencies: 186 186 3811
-- Name: hs_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY hs
    ADD CONSTRAINT hs_pkey PRIMARY KEY (fid);


--
-- TOC entry 3702 (class 2606 OID 23657)
-- Dependencies: 192 192 3811
-- Name: products_1to3_pk; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY products_1to3
    ADD CONSTRAINT products_1to3_pk PRIMARY KEY (fid);


--
-- TOC entry 3704 (class 2606 OID 23672)
-- Dependencies: 194 194 3811
-- Name: products_5_pk; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY products_5
    ADD CONSTRAINT products_5_pk PRIMARY KEY (fid);


--
-- TOC entry 3681 (class 2606 OID 20960)
-- Dependencies: 174 174 3811
-- Name: sensor_modes_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY sensor_modes
    ADD CONSTRAINT sensor_modes_pkey PRIMARY KEY (id);


--
-- TOC entry 3683 (class 2606 OID 20971)
-- Dependencies: 176 176 3811
-- Name: sensor_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY sensor
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (id);


--
-- TOC entry 3679 (class 2606 OID 20952)
-- Dependencies: 172 172 3811
-- Name: sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY sensors
    ADD CONSTRAINT sensors_pkey PRIMARY KEY (id);


--
-- TOC entry 3677 (class 2606 OID 20944)
-- Dependencies: 170 170 3811
-- Name: service_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY service
    ADD CONSTRAINT service_pkey PRIMARY KEY ("ID");


--
-- TOC entry 3685 (class 2606 OID 21006)
-- Dependencies: 178 178 3811
-- Name: ships_pk; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY ships
    ADD CONSTRAINT ships_pk PRIMARY KEY (fid);




--
-- TOC entry 3707 (class 2606 OID 23680)
-- Dependencies: 196 196 3811
-- Name: tem_sd__1p_pk; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY tem_sd__1p
    ADD CONSTRAINT tem_sd__1p_pk PRIMARY KEY (ogc_fid);





--
-- TOC entry 3688 (class 2606 OID 23561)
-- Dependencies: 182 182 3811
-- Name: wind-direction_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY "wind-direction"
    ADD CONSTRAINT "wind-direction_pkey" PRIMARY KEY (fid);


--
-- TOC entry 3691 (class 2606 OID 23577)
-- Dependencies: 184 184 3811
-- Name: wind-speed_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY "wind-speed"
    ADD CONSTRAINT "wind-speed_pkey" PRIMARY KEY (fid);


--
-- TOC entry 3700 (class 2606 OID 23625)
-- Dependencies: 190 190 3811
-- Name: wl_pkey; Type: CONSTRAINT; Schema: public; Owner: mariss; Tablespace: 
--

ALTER TABLE ONLY wl
    ADD CONSTRAINT wl_pkey PRIMARY KEY (fid);



--
-- TOC entry 3694 (class 1259 OID 23598)
-- Dependencies: 186 2292 3811
-- Name: spatial_hs_the_geom; Type: INDEX; Schema: public; Owner: mariss; Tablespace: 
--

CREATE INDEX spatial_hs_the_geom ON hs USING gist (the_geom);


--
-- TOC entry 3686 (class 1259 OID 23566)
-- Dependencies: 2292 182 3811
-- Name: spatial_wind-direction_the_geom; Type: INDEX; Schema: public; Owner: mariss; Tablespace: 
--

CREATE INDEX "spatial_wind-direction_the_geom" ON "wind-direction" USING gist (the_geom);


--
-- TOC entry 3689 (class 1259 OID 23582)
-- Dependencies: 184 2292 3811
-- Name: spatial_wind-speed_the_geom; Type: INDEX; Schema: public; Owner: mariss; Tablespace: 
--

CREATE INDEX "spatial_wind-speed_the_geom" ON "wind-speed" USING gist (the_geom);


--
-- TOC entry 3698 (class 1259 OID 23630)
-- Dependencies: 190 2292 3811
-- Name: spatial_wl_the_geom; Type: INDEX; Schema: public; Owner: mariss; Tablespace: 
--

CREATE INDEX spatial_wl_the_geom ON wl USING gist (the_geom);


--
-- TOC entry 3705 (class 1259 OID 23688)
-- Dependencies: 2292 196 3811
-- Name: tem_sd__1p_geom_idx; Type: INDEX; Schema: public; Owner: mariss; Tablespace: 
--

CREATE INDEX tem_sd__1p_geom_idx ON tem_sd__1p USING gist (wkb_geometry);


--
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 164
-- Name: geography_columns; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE geography_columns FROM PUBLIC;
REVOKE ALL ON TABLE geography_columns FROM postgres;
GRANT ALL ON TABLE geography_columns TO postgres;
GRANT ALL ON TABLE geography_columns TO PUBLIC;




--
-- TOC entry 3831 (class 0 OID 0)
-- Dependencies: 162
-- Name: spatial_ref_sys; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE spatial_ref_sys FROM PUBLIC;
REVOKE ALL ON TABLE spatial_ref_sys FROM postgres;
GRANT ALL ON TABLE spatial_ref_sys TO postgres;
GRANT ALL ON TABLE spatial_ref_sys TO PUBLIC;


-- Completed on 2015-06-30 16:33:23 CEST

--
-- PostgreSQL database dump complete
--


--
-- TOC entry 3822 (class 0 OID 0)
-- Dependencies: 163
-- Name: geometry_columns; Type: ACL; Schema: public; Owner: postgres
-- Table: geometry_columns

-- DROP TABLE geometry_columns;


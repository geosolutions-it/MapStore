-- Table: products_5

-- DROP TABLE products_5;

CREATE TABLE products_5
(
  fid serial NOT NULL,
  service_name character varying(255) NOT NULL,
  message_type integer,
  timestamp_sat timestamp with time zone,
  timestamp_db timestamp with time zone,
  -- uncomment if it's a fk from products_1to3
  -- user_id bigint references products_1to3(user_id),
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
  dte integer,
  CONSTRAINT products_5_pk PRIMARY KEY (fid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE products_5
  OWNER TO mariss;
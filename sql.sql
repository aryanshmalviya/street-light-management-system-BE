CREATE TABLE IF NOT EXISTS public.assets
(
    pole_id text COLLATE pg_catalog."default" NOT NULL,
    zone_id text COLLATE pg_catalog."default" NOT NULL,
    controller_id text COLLATE pg_catalog."default",
    fixture_type text COLLATE pg_catalog."default",
    installed_on date,
    status text COLLATE pg_catalog."default",
    gps_lat numeric(9,6),
    gps_lng numeric(9,6),
    CONSTRAINT assets_pkey PRIMARY KEY (pole_id),
    CONSTRAINT assets_controller_id_fkey FOREIGN KEY (controller_id)
        REFERENCES public.controllers (controller_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT assets_zone_id_fkey FOREIGN KEY (zone_id)
        REFERENCES public.zones (zone_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)



CREATE INDEX IF NOT EXISTS assets_zone_id_idx
    ON public.assets USING btree
    (zone_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.automation_rules
(
    rule_id text COLLATE pg_catalog."default" NOT NULL,
    zone_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    condition json NOT NULL,
    action text COLLATE pg_catalog."default" NOT NULL,
    active boolean DEFAULT true,
    CONSTRAINT automation_rules_pkey PRIMARY KEY (rule_id),
    CONSTRAINT automation_rules_zone_id_fkey FOREIGN KEY (zone_id)
        REFERENCES public.zones (zone_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
CREATE TABLE IF NOT EXISTS public.controllers
(
    controller_id text COLLATE pg_catalog."default" NOT NULL,
    firmware text COLLATE pg_catalog."default",
    last_seen timestamp with time zone,
    connectivity text COLLATE pg_catalog."default",
    CONSTRAINT controllers_pkey PRIMARY KEY (controller_id)
)


CREATE TABLE IF NOT EXISTS public.faults
(
    fault_id text COLLATE pg_catalog."default" NOT NULL,
    pole_id text COLLATE pg_catalog."default" NOT NULL,
    zone_id text COLLATE pg_catalog."default" NOT NULL,
    fault_code text COLLATE pg_catalog."default" NOT NULL,
    severity text COLLATE pg_catalog."default",
    detected_at timestamp with time zone NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT faults_pkey PRIMARY KEY (fault_id),
    CONSTRAINT faults_pole_id_fkey FOREIGN KEY (pole_id)
        REFERENCES public.assets (pole_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT faults_zone_id_fkey FOREIGN KEY (zone_id)
        REFERENCES public.zones (zone_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

-- Table: public.maintenance_tickets

-- DROP TABLE IF EXISTS public.maintenance_tickets;

CREATE TABLE IF NOT EXISTS public.maintenance_tickets
(
    ticket_id text COLLATE pg_catalog."default" NOT NULL,
    fault_id text COLLATE pg_catalog."default",
    assigned_to text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL,
    sla_hours integer,
    status text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT maintenance_tickets_pkey PRIMARY KEY (ticket_id),
    CONSTRAINT maintenance_tickets_fault_id_fkey FOREIGN KEY (fault_id)
        REFERENCES public.faults (fault_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

-- Table: public.telemetry

-- DROP TABLE IF EXISTS public.telemetry;

CREATE TABLE IF NOT EXISTS public.telemetry
(
    telemetry_id text COLLATE pg_catalog."default" NOT NULL,
    pole_id text COLLATE pg_catalog."default" NOT NULL,
    ts timestamp with time zone NOT NULL,
    state text COLLATE pg_catalog."default" NOT NULL,
    voltage numeric(6,2),
    current_a numeric(6,3),
    power_w numeric(8,2),
    energy_kwh numeric(10,3),
    ambient_lux numeric(8,2),
    temperature_c numeric(5,2),
    dimming_level integer,
    fault_code text COLLATE pg_catalog."default",
    CONSTRAINT telemetry_pkey PRIMARY KEY (telemetry_id),
    CONSTRAINT telemetry_pole_id_fkey FOREIGN KEY (pole_id)
        REFERENCES public.assets (pole_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)



CREATE INDEX IF NOT EXISTS telemetry_pole_ts_idx
    ON public.telemetry USING btree
    (pole_id COLLATE pg_catalog."default" ASC NULLS LAST, ts DESC NULLS FIRST)
    TABLESPACE pg_default;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    role text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email)
)
-- Table: public.zones

-- DROP TABLE IF EXISTS public.zones;

CREATE TABLE IF NOT EXISTS public.zones
(
    zone_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    length_km numeric(6,2),
    latitude numeric(9,6),
    longitude numeric(9,6),
    poles integer DEFAULT 0,
    CONSTRAINT zones_pkey PRIMARY KEY (zone_id)
)

ALTER TABLE IF EXISTS public.users
    ADD COLUMN password character varying;
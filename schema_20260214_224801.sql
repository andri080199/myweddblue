--
-- PostgreSQL database dump
--

\restrict l0bmRbazUoRYAByUGdBuNUkvYC6aQJ5WoHz8gWBMUELpkQGamRFMhctvotsOWWO

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dblink; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;


--
-- Name: EXTENSION dblink; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_content (
    id integer NOT NULL,
    client_id integer NOT NULL,
    content_type character varying(100) NOT NULL,
    content_data jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: client_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.client_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.client_content_id_seq OWNED BY public.client_content.id;


--
-- Name: client_gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_gallery (
    id integer NOT NULL,
    client_id integer NOT NULL,
    image_url text NOT NULL,
    image_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: client_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.client_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.client_gallery_id_seq OWNED BY public.client_gallery.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    slug character varying(255) NOT NULL,
    db_name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password character varying(255) DEFAULT 'client123'::character varying,
    unified_theme_id character varying(255)
);


--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: custom_background_themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_background_themes (
    id integer NOT NULL,
    theme_id character varying(100) NOT NULL,
    theme_name character varying(255) NOT NULL,
    description character varying(500),
    backgrounds jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: custom_background_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_background_themes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_background_themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_background_themes_id_seq OWNED BY public.custom_background_themes.id;


--
-- Name: custom_color_themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_color_themes (
    id integer NOT NULL,
    theme_id character varying(100) NOT NULL,
    theme_name character varying(255) NOT NULL,
    description character varying(500),
    colors jsonb NOT NULL,
    custom_styles jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: custom_color_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_color_themes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_color_themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_color_themes_id_seq OWNED BY public.custom_color_themes.id;


--
-- Name: custom_themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_themes (
    id integer NOT NULL,
    theme_id character varying(100) NOT NULL,
    theme_name character varying(255) NOT NULL,
    description character varying(500),
    colors jsonb NOT NULL,
    backgrounds jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: custom_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_themes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_themes_id_seq OWNED BY public.custom_themes.id;


--
-- Name: guest_names; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guest_names (
    id integer NOT NULL,
    client_id integer NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: guest_names_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guest_names_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guest_names_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guest_names_id_seq OWNED BY public.guest_names.id;


--
-- Name: guestbook; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guestbook (
    id integer NOT NULL,
    client_id integer NOT NULL,
    name character varying(255) NOT NULL,
    message text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: guestbook_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guestbook_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guestbook_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guestbook_id_seq OWNED BY public.guestbook.id;


--
-- Name: music_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.music_library (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    file_data bytea NOT NULL,
    file_name character varying(255) NOT NULL,
    file_size integer NOT NULL,
    file_type character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: music_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.music_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: music_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.music_library_id_seq OWNED BY public.music_library.id;


--
-- Name: ornament_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ornament_library (
    id integer NOT NULL,
    ornament_name character varying(255) NOT NULL,
    ornament_image text NOT NULL,
    category character varying(100) DEFAULT 'general'::character varying,
    file_size integer,
    image_width integer,
    image_height integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE ornament_library; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ornament_library IS 'Reusable ornament library - upload once, use multiple times';


--
-- Name: COLUMN ornament_library.ornament_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ornament_library.ornament_name IS 'Display name of the ornament';


--
-- Name: COLUMN ornament_library.ornament_image; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ornament_library.ornament_image IS 'Base64 encoded image (compressed, max 500KB)';


--
-- Name: COLUMN ornament_library.category; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ornament_library.category IS 'Category: flowers, borders, decorations, corners, dividers, etc.';


--
-- Name: ornament_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ornament_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ornament_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ornament_library_id_seq OWNED BY public.ornament_library.id;


--
-- Name: rsvp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rsvp (
    id integer NOT NULL,
    client_id integer NOT NULL,
    name character varying(255) NOT NULL,
    isattending boolean NOT NULL,
    responsedate timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: rsvp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rsvp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rsvp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rsvp_id_seq OWNED BY public.rsvp.id;


--
-- Name: template_ornaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.template_ornaments (
    id integer NOT NULL,
    template_id integer NOT NULL,
    ornaments_data jsonb DEFAULT '{"ornaments": []}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255)
);


--
-- Name: TABLE template_ornaments; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.template_ornaments IS 'Stores ornament configurations for catalog templates';


--
-- Name: COLUMN template_ornaments.template_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.template_ornaments.template_id IS 'References catalog template ID from external API';


--
-- Name: COLUMN template_ornaments.ornaments_data; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.template_ornaments.ornaments_data IS 'JSONB array of ornament objects with positions, transforms, and styles';


--
-- Name: template_ornaments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.template_ornaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: template_ornaments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.template_ornaments_id_seq OWNED BY public.template_ornaments.id;


--
-- Name: theme_backgrounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme_backgrounds (
    id integer NOT NULL,
    theme_id character varying(100) NOT NULL,
    backgrounds jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: theme_backgrounds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.theme_backgrounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: theme_backgrounds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.theme_backgrounds_id_seq OWNED BY public.theme_backgrounds.id;


--
-- Name: unified_themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unified_themes (
    id integer NOT NULL,
    theme_id character varying(255) NOT NULL,
    theme_name character varying(255) NOT NULL,
    description text,
    is_builtin boolean DEFAULT false,
    colors jsonb DEFAULT '{}'::jsonb NOT NULL,
    custom_styles jsonb DEFAULT '{}'::jsonb,
    backgrounds jsonb DEFAULT '{}'::jsonb NOT NULL,
    ornaments jsonb DEFAULT '{"ornaments": []}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255),
    sample_gallery_source character varying(20) DEFAULT 'template'::character varying,
    sample_gallery_template character varying(100) DEFAULT 'wedding-classic'::character varying,
    sample_gallery_photos jsonb DEFAULT '{"photos": []}'::jsonb
);


--
-- Name: COLUMN unified_themes.sample_gallery_source; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.unified_themes.sample_gallery_source IS 'Source of sample gallery photos: "template" (reusable) or "custom" (theme-specific)';


--
-- Name: COLUMN unified_themes.sample_gallery_template; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.unified_themes.sample_gallery_template IS 'Gallery template ID when source is "template" (e.g., "wedding-classic")';


--
-- Name: COLUMN unified_themes.sample_gallery_photos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.unified_themes.sample_gallery_photos IS 'Custom gallery photos JSONB when source is "custom": {"photos": [{"image_url": "...", "order": 1}]}';


--
-- Name: unified_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.unified_themes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unified_themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.unified_themes_id_seq OWNED BY public.unified_themes.id;


--
-- Name: whatsapp_template; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whatsapp_template (
    id integer NOT NULL,
    client_id integer NOT NULL,
    template_text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: whatsapp_template_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.whatsapp_template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: whatsapp_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.whatsapp_template_id_seq OWNED BY public.whatsapp_template.id;


--
-- Name: client_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_content ALTER COLUMN id SET DEFAULT nextval('public.client_content_id_seq'::regclass);


--
-- Name: client_gallery id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_gallery ALTER COLUMN id SET DEFAULT nextval('public.client_gallery_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: custom_background_themes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_background_themes ALTER COLUMN id SET DEFAULT nextval('public.custom_background_themes_id_seq'::regclass);


--
-- Name: custom_color_themes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_color_themes ALTER COLUMN id SET DEFAULT nextval('public.custom_color_themes_id_seq'::regclass);


--
-- Name: custom_themes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_themes ALTER COLUMN id SET DEFAULT nextval('public.custom_themes_id_seq'::regclass);


--
-- Name: guest_names id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_names ALTER COLUMN id SET DEFAULT nextval('public.guest_names_id_seq'::regclass);


--
-- Name: guestbook id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guestbook ALTER COLUMN id SET DEFAULT nextval('public.guestbook_id_seq'::regclass);


--
-- Name: music_library id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.music_library ALTER COLUMN id SET DEFAULT nextval('public.music_library_id_seq'::regclass);


--
-- Name: ornament_library id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ornament_library ALTER COLUMN id SET DEFAULT nextval('public.ornament_library_id_seq'::regclass);


--
-- Name: rsvp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvp ALTER COLUMN id SET DEFAULT nextval('public.rsvp_id_seq'::regclass);


--
-- Name: template_ornaments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.template_ornaments ALTER COLUMN id SET DEFAULT nextval('public.template_ornaments_id_seq'::regclass);


--
-- Name: theme_backgrounds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_backgrounds ALTER COLUMN id SET DEFAULT nextval('public.theme_backgrounds_id_seq'::regclass);


--
-- Name: unified_themes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unified_themes ALTER COLUMN id SET DEFAULT nextval('public.unified_themes_id_seq'::regclass);


--
-- Name: whatsapp_template id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_template ALTER COLUMN id SET DEFAULT nextval('public.whatsapp_template_id_seq'::regclass);


--
-- Name: client_content client_content_client_id_content_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_content
    ADD CONSTRAINT client_content_client_id_content_type_key UNIQUE (client_id, content_type);


--
-- Name: client_content client_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_content
    ADD CONSTRAINT client_content_pkey PRIMARY KEY (id);


--
-- Name: client_gallery client_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_gallery
    ADD CONSTRAINT client_gallery_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: clients clients_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_slug_key UNIQUE (slug);


--
-- Name: custom_background_themes custom_background_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_background_themes
    ADD CONSTRAINT custom_background_themes_pkey PRIMARY KEY (id);


--
-- Name: custom_background_themes custom_background_themes_theme_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_background_themes
    ADD CONSTRAINT custom_background_themes_theme_id_key UNIQUE (theme_id);


--
-- Name: custom_color_themes custom_color_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_color_themes
    ADD CONSTRAINT custom_color_themes_pkey PRIMARY KEY (id);


--
-- Name: custom_color_themes custom_color_themes_theme_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_color_themes
    ADD CONSTRAINT custom_color_themes_theme_id_key UNIQUE (theme_id);


--
-- Name: custom_themes custom_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_themes
    ADD CONSTRAINT custom_themes_pkey PRIMARY KEY (id);


--
-- Name: custom_themes custom_themes_theme_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_themes
    ADD CONSTRAINT custom_themes_theme_id_key UNIQUE (theme_id);


--
-- Name: guest_names guest_names_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_names
    ADD CONSTRAINT guest_names_pkey PRIMARY KEY (id);


--
-- Name: guestbook guestbook_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guestbook
    ADD CONSTRAINT guestbook_pkey PRIMARY KEY (id);


--
-- Name: music_library music_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.music_library
    ADD CONSTRAINT music_library_pkey PRIMARY KEY (id);


--
-- Name: ornament_library ornament_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ornament_library
    ADD CONSTRAINT ornament_library_pkey PRIMARY KEY (id);


--
-- Name: rsvp rsvp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvp
    ADD CONSTRAINT rsvp_pkey PRIMARY KEY (id);


--
-- Name: template_ornaments template_ornaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.template_ornaments
    ADD CONSTRAINT template_ornaments_pkey PRIMARY KEY (id);


--
-- Name: template_ornaments template_ornaments_template_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.template_ornaments
    ADD CONSTRAINT template_ornaments_template_id_key UNIQUE (template_id);


--
-- Name: theme_backgrounds theme_backgrounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_backgrounds
    ADD CONSTRAINT theme_backgrounds_pkey PRIMARY KEY (id);


--
-- Name: theme_backgrounds theme_backgrounds_theme_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_backgrounds
    ADD CONSTRAINT theme_backgrounds_theme_id_key UNIQUE (theme_id);


--
-- Name: unified_themes unified_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unified_themes
    ADD CONSTRAINT unified_themes_pkey PRIMARY KEY (id);


--
-- Name: unified_themes unified_themes_theme_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unified_themes
    ADD CONSTRAINT unified_themes_theme_id_key UNIQUE (theme_id);


--
-- Name: whatsapp_template whatsapp_template_client_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_template
    ADD CONSTRAINT whatsapp_template_client_id_key UNIQUE (client_id);


--
-- Name: whatsapp_template whatsapp_template_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_template
    ADD CONSTRAINT whatsapp_template_pkey PRIMARY KEY (id);


--
-- Name: idx_client_content_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_content_client_id ON public.client_content USING btree (client_id);


--
-- Name: idx_client_gallery_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_gallery_client_id ON public.client_gallery USING btree (client_id);


--
-- Name: idx_client_gallery_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_gallery_order ON public.client_gallery USING btree (client_id, image_order);


--
-- Name: idx_clients_unified_theme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clients_unified_theme ON public.clients USING btree (unified_theme_id);


--
-- Name: idx_custom_background_themes_theme_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_custom_background_themes_theme_id ON public.custom_background_themes USING btree (theme_id);


--
-- Name: idx_custom_color_themes_theme_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_custom_color_themes_theme_id ON public.custom_color_themes USING btree (theme_id);


--
-- Name: idx_guest_names_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guest_names_client_id ON public.guest_names USING btree (client_id);


--
-- Name: idx_guest_names_url; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guest_names_url ON public.guest_names USING btree (url);


--
-- Name: idx_guestbook_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guestbook_client_id ON public.guestbook USING btree (client_id);


--
-- Name: idx_ornament_library_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ornament_library_category ON public.ornament_library USING btree (category);


--
-- Name: idx_ornament_library_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ornament_library_name ON public.ornament_library USING btree (ornament_name);


--
-- Name: idx_rsvp_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rsvp_client_id ON public.rsvp USING btree (client_id);


--
-- Name: idx_template_ornaments_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_template_ornaments_template_id ON public.template_ornaments USING btree (template_id);


--
-- Name: idx_unified_themes_builtin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_unified_themes_builtin ON public.unified_themes USING btree (is_builtin);


--
-- Name: idx_unified_themes_gallery_template; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_unified_themes_gallery_template ON public.unified_themes USING btree (sample_gallery_template);


--
-- Name: idx_unified_themes_theme_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_unified_themes_theme_id ON public.unified_themes USING btree (theme_id);


--
-- Name: idx_whatsapp_template_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_whatsapp_template_client_id ON public.whatsapp_template USING btree (client_id);


--
-- Name: client_content client_content_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_content
    ADD CONSTRAINT client_content_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: client_gallery client_gallery_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_gallery
    ADD CONSTRAINT client_gallery_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: clients clients_unified_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_unified_theme_id_fkey FOREIGN KEY (unified_theme_id) REFERENCES public.unified_themes(theme_id);


--
-- Name: guest_names guest_names_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_names
    ADD CONSTRAINT guest_names_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: guestbook guestbook_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guestbook
    ADD CONSTRAINT guestbook_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: rsvp rsvp_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvp
    ADD CONSTRAINT rsvp_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: whatsapp_template whatsapp_template_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_template
    ADD CONSTRAINT whatsapp_template_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict l0bmRbazUoRYAByUGdBuNUkvYC6aQJ5WoHz8gWBMUELpkQGamRFMhctvotsOWWO


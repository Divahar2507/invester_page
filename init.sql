--
-- PostgreSQL database dump
--

\restrict B331UHHb5aJyHNcGsY579mRx12WXoxCSbYg3B1DJeQNTDCWHwazuvYSgCY99Nhd

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connections (
    id integer NOT NULL,
    requester_id integer NOT NULL,
    receiver_id integer NOT NULL,
    status character varying,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.connections OWNER TO postgres;

--
-- Name: connections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.connections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.connections_id_seq OWNER TO postgres;

--
-- Name: connections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.connections_id_seq OWNED BY public.connections.id;


--
-- Name: investments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investments (
    id integer NOT NULL,
    investor_id integer NOT NULL,
    startup_name character varying NOT NULL,
    amount double precision NOT NULL,
    date timestamp without time zone,
    round character varying,
    notes text,
    status character varying
);


ALTER TABLE public.investments OWNER TO postgres;

--
-- Name: investments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.investments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.investments_id_seq OWNER TO postgres;

--
-- Name: investments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.investments_id_seq OWNED BY public.investments.id;


--
-- Name: investor_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investor_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    firm_name character varying NOT NULL,
    focus_industries character varying,
    preferred_stage character varying NOT NULL,
    contact_name character varying,
    bio text,
    website_url character varying,
    linkedin_url character varying,
    min_check_size double precision,
    max_check_size double precision
);


ALTER TABLE public.investor_profiles OWNER TO postgres;

--
-- Name: investor_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.investor_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.investor_profiles_id_seq OWNER TO postgres;

--
-- Name: investor_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.investor_profiles_id_seq OWNED BY public.investor_profiles.id;


--
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    startup_id integer NOT NULL,
    investor_id integer NOT NULL,
    match_score double precision
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_id_seq OWNER TO postgres;

--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    content text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying NOT NULL,
    title character varying NOT NULL,
    description character varying,
    related_id integer,
    is_read boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: pitches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pitches (
    id integer NOT NULL,
    startup_id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    pitch_file_url character varying,
    status character varying,
    raising_amount character varying,
    equity_percentage character varying,
    created_at timestamp with time zone DEFAULT now(),
    pitch_deck_url character varying,
    financial_doc_url character varying,
    business_plan_url character varying,
    other_docs_urls text,
    industry character varying,
    funding_stage character varying,
    amount_seeking integer,
    business_model character varying,
    revenue_model character varying,
    team_size integer,
    tags character varying,
    location character varying
);


ALTER TABLE public.pitches OWNER TO postgres;

--
-- Name: pitches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pitches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pitches_id_seq OWNER TO postgres;

--
-- Name: pitches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pitches_id_seq OWNED BY public.pitches.id;


--
-- Name: startup_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.startup_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_name character varying NOT NULL,
    industry character varying NOT NULL,
    funding_stage character varying NOT NULL,
    vision text,
    problem text,
    solution text,
    description text,
    city character varying,
    state character varying,
    pincode character varying,
    contact_address text,
    mobile character varying,
    email_verified boolean,
    mobile_verified boolean,
    founder_name character varying,
    founder_bio text,
    founder_linkedin character varying,
    resume_url character varying,
    website_url character varying
);


ALTER TABLE public.startup_profiles OWNER TO postgres;

--
-- Name: startup_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.startup_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.startup_profiles_id_seq OWNER TO postgres;

--
-- Name: startup_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.startup_profiles_id_seq OWNED BY public.startup_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    role character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: watchlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watchlist (
    id integer NOT NULL,
    user_id integer NOT NULL,
    startup_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.watchlist OWNER TO postgres;

--
-- Name: watchlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.watchlist_id_seq OWNER TO postgres;

--
-- Name: watchlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.watchlist_id_seq OWNED BY public.watchlist.id;


--
-- Name: connections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections ALTER COLUMN id SET DEFAULT nextval('public.connections_id_seq'::regclass);


--
-- Name: investments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments ALTER COLUMN id SET DEFAULT nextval('public.investments_id_seq'::regclass);


--
-- Name: investor_profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_profiles ALTER COLUMN id SET DEFAULT nextval('public.investor_profiles_id_seq'::regclass);


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: pitches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pitches ALTER COLUMN id SET DEFAULT nextval('public.pitches_id_seq'::regclass);


--
-- Name: startup_profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.startup_profiles ALTER COLUMN id SET DEFAULT nextval('public.startup_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: watchlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist ALTER COLUMN id SET DEFAULT nextval('public.watchlist_id_seq'::regclass);


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.connections (id, requester_id, receiver_id, status, created_at) FROM stdin;
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.investments (id, investor_id, startup_name, amount, date, round, notes, status) FROM stdin;
\.


--
-- Data for Name: investor_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.investor_profiles (id, user_id, firm_name, focus_industries, preferred_stage, contact_name, bio, website_url, linkedin_url, min_check_size, max_check_size) FROM stdin;
1	1	Venture Capital One	Technology, AI, SaaS	Seed	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matches (id, startup_id, investor_id, match_score) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, content, "timestamp") FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, title, description, related_id, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: pitches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pitches (id, startup_id, title, description, pitch_file_url, status, raising_amount, equity_percentage, created_at) FROM stdin;
1	1	EcoCharge Pitch Deck	Wireless charging for EVs at stopping lights.	\N	active	$12M	15%	2026-01-11 21:23:14.347814+05:30
2	2	BioLife Pitch Deck	Personalized medicine using CRISPR.	\N	active	$2M	15%	2026-01-11 21:23:14.74152+05:30
3	3	BlockPay Pitch Deck	Seamless crypto payments for retail.	\N	active	$500k	15%	2026-01-11 21:23:15.13489+05:30
\.


--
-- Data for Name: startup_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.startup_profiles (id, user_id, company_name, industry, funding_stage, vision, problem, solution, description, city, state, pincode, contact_address, mobile, email_verified, mobile_verified, founder_name, founder_bio, founder_linkedin, resume_url, website_url) FROM stdin;
1	3	EcoCharge	CleanTech	Series A	To change the world	Big problem	Great solution	Wireless charging for EVs at stopping lights.	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N
2	4	BioLife	HealthTech	Seed	To change the world	Big problem	Great solution	Personalized medicine using CRISPR.	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N
3	5	BlockPay	FinTech	Pre-Seed	To change the world	Big problem	Great solution	Seamless crypto payments for retail.	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role, created_at) FROM stdin;
1	investor@test.com	$2b$12$ai/AkLSzQsNZ1ZVLYUy86eyCNrBurboV.EnOiT4aya6GiRfjQmxF6	investor	2026-01-11 21:22:04.919452+05:30
2	startup@test.com	$2b$12$/cBwdNMzyiTc8FyTxlaq/.WbG0F..6tzNIW7j9kLv7lnnqfh1ZXpq	startup	2026-01-11 21:22:05.329572+05:30
3	eco@test.com	$2b$12$yqQpi2LE3Ks8rZmrhXRClepJzPLRDaHKg5xJ5GiLASwtk4skzVCh.	startup	2026-01-11 21:23:13.933227+05:30
4	med@test.com	$2b$12$FymGObaM.BwLQUtKzfvrw..lxoXWUmx3N9tTvArmMvspiF72tEfRy	startup	2026-01-11 21:23:14.347814+05:30
5	fin@test.com	$2b$12$3HSRWxosSGKCGiERDUE5XeV1RoSCzSPdRSxHSE0/l8trDBGPiUvmC	startup	2026-01-11 21:23:14.74152+05:30
\.


--
-- Data for Name: watchlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.watchlist (id, user_id, startup_id, created_at) FROM stdin;
\.


--
-- Name: connections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.connections_id_seq', 1, false);


--
-- Name: investments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investments_id_seq', 1, false);


--
-- Name: investor_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investor_profiles_id_seq', 1, true);


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matches_id_seq', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: pitches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pitches_id_seq', 3, true);


--
-- Name: startup_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.startup_profiles_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: watchlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.watchlist_id_seq', 1, false);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: investments investments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_pkey PRIMARY KEY (id);


--
-- Name: investor_profiles investor_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_profiles
    ADD CONSTRAINT investor_profiles_pkey PRIMARY KEY (id);


--
-- Name: investor_profiles investor_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_profiles
    ADD CONSTRAINT investor_profiles_user_id_key UNIQUE (user_id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: pitches pitches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pitches
    ADD CONSTRAINT pitches_pkey PRIMARY KEY (id);


--
-- Name: startup_profiles startup_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.startup_profiles
    ADD CONSTRAINT startup_profiles_pkey PRIMARY KEY (id);


--
-- Name: startup_profiles startup_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.startup_profiles
    ADD CONSTRAINT startup_profiles_user_id_key UNIQUE (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: watchlist watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (id);


--
-- Name: ix_connections_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_connections_id ON public.connections USING btree (id);


--
-- Name: ix_investments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_investments_id ON public.investments USING btree (id);


--
-- Name: ix_investor_profiles_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_investor_profiles_id ON public.investor_profiles USING btree (id);


--
-- Name: ix_matches_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_matches_id ON public.matches USING btree (id);


--
-- Name: ix_messages_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_messages_id ON public.messages USING btree (id);


--
-- Name: ix_notifications_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_notifications_id ON public.notifications USING btree (id);


--
-- Name: ix_pitches_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_pitches_id ON public.pitches USING btree (id);


--
-- Name: ix_startup_profiles_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_startup_profiles_id ON public.startup_profiles USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_watchlist_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_watchlist_id ON public.watchlist USING btree (id);


--
-- Name: connections connections_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- Name: connections connections_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id);


--
-- Name: investments investments_investor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES public.investor_profiles(id);


--
-- Name: investor_profiles investor_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_profiles
    ADD CONSTRAINT investor_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: matches matches_investor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES public.investor_profiles(id);


--
-- Name: matches matches_startup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startup_profiles(id);


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: pitches pitches_startup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pitches
    ADD CONSTRAINT pitches_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startup_profiles(id);


--
-- Name: startup_profiles startup_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.startup_profiles
    ADD CONSTRAINT startup_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: watchlist watchlist_startup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startup_profiles(id);


--
-- Name: watchlist watchlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict B331UHHb5aJyHNcGsY579mRx12WXoxCSbYg3B1DJeQNTDCWHwazuvYSgCY99Nhd


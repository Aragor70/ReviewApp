CREATE DATABASE review;



CREATE TABLE public.accounts (
    user_id SERIAL PRIMARY KEY,
    name character varying(250) NOT NULL,
    password character varying(250) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone,
    avatar character(255),
    token character varying(255),
    public_key character varying(255),
    private_key character varying(255),
    account_type character varying(255),
    approved boolean DEFAULT false,
    code character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    gender_title character varying(255),
    country character varying(255),
    date_of_birth timestamp without time zone,
);
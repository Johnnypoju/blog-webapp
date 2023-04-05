CREATE TABLE blogs ( 
id serial UNIQUE PRIMARY KEY,
author TEXT,
url TEXT NOT NULL,
title TEXT NOT NULL,
likes INT DEFAULT 0 );

insert into blogs 
(author, title, url) 
values 
('Dan Abramov', 'On let vs const', 'www.dan.org'), 
('Lauren Albe', 'Gaps in sequences in PostgreSQL', 'www.albe.fi');

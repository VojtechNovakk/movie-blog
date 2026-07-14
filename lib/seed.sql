INSERT INTO cinemas (cinema_id, name, website) VALUES 
(1, 'Kino Světozor', 'https://www.kinosvetozor.cz'),
(2, 'Bio Oko', 'https://www.biooko.net');

INSERT INTO movies (movie_id, name, director, length, review, date, poster, cinema_id) VALUES 
(1, 'The Cinematic Masterpiece', 'Example Director', 120, 'This is a fantastic static placeholder review text for our first mockup movie.', '2026-07-14', '/movie_poster.jpg', 1),
(2, 'Beyond The Stars', 'Sci-Fi Director', 145, 'A dark and moody journey through a glowing red portal in deep space. Absolutely breathtaking visual effects.', '2026-07-15', '/scifi_poster.jpg', 2),
(3, 'Golden Hour Drama', 'Drama Director', 105, 'An emotional rollercoaster highlighting the beautiful silhouette of two people on a hill. Heartwarming and tragic.', '2026-07-16', '/drama_poster.jpg', 1);

BEGIN;
CREATE TABLE movies (
    movie_id INT,
    name VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    length INT NOT NULL,
    review TEXT NOT NULL,
    date DATE NOT NULL,
    poster VARCHAR(255),
    rating INT NOT NULL,
    cinema_id INT NOT NULL
);
ALTER TABLE movies ADD CONSTRAINT pk_movie PRIMARY KEY (movie_id);
CREATE TABLE cinemas (
    cinema_id INT,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL
);
ALTER TABLE cinemas ADD CONSTRAINT pk_cinema PRIMARY KEY (cinema_id);
ALTER TABLE movies ADD CONSTRAINT fk_cinema FOREIGN KEY (cinema_id) REFERENCES cinemas ON DELETE CASCADE;
COMMIT;

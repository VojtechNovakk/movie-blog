import { query } from "@/lib/db";
import MovieViewer from "./MovieViewer";

export default async function Home() {
  const result = await query(`
    SELECT m.movie_id, m.name, m.director, m.length, m.review, m.date, m.poster, m.rating,
           c.name AS cinema_name, c.website AS cinema_website
    FROM movies m
    JOIN cinemas c ON m.cinema_id = c.cinema_id
    ORDER BY m.date DESC
  `);

  const movies = result.rows.map((row: any) => ({
    ...row,
    date: row.date instanceof Date ? row.date.toISOString() : String(row.date),
  }));

  return <MovieViewer movies={movies} />;
}

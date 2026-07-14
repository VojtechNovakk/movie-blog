"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMovieAction(formData: FormData) {
  const name = formData.get("name") as string;
  const director = formData.get("director") as string;
  const length = parseInt(formData.get("length") as string, 10);
  const rating = parseInt(formData.get("rating") as string, 10) || 5;
  const review = formData.get("review") as string;
  const date = formData.get("date") as string;
  const poster = formData.get("poster") as string;
  
  let cinema_id = formData.get("cinema_id") as string;
  
  // Pokud uživatel vybral přidání nového kina
  if (cinema_id === "new") {
    const newCinemaName = formData.get("new_cinema_name") as string;
    const newCinemaWebsite = formData.get("new_cinema_website") as string;
    
    // Zjistíme nové ID pro kino
    const cinemaIdResult = await query("SELECT COALESCE(MAX(cinema_id), 0) + 1 AS next_id FROM cinemas");
    const nextCinemaId = cinemaIdResult.rows[0].next_id;
    
    // Uložíme nové kino
    await query(
      `INSERT INTO cinemas (cinema_id, name, website) VALUES ($1, $2, $3)`,
      [nextCinemaId, newCinemaName, newCinemaWebsite]
    );
    
    // Nastavíme cinema_id pro vložení filmu na nově vytvořené kino
    cinema_id = nextCinemaId.toString();
  }

  // Zjistíme nové ID pro film
  const idResult = await query("SELECT COALESCE(MAX(movie_id), 0) + 1 AS next_id FROM movies");
  const nextId = idResult.rows[0].next_id;

  // Uložíme film s referencí na kino
  await query(
    `INSERT INTO movies (movie_id, name, director, length, review, date, poster, cinema_id, rating)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [nextId, name, director, length, review, date, poster, parseInt(cinema_id, 10), rating]
  );

  revalidatePath("/");
  redirect("/admin");
}

export async function updateMovieAction(formData: FormData) {
  const movie_id = parseInt(formData.get("movie_id") as string, 10);
  const name = formData.get("name") as string;
  const director = formData.get("director") as string;
  const length = parseInt(formData.get("length") as string, 10);
  const rating = parseInt(formData.get("rating") as string, 10) || 5;
  const review = formData.get("review") as string;
  const date = formData.get("date") as string;
  const poster = formData.get("poster") as string;
  
  let cinema_id = formData.get("cinema_id") as string;
  
  if (cinema_id === "new") {
    const newCinemaName = formData.get("new_cinema_name") as string;
    const newCinemaWebsite = formData.get("new_cinema_website") as string;
    const cinemaIdResult = await query("SELECT COALESCE(MAX(cinema_id), 0) + 1 AS next_id FROM cinemas");
    const nextCinemaId = cinemaIdResult.rows[0].next_id;
    
    await query(
      `INSERT INTO cinemas (cinema_id, name, website) VALUES ($1, $2, $3)`,
      [nextCinemaId, newCinemaName, newCinemaWebsite]
    );
    cinema_id = nextCinemaId.toString();
  }

  await query(
    `UPDATE movies 
     SET name=$1, director=$2, length=$3, review=$4, date=$5, poster=$6, cinema_id=$7, rating=$8 
     WHERE movie_id=$9`,
    [name, director, length, review, date, poster, parseInt(cinema_id, 10), rating, movie_id]
  );

  revalidatePath("/");
  redirect("/admin");
}

export async function deleteMovieAction(formData: FormData) {
  const movie_id = parseInt(formData.get("movie_id") as string, 10);
  
  await query(`DELETE FROM movies WHERE movie_id = $1`, [movie_id]);

  revalidatePath("/");
  redirect("/admin");
}

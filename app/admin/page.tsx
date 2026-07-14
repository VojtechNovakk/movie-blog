import { query } from "@/lib/db";
import AdminForm from "./AdminForm";
import { deleteMovieAction } from "./actions";

export default async function AdminPage(props: { searchParams: Promise<{ edit?: string }> }) {
  const searchParams = await props.searchParams;

  // Načteme dostupná kina pro select box
  const cinemasResult = await query("SELECT cinema_id, name FROM cinemas ORDER BY name");
  const cinemas = cinemasResult.rows;

  let initialData = null;
  if (searchParams.edit) {
    const editResult = await query("SELECT * FROM movies WHERE movie_id = $1", [parseInt(searchParams.edit, 10)]);
    if (editResult.rows.length > 0) {
      initialData = {
        ...editResult.rows[0],
        date: editResult.rows[0].date instanceof Date 
          ? editResult.rows[0].date.toISOString() 
          : String(editResult.rows[0].date)
      };
    }
  }

  // Načteme všechny filmy pro seznam
  const moviesResult = await query("SELECT m.movie_id, m.name, m.director, c.name as cinema_name FROM movies m JOIN cinemas c ON m.cinema_id = c.cinema_id ORDER BY m.date DESC");
  const movies = moviesResult.rows;

  return (
    <div className="min-h-screen bg-white text-black p-10 font-sans overflow-y-auto">
      <div className="max-w-2xl mx-auto flex flex-col gap-16">
        
        <section>
          <h1 className="text-3xl font-bold mb-8 uppercase tracking-[4px]">
            {initialData ? "Edit movie" : "Add new movie"}
          </h1>
          <AdminForm cinemas={cinemas} initialData={initialData} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-[3px] border-t border-gray-200 pt-8">Manage Movies</h2>
          {movies.length === 0 ? (
            <p className="text-gray-500">No movies found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {movies.map((m) => (
                <div key={m.movie_id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-black transition-colors bg-gray-50">
                  <div>
                    <div className="font-bold">{m.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{m.director} • {m.cinema_name}</div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/admin?edit=${m.movie_id}`} className="px-4 py-2 text-sm font-bold uppercase tracking-widest border border-black rounded-md hover:bg-black hover:text-white transition-colors">
                      Edit
                    </a>
                    <form action={deleteMovieAction}>
                      <input type="hidden" name="movie_id" value={m.movie_id} />
                      <button type="submit" className="px-4 py-2 text-sm font-bold uppercase tracking-widest border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

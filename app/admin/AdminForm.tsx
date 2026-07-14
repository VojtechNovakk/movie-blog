"use client";

import { useState } from "react";
import { addMovieAction, updateMovieAction } from "./actions";

type Cinema = {
  cinema_id: number;
  name: string;
};

export default function AdminForm({ cinemas, initialData }: { cinemas: Cinema[], initialData?: any }) {
  const [isNewCinema, setIsNewCinema] = useState(false);

  // Format date to YYYY-MM-DD for the input
  const defaultDate = initialData?.date 
    ? new Date(initialData.date).toISOString().split('T')[0]
    : "";

  return (
    <form action={initialData ? updateMovieAction : addMovieAction} className="flex flex-col gap-5">
      {initialData && <input type="hidden" name="movie_id" value={initialData.movie_id} />}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Movie Name</label>
        <input name="name" required type="text" defaultValue={initialData?.name} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors" placeholder="e.g. Inception" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Director</label>
        <input name="director" required type="text" defaultValue={initialData?.director} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors" placeholder="e.g. Christopher Nolan" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Duration (minutes)</label>
        <input name="length" required type="number" min="1" defaultValue={initialData?.length} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors" placeholder="e.g. 148" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Watched Date</label>
        <input name="date" required type="date" defaultValue={defaultDate} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Poster URL</label>
        <input name="poster" required type="url" defaultValue={initialData?.poster} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors" placeholder="https://..." />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Rating</label>
        <select name="rating" required defaultValue={initialData?.rating || "5"} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors bg-white">
          <option value="5">★★★★★ (5/5)</option>
          <option value="4">★★★★☆ (4/5)</option>
          <option value="3">★★★☆☆ (3/5)</option>
          <option value="2">★★☆☆☆ (2/5)</option>
          <option value="1">★☆☆☆☆ (1/5)</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Cinema</label>
        <select 
          name="cinema_id" 
          required 
          defaultValue={initialData?.cinema_id || ""}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors bg-white"
          onChange={(e) => setIsNewCinema(e.target.value === "new")}
        >
          <option value="">Select a cinema...</option>
          {cinemas.map(c => (
            <option key={c.cinema_id} value={c.cinema_id}>{c.name}</option>
          ))}
          <option value="new" className="font-bold">+ Add new cinema</option>
        </select>
      </div>

      {isNewCinema && (
        <div className="flex flex-col gap-4 p-5 bg-[#f9f9f9] border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wide">New Cinema Name</label>
            <input name="new_cinema_name" required={isNewCinema} type="text" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors bg-white" placeholder="e.g. IMAX Cinema City" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wide">New Cinema Website</label>
            <input name="new_cinema_website" required={isNewCinema} type="url" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors bg-white" placeholder="https://..." />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wide">Review (HTML allowed)</label>
        <textarea name="review" required rows={6} defaultValue={initialData?.review} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black transition-colors font-mono text-sm" placeholder="<p>A masterpiece...</p>"></textarea>
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="flex-1 bg-black text-white font-bold uppercase tracking-[2px] py-4 rounded-lg hover:bg-gray-800 transition-colors">
          {initialData ? "Update Movie" : "Add Movie"}
        </button>
        {initialData && (
          <a href="/admin" className="flex items-center justify-center px-6 bg-gray-200 text-black font-bold uppercase tracking-[1px] rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </a>
        )}
      </div>
    </form>
  );
}

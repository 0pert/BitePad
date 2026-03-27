"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { loadEntries } from "@/lib/content/loadEntries";

export const dynamic = "force-dynamic";

interface Entry {
  type: string;
  title: string;
  slug: string;
  status: string;
  fav: boolean;
  tags: string[];
  timeMinutes?: number;
}

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => setEntries(data));
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      query === "" ||
      entry.title.toLowerCase().includes(query) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(query));

    const matchesFavorite = !favoritesOnly || entry.fav;

    return matchesSearch && matchesFavorite;
  });

  const recipes = filteredEntries
    .filter((e) => e.type === "recipe")
    .sort((a, b) => a.title.localeCompare(b.title));

  const ideas = filteredEntries
    .filter((e) => e.type === "idea")
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main
      style={{ padding: 24, maxWidth: 500, width: "100%", margin: "0 auto" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Link href="/entries/new">
          <img src="BitePad.png" style={{ height: 50, padding: 5 }} />
        </Link>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: "1px solid #171717", padding: 6, width: "70%" }}
        />

        <label
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
            style={{ display: "none" }}
          />
          <img
            src={favoritesOnly ? "fav-filled.png" : "fav.png"}
            style={{ height: 30 }}
          />
        </label>
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recipes */}
        <div>
          <h2>Recipes:</h2>
          <ul
            style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}
          >
            {recipes.map((entry) => (
              <li
                key={entry.slug}
                style={{
                  border: "2px solid #171717",
                  padding: 16,
                  borderRadius: 8,
                  position: "relative",
                }}
              >
                <Link href={`/entries/${entry.slug}`}>
                  <strong>{entry.title}</strong>
                </Link>
                <Link href={`/entries/edit/${entry.slug}`} className="card">
                  <img src="edit.png" className="edit-icon-card" />
                </Link>

                {entry.fav && (
                  <img src="fav-filled.png" className="favorite-icon-card" />
                )}
                {/* <div>{entry.status}</div> */}
                <div>
                  <i>{entry.tags.join(" · ")}</i>
                </div>
                {/* {entry.timeMinutes ? <div>{entry.timeMinutes} min</div> : null} */}
              </li>
            ))}
          </ul>
        </div>

        {/* Ideas */}
        <div>
          <h2>Ideas:</h2>
          <ul
            style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}
          >
            {ideas.map((entry) => (
              <li
                key={entry.slug}
                style={{
                  border: "2px solid #171717",
                  padding: 16,
                  borderRadius: 8,
                  position: "relative",
                }}
              >
                <Link href={`/entries/${entry.slug}`}>
                  <strong>{entry.title}</strong>
                </Link>
                <Link href={`/entries/edit/${entry.slug}`} className="card">
                  <img src="edit.png" className="edit-icon-card" />
                </Link>
                {/* <div>{entry.status}</div> */}
                <div>
                  <i>{entry.tags.join(" · ")}</i>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

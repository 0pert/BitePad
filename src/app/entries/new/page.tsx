"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEntryPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"recipe" | "idea">("recipe");
  const [status, setStatus] = useState("saved");
  const [tags, setTags] = useState("");
  const [mainIngredients, setMainIngredients] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type,
        status,
        tags: tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        mainIngredients: mainIngredients
          ? mainIngredients
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : undefined,
        timeMinutes: timeMinutes ? Number(timeMinutes) : undefined,
        cuisine: cuisine ? cuisine : undefined,
        body,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Could not create entry");
      return;
    }

    const created = await res.json();
    router.push(`/entries/${created.slug}`);
  }

  return (
    <main style={{ padding: 24, width: "100%", margin: "0 auto" }}>
      <Link href="/">
          <img src="../../left-arrow.png" className="left-arrow" />
        </Link>
      <h1>New Entry:</h1>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, border: "2px solid #171717" }}
      >
        {/* style={{ border: "2px solid #171717" }} */}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "recipe" | "idea")}
          style={{ borderTop: "1px solid #171717" }}
        >
          <option value="recipe">recipe</option>
          <option value="idea">idea</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ borderTop: "1px solid #171717" }}
        >
          <option value="idea">idea</option>
          <option value="saved">saved</option>
          <option value="tested">tested</option>
          <option value="favorite">favorite</option>
        </select>

        <input
          placeholder="Tags, comma-separated"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ borderTop: "1px solid #171717" }}
        />

        {type == "recipe" && (
          <input
            placeholder="Cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            style={{ borderTop: "1px solid #171717" }}
          />
        )}

        {type == "recipe" && (
          <input
            placeholder="Main ingredients, comma-separated"
            value={mainIngredients}
            onChange={(e) => setMainIngredients(e.target.value)}
            style={{ borderTop: "1px solid #171717" }}
          />
        )}

        {type == "recipe" && (
          <input
            placeholder="Time in minutes"
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(e.target.value)}
            style={{ borderTop: "1px solid #171717" }}
          />
        )}

        <textarea
          placeholder="# Ingredients:"
          rows={18}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="editor"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </main>
  );
}

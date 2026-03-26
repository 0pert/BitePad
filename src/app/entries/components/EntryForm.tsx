"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Entry = {
  title?: string;
  slug?: string;
  cuisine?: string;
  type?: string;
  status?: string;
  body?: string;
  timeMinutes?: number;
  tags?: string[];
  mainIngredients?: string[];
};

type EntryFormProps = {
  initialData?: Entry;
  mode: "new" | "edit";
};

export default function EntryForm({ initialData, mode }: EntryFormProps) {

  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [type, setType] = useState(initialData?.type ?? "recipe");
  const [status, setStatus] = useState(initialData?.status ?? "saved");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");
  const [mainIngredients, setMainIngredients] = useState(initialData?.mainIngredients?.join(", ") ?? "");
  const [timeMinutes, setTimeMinutes] = useState(initialData?.timeMinutes ?? "");
  const [cuisine, setCuisine] = useState(initialData?.cuisine ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        type,
        status,
        tags: tags
          .split(",")
          .map((x) => x.trim().toLowerCase())
          .filter(Boolean),
        mainIngredients: mainIngredients
          ? mainIngredients
              .split(",")
              .map((x) => x.trim().toLowerCase())
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
    <main style={{ padding: 12, width: "100%", margin: "0 auto" }}>
      
      <div style={{ display: "flex", alignContent:"space-between", alignItems: "center" }}>
        <div>
        <Link href="/">
          <img src="../../left-arrow.png" className="left-arrow" />
        </Link><br/>
        </div>
        <div>

          {/* <h1 style={{ fontSize: 30 }}>New Entry</h1> */}
          <h1 style={{ fontSize: 30 }}>{mode === "new" ? "New entry" : "Edit entry"}</h1>
        </div>
      </div>

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

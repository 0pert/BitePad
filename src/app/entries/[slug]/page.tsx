import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadEntryBySlug } from "@/lib/content/loadEntries";
import "./markdown.css";
import { size } from "zod";
// import "../../globals.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await loadEntryBySlug(slug);

  if (!entry) notFound();
  // console.log(entry.body)

  return (
    <main style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href="/">
          <img src="../../left-arrow.png" className="left-arrow" />
        </Link>
        <div>
          <h1>{entry.title}</h1>
          <p>
            {entry.type} · {entry.status}
            {entry.timeMinutes ? ` · ${entry.timeMinutes} min` : ""}
          </p>

          {entry.tags.length > 0 && (
            <p>
              <b>Tags:</b> {entry.tags.join(", ")}
            </p>
          )}
          {entry.mainIngredients.length > 0 && (
            <p>
              <b>Main ingredients:</b> {entry.mainIngredients.join(", ")}
            </p>
          )}
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.body}</ReactMarkdown>
      </div>
    </main>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadEntryBySlug } from "@/lib/content/loadEntries";
import "./markdown.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  console.log(slug)
  const entry = await loadEntryBySlug(slug);

  if (!entry) notFound();
  console.log(entry)

  return (
    <main style={{ padding: 12, width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignContent:"space-between", alignItems: "center" }}>
        <div>
        <Link href="/">
          <img src="../../left-arrow.png" className="left-arrow" />
        </Link><br/>
        <Link href={`/entries/edit/${entry.slug}`}>
                <img src="edit.png" className="edit-icon" />
                </Link>
        </div>
        <div>

          <h1 style={{ fontSize: 30 }}>{entry.title}</h1>
        
          <p>
            {entry.type} · {entry.status}
            {entry.timeMinutes ? ` · ${entry.timeMinutes} min` : ""}
          </p>

          {entry.tags.length > 0 && (
            <p>
              <i>{entry.tags.join(" · ")}</i>
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

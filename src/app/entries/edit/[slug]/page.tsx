import { loadEntries } from "@/lib/content/loadEntries";
import EntryForm from "../../components/EntryForm";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditEntryPage({ params }: Props) {
  const { slug } = await params;

  const entries = await loadEntries();
  const entry = entries.find((e) => e.slug === slug);

  if (!entry) {
    notFound();
  }

  return <EntryForm mode="edit" initialData={entry} />;
}
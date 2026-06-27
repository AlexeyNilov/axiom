import Link from "next/link";
import { startStudySessionAction } from "./actions";
import { getApplication } from "../src/presentation/application";

const starterArtworkId = "kandinsky-composition-viii";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const app = getApplication();
  const artworks = await app.listArtworks();
  const sessions = await app.listStudySessions();
  const artwork = artworks.find((item) => item.id === starterArtworkId) ?? artworks[0];

  return (
    <div className="hero">
      {artwork ? (
        <section className="artwork-header">
          {artwork.imageUrl ? (
            <img
              className="artwork-image"
              src={artwork.imageUrl}
              alt={`${artwork.title} by ${artwork.artist ?? "unknown artist"}`}
            />
          ) : null}
          <div className="stack">
            <p className="kicker">Artwork study</p>
            <h1>{artwork.title}</h1>
            <p className="meta">
              {[artwork.artist, artwork.year, artwork.movement].filter(Boolean).join(" / ")}
            </p>
            <div className="actions">
              <form action={startStudySessionAction}>
                <input type="hidden" name="artworkId" value={artwork.id} />
                <button type="submit">Start study</button>
              </form>
              {artwork.sourceUrl ? (
                <a href={artwork.sourceUrl} rel="noreferrer" target="_blank">
                  Guggenheim record
                </a>
              ) : null}
              {artwork.imagePageUrl ? (
                <a href={artwork.imagePageUrl} rel="noreferrer" target="_blank">
                  Wikimedia file page
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="empty">No artwork has been seeded yet.</section>
      )}

      {sessions.length > 0 ? (
        <section className="section">
          <div className="section-header">
            <h2>Study Sessions</h2>
          </div>
          <div className="stack">
            {sessions.map((session) => (
              <Link className="item" href={`/studies/${session.id}`} key={session.id}>
                <strong>{session.artworkId}</strong>
                <p className="trace">
                  Started {formatDate(session.startedAt)}
                  {session.completedAt ? ` / Completed ${formatDate(session.completedAt)}` : ""}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

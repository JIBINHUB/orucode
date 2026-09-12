import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty" style={{ marginTop: 40 }}>
      <h1 className="h1">
        Lost in <span className="muted">space</span>
      </h1>
      <p className="lead">That design doesn’t exist (yet).</p>
      <Link href="/library" className="btn btn-primary">
        Back to library
      </Link>
    </div>
  );
}

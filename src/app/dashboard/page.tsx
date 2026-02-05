import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.email}</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Link href="/notes">
          <div style={cardStyle}>
            <h2>📝 Notes</h2>
            <p>Create, search, and edit your notes</p>
          </div>
        </Link>

        <Link href="/upload">
          <div style={cardStyle}>
            <h2>📁 File Upload</h2>
            <p>Upload and manage your files</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "1.5rem",
  width: "220px",
  cursor: "pointer",
};

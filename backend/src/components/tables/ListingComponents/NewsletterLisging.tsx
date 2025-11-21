import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <-- import navigate hook

interface Newsletter {
  _id: string;
  newsletter_code: string;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

const NewsletterListing: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Newsletter | null>(null);

  const navigate = useNavigate(); // <-- initialize navigate

  // Fetch newsletters on mount
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/newsletters");
        setNewsletters(res.data);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        alert("Failed to load newsletters");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}> Newsletter Listing</h2>

      {/* Add Newsletter Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/newsletter/add")}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          + Add Newsletter
        </button>
      </div>

      {loading ? (
        <p>Loading newsletters...</p>
      ) : newsletters.length === 0 ? (
        <p>No newsletters found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={thStyle}>Code</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.map((n) => (
              <tr key={n._id}>
                <td style={tdStyle}>{n.newsletter_code}</td>
                <td style={tdStyle}>{n.title}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(n.status)}>{n.status}</span>
                </td>
                <td style={tdStyle}>
                  {new Date(n.created_at).toLocaleDateString()}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => setSelected(n)}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal / Viewer */}
      {selected && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginTop: 0 }}>{selected.title}</h3>
            <p>
              <strong>Status:</strong>{" "}
              <span style={statusStyle(selected.status)}>{selected.status}</span>
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{ __html: selected.content }}
              style={{
                marginTop: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                background: "#fafafa",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: "20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styling Helpers ---
const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
};

const statusStyle = (status: string): React.CSSProperties => {
  const colors: Record<string, string> = {
    draft: "#6c757d",
    published: "#28a745",
    archived: "#dc3545",
  };
  return {
    color: "#fff",
    backgroundColor: colors[status] || "#6c757d",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "0.9em",
  };
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContent: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "800px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
};

export default NewsletterListing;

// NoticeBoard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./NoticeBoard.css";

export default function NoticeBoard({ user }) {
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (user) fetchNotices();
  }, [user]);

  const fetchNotices = async () => {
    const res = await axios.get("/api/notices");
    setNotices(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  return user ? (
    <div className={`noticeboard-panel ${open ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        {open ? "→" : "←"}
      </button>

      {open && (
        <div className="noticeboard-content">
          <h3>Notice Board</h3>
          <ul className="notice-list">
            {notices.map((n) => (
              <li key={n._id}>
                <strong>{n.title}</strong>
                <a href={n.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
              </li>
            ))}
          </ul>

          {isAdmin && (
            <>
              <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? "Close Form" : "Add Notice"}
              </button>
              {showAddForm && <AddNoticeForm onSuccess={fetchNotices} />}
            </>
          )}
        </div>
      )}
    </div>
  ) : null;
}

function AddNoticeForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("section", section);
    formData.append("file", file);
    await axios.post("/api/notices", formData);
    setTitle("");
    setSection("");
    setFile(null);
    onSuccess();
  };

  return (
    <form className="add-notice-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Notice Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={section} onChange={(e) => setSection(e.target.value)} required>
        <option value="">Select Section</option>
        <option value="Sports">Sports</option>
        <option value="Academics">Academics</option>
        <option value="General">General</option>
      </select>
      <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit">Upload Notice</button>
    </form>
  );
}

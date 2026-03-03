import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { Parser } from "json2csv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("bhaav_institute.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    price_paid INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS student_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    score INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS advertisements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT, -- 'image' or 'video'
    author TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS course_cache (
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (topic, difficulty)
  );

  CREATE TABLE IF NOT EXISTS shared_content (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/pricing", (req, res) => {
    try {
      const row = db.prepare("SELECT COUNT(*) as count FROM registrations").get() as { count: number };
      const count = row.count;
      const basePrice = 50000;
      const isDiscounted = count < 10;
      const finalPrice = isDiscounted ? basePrice * 0.5 : basePrice;
      
      res.json({
        basePrice,
        discount: isDiscounted ? 50 : 0,
        finalPrice,
        remainingDiscountSeats: Math.max(0, 10 - count)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { name, email, pricePaid } = req.body;
    if (!name || !email || !pricePaid) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    try {
      const info = db.prepare("INSERT INTO registrations (name, email, price_paid) VALUES (?, ?, ?)").run(name, email, pricePaid);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ success: false, error: "Email already registered" });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  });

  app.get("/api/performance/:email", (req, res) => {
    const { email } = req.params;
    try {
      const performance = db.prepare("SELECT * FROM student_performance WHERE email = ? ORDER BY timestamp DESC").all(email);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance" });
    }
  });

  app.get("/api/course-cache", (req, res) => {
    const { topic, difficulty } = req.query;
    try {
      const cached = db.prepare("SELECT content FROM course_cache WHERE topic = ? AND difficulty = ?").get(topic, difficulty);
      res.json(cached || null);
    } catch (error) {
      res.status(500).json({ error: "Cache fetch failed" });
    }
  });

  app.post("/api/course-cache", (req, res) => {
    const { topic, difficulty, content } = req.body;
    try {
      db.prepare("INSERT OR REPLACE INTO course_cache (topic, difficulty, content) VALUES (?, ?, ?)").run(topic, difficulty, JSON.stringify(content));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Cache save failed" });
    }
  });

  app.post("/api/performance", (req, res) => {
    const { email, topic, score, difficulty } = req.body;
    if (!email || !topic || score === undefined || !difficulty) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    try {
      db.prepare("INSERT INTO student_performance (email, topic, score, difficulty) VALUES (?, ?, ?, ?)").run(email, topic, score, difficulty);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- Advertisements ---
  app.get("/api/ads", (req, res) => {
    try {
      const ads = db.prepare("SELECT * FROM advertisements ORDER BY timestamp DESC").all();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  });

  app.post("/api/ads", (req, res) => {
    const { title, content, media_url, media_type, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: "Title, content and author are required" });
    }
    try {
      db.prepare("INSERT INTO advertisements (title, content, media_url, media_type, author) VALUES (?, ?, ?, ?, ?)").run(title, content, media_url, media_type, author);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to post advertisement" });
    }
  });

  // --- Admin ---
  app.get("/api/admin/users", (req, res) => {
    try {
      const users = db.prepare("SELECT * FROM registrations ORDER BY timestamp DESC").all();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/export-users", (req, res) => {
    try {
      const users = db.prepare("SELECT id, name, email, price_paid, timestamp FROM registrations").all();
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(users);
      
      res.header('Content-Type', 'text/csv');
      res.attachment('registered_users.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Export failed" });
    }
  });

  // --- Sharing ---
  app.post("/api/share", (req, res) => {
    const { type, content } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    try {
      db.prepare("INSERT INTO shared_content (id, type, content) VALUES (?, ?, ?)").run(id, type, JSON.stringify(content));
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: "Sharing failed" });
    }
  });

  app.get("/api/share/:id", (req, res) => {
    const { id } = req.params;
    try {
      const shared = db.prepare("SELECT * FROM shared_content WHERE id = ?").get(id) as any;
      if (shared) {
        res.json({ ...shared, content: JSON.parse(shared.content) });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Fetch failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

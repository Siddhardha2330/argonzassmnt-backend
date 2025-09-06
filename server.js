const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://22pa1a1275:Thor2330111@cluster.tjefsrm.mongodb.net/task_management_db?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    // Don't specify database name here since it's already in the URI
    db = client.db();
    console.log('API connected to MongoDB Atlas');
  }
}

// Health
app.get('/api/health', async (req, res) => {
  try {
    await connect();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    await connect();
    const categories = await db.collection('categories').find({}).toArray();
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// All auth endpoints removed to make app public

// Mentors
app.get('/api/mentors', async (req, res) => {
  try {
    await connect();
    const { q, profession } = req.query;
    const filter = {};
    if (profession) filter.profession = profession;
    if (q) filter.$or = [
      { profession: { $regex: String(q), $options: 'i' } },
      { specialization: { $regex: String(q), $options: 'i' } },
      { bio: { $regex: String(q), $options: 'i' } }
    ];
    const mentors = await db.collection('mentorProfiles')
      .find(filter)
      .sort({ average_rating: -1, total_followers: -1 })
      .toArray();
    res.json(mentors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Follow mentor (simple counter inc)
app.post('/api/mentors/:id/follow', async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    await db.collection('mentorProfiles').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { total_followers: 1 } }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Tasks list
app.get('/api/tasks', async (req, res) => {
  try {
    await connect();
    const { q, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$or = [
      { title: { $regex: String(q), $options: 'i' } },
      { description: { $regex: String(q), $options: 'i' } }
    ];
    const tasks = await db.collection('tasks')
      .find(filter)
      .sort({ updated_at: -1 })
      .toArray();
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update task progress
app.patch('/api/tasks/:id/progress', async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const { progress } = req.body;
    await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: { progress: Number(progress), updated_at: new Date() } }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create task (public)
app.post('/api/tasks', async (req, res) => {
  try {
    await connect();
    const {
      title,
      description,
      category,
      priority,
      deadline,
      tags
    } = req.body || {};
    if (!title || !description) return res.status(400).json({ error: 'Missing title/description' });
    const now = new Date();
    const doc = {
      title: String(title),
      description: String(description),
      category: category || '',
      status: 'in_progress',
      priority: priority || 'medium',
      progress: 0,
      deadline: deadline ? new Date(deadline) : null,
      estimated_time: { hours: 0, minutes: 0 },
      actual_time_spent: { hours: 0, minutes: 0 },
      assigned_to: [],
      assigned_by: null,
      mentor_id: null,
      mentor_assigned_at: null,
      mentor_completion_date: null,
      mentor_rating: null,
      mentor_review: null,
      tags: Array.isArray(tags) ? tags : [],
      attachments: [],
      comments: [],
      created_at: now,
      updated_at: now
    };
    const result = await db.collection('tasks').insertOne(doc);
    res.json({ ok: true, _id: String(result.insertedId) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create mentor (public)
app.post('/api/mentors', async (req, res) => {
  try {
    await connect();
    const {
      profession,
      specialization,
      bio,
      company,
      position,
      location,
      hourly_rate,
      currency,
      availability_status
    } = req.body || {};
    if (!profession) return res.status(400).json({ error: 'Missing profession' });
    const now = new Date();
    const doc = {
      user_id: null,
      profession: profession || '',
      specialization: specialization || '',
      bio: bio || '',
      company: company || '',
      position: position || '',
      location: location || '',
      hourly_rate: Number(hourly_rate) || 0,
      currency: currency || 'USD',
      availability_status: availability_status || 'available',
      total_tasks_completed: 0,
      total_reviews: 0,
      average_rating: 0,
      total_followers: 0,
      is_featured: false,
      is_verified: false,
      created_at: now,
      updated_at: now
    };
    const result = await db.collection('mentorProfiles').insertOne(doc);
    res.json({ ok: true, _id: String(result.insertedId) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API server running on http://localhost:${port}`));


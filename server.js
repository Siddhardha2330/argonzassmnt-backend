const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Multiple MongoDB connection strategies for Render compatibility
const baseUri = "mongodb+srv://22pa1a1275:Thor2330111@cluster.tjefsrm.mongodb.net";
const uri = process.env.MONGODB_URI || `${baseUri}/task_management_db?retryWrites=true&w=majority&ssl=true&authSource=admin`;
const connectionStrings = [
  `${baseUri}/task_management_db?retryWrites=true&w=majority&ssl=true&authSource=admin`,
  `${baseUri}/task_management_db?retryWrites=true&w=majority&ssl=true`,
  `${baseUri}/task_management_db?retryWrites=true&w=majority`,
  `${baseUri}/task_management_db?ssl=true&authSource=admin`,
  `${baseUri}/task_management_db?ssl=true`,
  `${baseUri}/task_management_db`,
  `${baseUri}?retryWrites=true&w=majority&ssl=true&authSource=admin`,
  `${baseUri}?retryWrites=true&w=majority&ssl=true`,
  `${baseUri}?retryWrites=true&w=majority`
];

const connectionOptions = [
  // Strategy 1: Minimal options
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000
  },
  // Strategy 2: With SSL bypass
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
  },
  // Strategy 3: With direct connection
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    directConnection: true
  },
  // Strategy 4: With SSL bypass and direct connection
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    directConnection: true
  },
  // Strategy 5: Aggressive SSL bypass
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    tlsInsecure: true
  },
  // Strategy 6: No SSL validation at all
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    tls: false
  }
];

let client = null;
let db = null;

async function connect() {
  if (!db) {
    let lastError;
    
    console.log('🔄 Attempting MongoDB connection with multiple strategies...');
    
    for (let uriIndex = 0; uriIndex < connectionStrings.length; uriIndex++) {
      for (let optionsIndex = 0; optionsIndex < connectionOptions.length; optionsIndex++) {
        try {
          const uri = connectionStrings[uriIndex];
          const options = connectionOptions[optionsIndex];
          
          console.log(`🔄 Attempting connection strategy ${uriIndex + 1}.${optionsIndex + 1}...`);
          console.log(`URI: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
          console.log(`Options: ${JSON.stringify(options, null, 2)}`);
          
          // Close existing client if any
          if (client) {
            try {
              await client.close();
            } catch (e) {
              // Ignore close errors
            }
          }
          
          client = new MongoClient(uri, options);
          await client.connect();
          db = client.db();
          
          // Test the connection
          await db.admin().ping();
          
          console.log(`✅ Successfully connected to MongoDB Atlas with strategy ${uriIndex + 1}.${optionsIndex + 1}`);
          console.log('✅ MongoDB connection verified');
          return;
          
        } catch (error) {
          lastError = error;
          console.error(`❌ Strategy ${uriIndex + 1}.${optionsIndex + 1} failed:`, error.message);
          
          // Clean up failed connection
          if (client) {
            try {
              await client.close();
            } catch (e) {
              // Ignore close errors
            }
            client = null;
            db = null;
          }
        }
      }
    }
    
    console.error('❌ All MongoDB connection strategies failed');
    console.error('Last error:', lastError?.message);
    throw lastError || new Error('All connection strategies failed');
  }
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: "Argonz Backend API", 
    version: "1.0.0",
    endpoints: [
      "GET /api/health",
      "GET /api/categories", 
      "GET /api/mentors",
      "GET /api/tasks"
    ]
  });
});

// Health
app.get('/api/health', async (req, res) => {
  try {
    await connect();
    res.json({ 
      ok: true, 
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    });
  } catch (e) {
    console.error('Health check failed:', e);
    // Return partial health status even if DB is down
    res.status(200).json({ 
      ok: true, 
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: e.message,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    await connect();
    const categories = await db.collection('categories').find({}).toArray();
    res.json(categories);
  } catch (e) {
    console.error('Categories endpoint failed:', e.message);
    // Fallback mock data
    const mockCategories = [
      { _id: "mock1", name: "UI UX Design", description: "User interface and user experience design", color: "#3B82F6", icon: "design", is_active: true },
      { _id: "mock2", name: "Web Developer", description: "Web development and programming", color: "#10B981", icon: "code", is_active: true },
      { _id: "mock3", name: "Android Developer", description: "Android mobile application development", color: "#F59E0B", icon: "mobile", is_active: true }
    ];
    res.json(mockCategories);
  }
});

// All auth endpoints removed to make app public

// Mentors
app.get('/api/mentors', async (req, res) => {
  try {
    console.log('📋 Mentors GET request received');
    await connect();
    console.log('📋 Database connected successfully');
    
    const { q, profession } = req.query;
    const filter = {};
    if (profession) filter.profession = profession;
    if (q) filter.$or = [
      { profession: { $regex: String(q), $options: 'i' } },
      { specialization: { $regex: String(q), $options: 'i' } },
      { bio: { $regex: String(q), $options: 'i' } }
    ];
    
    console.log('📋 Querying mentors with filter:', filter);
    const mentors = await db.collection('mentorProfiles')
      .find(filter)
      .sort({ average_rating: -1, total_followers: -1 })
      .toArray();
    
    console.log(`📋 Found ${mentors.length} mentors`);
    res.json(mentors);
  } catch (e) {
    console.error('❌ Mentors endpoint failed:', e.message);
    console.error('❌ Full error:', e);
    // Fallback mock data
    const mockMentors = [
      {
        _id: "mock1",
        profession: "Web Developer",
        specialization: "Full-Stack Development",
        bio: "Hi, I'm Jessica Jane. I am a doctoral student at Harvard University majoring in Web Development with 5 years of industry experience.",
        company: "Harvard University",
        position: "Doctoral Student",
        location: "Cambridge, MA",
        hourly_rate: 75,
        currency: "USD",
        availability_status: "available",
        total_tasks_completed: 40,
        total_reviews: 750,
        average_rating: 4.7,
        total_followers: 1250,
        is_featured: true,
        is_verified: true
      },
      {
        _id: "mock2",
        profession: "UI / UX Designer",
        specialization: "User Experience Design",
        bio: "Hi, I'm Alex Stanton. I am a doctoral student at Oxford University majoring in UI / UX Design with expertise in user research and prototyping.",
        company: "Oxford University",
        position: "Doctoral Student",
        location: "Oxford, UK",
        hourly_rate: 80,
        currency: "GBP",
        availability_status: "available",
        total_tasks_completed: 60,
        total_reviews: 970,
        average_rating: 4.9,
        total_followers: 2100,
        is_featured: true,
        is_verified: true
      }
    ];
    res.json(mockMentors);
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
    console.error('Tasks endpoint failed:', e.message);
    // Fallback mock data
    const mockTasks = [
      {
        _id: "mock1",
        title: "Creating Mobile App Design",
        description: "Design a modern mobile application interface with focus on user experience",
        category: "UI UX Design",
        status: "in_progress",
        priority: "high",
        progress: 75,
        deadline: new Date("2024-02-15"),
        created_at: new Date("2024-01-15"),
        updated_at: new Date("2024-01-20")
      },
      {
        _id: "mock2",
        title: "Creating Perfect Website",
        description: "Develop a responsive website with modern design principles",
        category: "Web Developer",
        status: "in_progress",
        priority: "medium",
        progress: 85,
        deadline: new Date("2024-02-20"),
        created_at: new Date("2024-01-10"),
        updated_at: new Date("2024-01-20")
      }
    ];
    res.json(mockTasks);
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

// Update task (public)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const {
      title,
      description,
      category,
      priority,
      deadline,
      tags
    } = req.body || {};
    
    if (!title || !description) return res.status(400).json({ error: 'Missing title/description' });
    
    const updateDoc = {
      title: String(title),
      description: String(description),
      category: category || '',
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : null,
      tags: Array.isArray(tags) ? tags : [],
      updated_at: new Date()
    };
    
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ ok: true, _id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete task (public)
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    
    const result = await db.collection('tasks').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ ok: true, _id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create mentor (public)
app.post('/api/mentors', async (req, res) => {
  try {
    console.log('👥 Mentors POST request received');
    console.log('👥 Request body:', req.body);
    
    await connect();
    console.log('👥 Database connected successfully');
    
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
    
    console.log('👥 Extracted data:', { profession, specialization, bio });
    
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
    
    console.log('👥 Document to insert:', doc);
    
    const result = await db.collection('mentorProfiles').insertOne(doc);
    console.log('👥 Insert result:', result);
    
    res.json({ ok: true, _id: String(result.insertedId) });
  } catch (e) {
    console.error('❌ Mentors POST failed:', e.message);
    console.error('❌ Full error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Update mentor (public)
app.put('/api/mentors/:id', async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
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
    
    const updateDoc = {
      profession: profession || '',
      specialization: specialization || '',
      bio: bio || '',
      company: company || '',
      position: position || '',
      location: location || '',
      hourly_rate: Number(hourly_rate) || 0,
      currency: currency || 'USD',
      availability_status: availability_status || 'available',
      updated_at: new Date()
    };
    
    const result = await db.collection('mentorProfiles').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    res.json({ ok: true, _id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete mentor (public)
app.delete('/api/mentors/:id', async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    
    const result = await db.collection('mentorProfiles').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    res.json({ ok: true, _id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI configured: ${uri ? 'Yes' : 'No'}`);
});


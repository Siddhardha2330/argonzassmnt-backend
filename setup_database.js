// MongoDB Database Setup Script for Task Management & Mentor System
// Run this script to set up the database structure

// Connect to MongoDB (adjust connection string as needed)
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://22pa1a1275:Thor2330111@cluster.tjefsrm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function setupDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("task_management_db");
    
    // Create collections
    console.log("Creating collections...");
    
    // Users collection
    await db.createCollection("users");
    console.log("✓ Users collection created");
    
    // Tasks collection
    await db.createCollection("tasks");
    console.log("✓ Tasks collection created");
    
    // Categories collection
    await db.createCollection("categories");
    console.log("✓ Categories collection created");
    
    // Projects collection
    await db.createCollection("projects");
    console.log("✓ Projects collection created");
    
    // Messages collection
    await db.createCollection("messages");
    console.log("✓ Messages collection created");
    
    // Conversations collection
    await db.createCollection("conversations");
    console.log("✓ Conversations collection created");
    
    // Notifications collection
    await db.createCollection("notifications");
    console.log("✓ Notifications collection created");
    
    // TimeTracking collection
    await db.createCollection("timeTracking");
    console.log("✓ TimeTracking collection created");
    
    // HelpCenter collection
    await db.createCollection("helpCenter");
    console.log("✓ HelpCenter collection created");

    // New Mentor System Collections
    await db.createCollection("mentorProfiles");
    console.log("✓ MentorProfiles collection created");
    
    await db.createCollection("mentorCategories");
    console.log("✓ MentorCategories collection created");
    
    await db.createCollection("mentorFollowers");
    console.log("✓ MentorFollowers collection created");
    
    await db.createCollection("mentorReviews");
    console.log("✓ MentorReviews collection created");
    
    await db.createCollection("mentorSessions");
    console.log("✓ MentorSessions collection created");

    // Create indexes
    console.log("\nCreating indexes...");
    
    // Users indexes
    await db.collection("users").createIndex({ "email": 1 }, { unique: true });
    await db.collection("users").createIndex({ "username": 1 }, { unique: true });
    await db.collection("users").createIndex({ "role": 1 });
    await db.collection("users").createIndex({ "expertise_areas": 1 });
    console.log("✓ Users indexes created");
    
    // Tasks indexes
    await db.collection("tasks").createIndex({ "assigned_to": 1 });
    await db.collection("tasks").createIndex({ "category": 1 });
    await db.collection("tasks").createIndex({ "status": 1 });
    await db.collection("tasks").createIndex({ "deadline": 1 });
    await db.collection("tasks").createIndex({ "assigned_by": 1 });
    await db.collection("tasks").createIndex({ "mentor_id": 1 });
    await db.collection("tasks").createIndex({ "created_at": 1 });
    await db.collection("tasks").createIndex({ "mentor_assigned_at": 1 });
    console.log("✓ Tasks indexes created");
    
    // Messages indexes
    await db.collection("messages").createIndex({ "sender_id": 1 });
    await db.collection("messages").createIndex({ "receiver_id": 1 });
    await db.collection("messages").createIndex({ "conversation_id": 1 });
    await db.collection("messages").createIndex({ "timestamp": 1 });
    console.log("✓ Messages indexes created");
    
    // Notifications indexes
    await db.collection("notifications").createIndex({ "user_id": 1 });
    await db.collection("notifications").createIndex({ "read_status": 1 });
    await db.collection("notifications").createIndex({ "created_at": 1 });
    console.log("✓ Notifications indexes created");
    
    // Categories indexes
    await db.collection("categories").createIndex({ "name": 1 }, { unique: true });
    console.log("✓ Categories indexes created");
    
    // Projects indexes
    await db.collection("projects").createIndex({ "status": 1 });
    await db.collection("projects").createIndex({ "team_members": 1 });
    console.log("✓ Projects indexes created");

    // Mentor System indexes
    await db.collection("mentorProfiles").createIndex({ "user_id": 1 }, { unique: true });
    await db.collection("mentorProfiles").createIndex({ "profession": 1 });
    await db.collection("mentorProfiles").createIndex({ "company": 1 });
    await db.collection("mentorProfiles").createIndex({ "average_rating": -1 });
    await db.collection("mentorProfiles").createIndex({ "total_followers": -1 });
    await db.collection("mentorProfiles").createIndex({ "is_featured": 1 });
    await db.collection("mentorProfiles").createIndex({ "availability_status": 1 });
    console.log("✓ MentorProfiles indexes created");

    await db.collection("mentorCategories").createIndex({ "name": 1 }, { unique: true });
    await db.collection("mentorCategories").createIndex({ "is_active": 1 });
    console.log("✓ MentorCategories indexes created");

    await db.collection("mentorFollowers").createIndex({ "mentor_id": 1 });
    await db.collection("mentorFollowers").createIndex({ "follower_id": 1 });
    await db.collection("mentorFollowers").createIndex({ "mentor_id": 1, "follower_id": 1 }, { unique: true });
    console.log("✓ MentorFollowers indexes created");

    await db.collection("mentorReviews").createIndex({ "mentor_id": 1 });
    await db.collection("mentorReviews").createIndex({ "reviewer_id": 1 });
    await db.collection("mentorReviews").createIndex({ "rating": 1 });
    await db.collection("mentorReviews").createIndex({ "created_at": -1 });
    console.log("✓ MentorReviews indexes created");

    await db.collection("mentorSessions").createIndex({ "mentor_id": 1 });
    await db.collection("mentorSessions").createIndex({ "student_id": 1 });
    await db.collection("mentorSessions").createIndex({ "task_id": 1 });
    await db.collection("mentorSessions").createIndex({ "status": 1 });
    await db.collection("mentorSessions").createIndex({ "scheduled_at": 1 });
    console.log("✓ MentorSessions indexes created");

    // Insert sample data
    console.log("\nInserting sample data...");
    
    // Sample categories (enhanced for both tasks and mentors)
    const categories = [
      {
        name: "UI UX Design",
        description: "User interface and user experience design tasks and mentors",
        color: "#3B82F6",
        icon: "design",
        is_active: true,
        type: "both",
        mentor_count: 15,
        task_count: 45,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Web Developer",
        description: "Web development and programming tasks and mentors",
        color: "#10B981",
        icon: "code",
        is_active: true,
        type: "both",
        mentor_count: 25,
        task_count: 78,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Android Developer",
        description: "Android mobile application development tasks and mentors",
        color: "#F59E0B",
        icon: "mobile",
        is_active: true,
        type: "both",
        mentor_count: 12,
        task_count: 32,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Mobile App",
        description: "Mobile application development and design tasks and mentors",
        color: "#8B5CF6",
        icon: "smartphone",
        is_active: true,
        type: "both",
        mentor_count: 18,
        task_count: 56,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "3D Design",
        description: "3D modeling and design tasks and mentors",
        color: "#EC4899",
        icon: "3d",
        is_active: true,
        type: "both",
        mentor_count: 8,
        task_count: 24,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "2D Design",
        description: "2D graphic design and illustration tasks and mentors",
        color: "#06B6D4",
        icon: "2d",
        is_active: true,
        type: "both",
        mentor_count: 10,
        task_count: 28,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "IOS Developer",
        description: "iOS mobile application development tasks and mentors",
        color: "#84CC16",
        icon: "ios",
        is_active: true,
        type: "both",
        mentor_count: 14,
        task_count: 38,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await db.collection("categories").insertMany(categories);
    console.log("✓ Sample categories inserted");
    
    // Sample users (enhanced with mentor profiles)
    const users = [
      {
        username: "22pa1a1275",
        email: "22pa1a1275@vishnu.edu.in",
        password_hash: "$2b$10$hashed_password_here", // Replace with actual hash
        first_name: "Admin",
        last_name: "User",
        profile_picture_url: "https://example.com/admin.jpg",
        role: "admin",
        expertise_areas: [],
        bio: "System administrator",
        contact_info: {
          phone: "+1234567890",
          location: "New York, NY",
          website: ""
        },
        settings: {
          theme: "light",
          notifications_enabled: true,
          language: "en",
          timezone: "America/New_York"
        },
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2024-01-20")
      },
      {
        username: "jessica_jane",
        email: "jessica.jane@harvard.edu",
        password_hash: "$2b$10$hashed_password_here",
        first_name: "Jessica",
        last_name: "Jane",
        profile_picture_url: "https://example.com/jessica.jpg",
        role: "mentor",
        expertise_areas: ["Web Development", "Full-Stack", "JavaScript", "React"],
        bio: "Doctoral student at Harvard University with 5 years of industry experience",
        contact_info: {
          phone: "+1234567891",
          location: "Cambridge, MA",
          website: "https://jessicajane.dev"
        },
        settings: {
          theme: "light",
          notifications_enabled: true,
          language: "en",
          timezone: "America/New_York"
        },
        mentor_profile: {
          is_verified: true,
          hourly_rate: 75,
          availability: [
            { day: "Monday", start_time: "09:00", end_time: "17:00" },
            { day: "Wednesday", start_time: "14:00", end_time: "18:00" },
            { day: "Friday", start_time: "10:00", end_time: "16:00" }
          ],
          languages: ["English", "Spanish"],
          education: [
            {
              institution: "Harvard University",
              degree: "Ph.D.",
              field: "Computer Science",
              year: 2024
            }
          ],
          experience: [
            {
              company: "Google",
              position: "Software Engineer",
              duration: "3 years",
              description: "Full-stack development with React and Node.js"
            }
          ],
          certifications: []
        },
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2024-01-20")
      },
      {
        username: "alex_stanton",
        email: "alex.stanton@oxford.edu",
        password_hash: "$2b$10$hashed_password_here",
        first_name: "Alex",
        last_name: "Stanton",
        profile_picture_url: "https://example.com/alex.jpg",
        role: "mentor",
        expertise_areas: ["UI/UX Design", "User Research", "Prototyping", "Figma"],
        bio: "Doctoral student at Oxford University specializing in user experience design",
        contact_info: {
          phone: "+1234567892",
          location: "Oxford, UK",
          website: "https://alexstanton.design"
        },
        settings: {
          theme: "dark",
          notifications_enabled: true,
          language: "en",
          timezone: "Europe/London"
        },
        mentor_profile: {
          is_verified: true,
          hourly_rate: 80,
          availability: [
            { day: "Tuesday", start_time: "10:00", end_time: "18:00" },
            { day: "Thursday", start_time: "09:00", end_time: "17:00" }
          ],
          languages: ["English", "French"],
          education: [
            {
              institution: "Oxford University",
              degree: "Ph.D.",
              field: "Design Studies",
              year: 2024
            }
          ],
          experience: [
            {
              company: "Apple",
              position: "UX Designer",
              duration: "4 years",
              description: "Designing user experiences for iOS applications"
            }
          ],
          certifications: []
        },
        created_at: new Date("2023-02-01"),
        updated_at: new Date("2024-01-20")
      }
    ];
    
    await db.collection("users").insertMany(users);
    console.log("✓ Sample users inserted");
    
    // Sample mentor profiles
    const mentorProfiles = [
      {
        user_id: users[1]._id, // Jessica Jane
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
        is_verified: true,
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2024-01-20")
      },
      {
        user_id: users[2]._id, // Alex Stanton
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
        is_verified: true,
        created_at: new Date("2023-02-01"),
        updated_at: new Date("2024-01-20")
      }
    ];
    
    await db.collection("mentorProfiles").insertMany(mentorProfiles);
    console.log("✓ Sample mentor profiles inserted");
    
    // Sample mentor categories
    const mentorCategories = [
      {
        name: "Web Developer",
        description: "Web development and programming mentors",
        color: "#10B981",
        icon: "code",
        is_active: true,
        mentor_count: 25,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "UI / UX Designer",
        description: "User interface and user experience design mentors",
        color: "#3B82F6",
        icon: "design",
        is_active: true,
        mentor_count: 18,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Android Developer",
        description: "Android mobile application development mentors",
        color: "#F59E0B",
        icon: "mobile",
        is_active: true,
        mentor_count: 12,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "3D Design",
        description: "3D modeling and design mentors",
        color: "#EC4899",
        icon: "3d",
        is_active: true,
        mentor_count: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "2D Design",
        description: "2D graphic design and illustration mentors",
        color: "#06B6D4",
        icon: "2d",
        is_active: true,
        mentor_count: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "IOS Developer",
        description: "iOS mobile application development mentors",
        color: "#84CC16",
        icon: "ios",
        is_active: true,
        mentor_count: 14,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await db.collection("mentorCategories").insertMany(mentorCategories);
    console.log("✓ Sample mentor categories inserted");
    
    // Sample mentor reviews
    const mentorReviews = [
      {
        mentor_id: users[1]._id, // Jessica Jane
        reviewer_id: users[0]._id, // Admin (for demo)
        task_id: null,
        rating: 5,
        review_text: "Excellent guidance on web development concepts. Very patient and explains complex topics clearly.",
        review_type: "general_review",
        is_verified: false,
        helpful_votes: 15,
        created_at: new Date("2024-01-10")
      },
      {
        mentor_id: users[2]._id, // Alex Stanton
        reviewer_id: users[0]._id, // Admin (for demo)
        task_id: null,
        rating: 5,
        review_text: "Outstanding UI/UX design mentor. Provides practical insights and industry best practices.",
        review_type: "general_review",
        is_verified: false,
        helpful_votes: 23,
        created_at: new Date("2024-01-12")
      }
    ];
    
    await db.collection("mentorReviews").insertMany(mentorReviews);
    console.log("✓ Sample mentor reviews inserted");
    
    // Sample tasks (enhanced with mentor assignments)
    const tasks = [
      {
        title: "Creating Mobile App Design",
        description: "Design a modern mobile application interface with focus on user experience",
        category: "UI UX Design",
        status: "in_progress",
        priority: "high",
        progress: 75,
        deadline: new Date("2024-02-15"),
        estimated_time: {
          hours: 8,
          minutes: 0
        },
        actual_time_spent: {
          hours: 6,
          minutes: 0
        },
        assigned_to: [],
        assigned_by: users[0]._id, // Admin
        mentor_id: users[2]._id, // Alex Stanton (UI/UX Designer)
        mentor_assigned_at: new Date("2024-01-15"),
        mentor_completion_date: null,
        mentor_rating: null,
        mentor_review: null,
        tags: ["mobile", "design", "ui", "ux"],
        attachments: [],
        comments: [],
        created_at: new Date("2024-01-15"),
        updated_at: new Date("2024-01-20")
      },
      {
        title: "Creating Perfect Website",
        description: "Develop a responsive website with modern design principles",
        category: "Web Developer",
        status: "in_progress",
        priority: "medium",
        progress: 85,
        deadline: new Date("2024-02-20"),
        estimated_time: {
          hours: 12,
          minutes: 0
        },
        actual_time_spent: {
          hours: 10,
          minutes: 30
        },
        assigned_to: [],
        assigned_by: users[0]._id, // Admin
        mentor_id: users[1]._id, // Jessica Jane (Web Developer)
        mentor_assigned_at: new Date("2024-01-10"),
        mentor_completion_date: null,
        mentor_rating: null,
        mentor_review: null,
        tags: ["website", "development", "responsive"],
        attachments: [],
        comments: [],
        created_at: new Date("2024-01-10"),
        updated_at: new Date("2024-01-20")
      }
    ];
    
    await db.collection("tasks").insertMany(tasks);
    console.log("✓ Sample tasks inserted");

    console.log("\n✅ Database setup completed successfully!");
    console.log("Database: task_management_db");
    console.log("Collections: 14");
    console.log("Indexes: 30+");
    console.log("Sample data: Categories, Users, Mentor Profiles, Mentor Categories, Mentor Reviews, Tasks");

  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

// Run the setup
setupDatabase().catch(console.error);

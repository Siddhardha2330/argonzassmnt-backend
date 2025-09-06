// Test script to verify database setup
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://22pa1a1275:Thor2330111@cluster.tjefsrm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function testDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    
    const db = client.db("task_management_db");
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📚 Collections created: ${collections.length}`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Test mentor profiles
    const mentorProfiles = await db.collection("mentorProfiles").find().toArray();
    console.log(`\n👨‍🏫 Mentor Profiles: ${mentorProfiles.length}`);
    mentorProfiles.forEach(profile => {
      console.log(`  - ${profile.profession}: ${profile.bio.substring(0, 50)}...`);
      console.log(`    Rating: ${profile.average_rating} (${profile.total_reviews} reviews)`);
    });
    
    // Test categories
    const categories = await db.collection("categories").find().toArray();
    console.log(`\n🏷️  Categories: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.mentor_count} mentors, ${cat.task_count} tasks`);
    });
    
    // Test tasks
    const tasks = await db.collection("tasks").find().toArray();
    console.log(`\n📋 Tasks: ${tasks.length}`);
    tasks.forEach(task => {
      console.log(`  - ${task.title}: ${task.progress}% progress`);
      console.log(`    Category: ${task.category}, Mentor assigned: ${task.mentor_id ? 'Yes' : 'No'}`);
    });
    
    // Test users
    const users = await db.collection("users").find().toArray();
    console.log(`\n👥 Users: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.role})`);
      if (user.role === 'mentor') {
        console.log(`    Expertise: ${user.expertise_areas.join(', ')}`);
      }
    });
    
    console.log("\n🎉 Database test completed successfully!");
    
  } catch (error) {
    console.error("❌ Error testing database:", error);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

testDatabase().catch(console.error);

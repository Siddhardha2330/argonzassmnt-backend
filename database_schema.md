# MongoDB Database Schema for Task Management & Mentor System

## Database: `task_management_db`

### 1. Users Collection (Enhanced)
```javascript
{
  _id: ObjectId,
  username: String, // unique
  email: String, // unique
  password_hash: String,
  first_name: String,
  last_name: String,
  profile_picture_url: String,
  role: {
    type: String,
    enum: ["student", "mentor", "admin", "developer", "designer"],
    default: "student"
  },
  expertise_areas: [String], // for mentors/developers
  bio: String, // for mentors
  contact_info: {
    phone: String,
    location: String,
    website: String
  },
  settings: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light"
    },
    notifications_enabled: Boolean,
    language: String,
    timezone: String
  },
  // Mentor-specific fields
  mentor_profile: {
    is_verified: Boolean,
    hourly_rate: Number,
    availability: [{
      day: String,
      start_time: String,
      end_time: String
    }],
    languages: [String],
    education: [{
      institution: String,
      degree: String,
      field: String,
      year: Number
    }],
    experience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      year: Number,
      expiry_date: Date
    }]
  },
  created_at: Date,
  updated_at: Date,
  last_login: Date
}
```

### 2. MentorProfiles Collection (New)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId, // reference to users collection
  profession: String, // e.g., "Web Developer", "UI/UX Designer", "Android Developer"
  specialization: String, // specific area within profession
  bio: String, // "Hi, I'm [Name]. I am a doctoral student at Harvard University..."
  company: String, // e.g., "Google", "Apple", "Blender"
  position: String, // e.g., "Senior Manager", "Professional Designer"
  location: String,
  hourly_rate: Number,
  currency: String,
  availability_status: {
    type: String,
    enum: ["available", "busy", "unavailable"],
    default: "available"
  },
  total_tasks_completed: Number,
  total_reviews: Number,
  average_rating: Number,
  total_followers: Number,
  is_featured: Boolean,
  is_verified: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### 3. MentorCategories Collection (New)
```javascript
{
  _id: ObjectId,
  name: String, // unique, e.g., "Web Developer", "UI/UX Designer", "Android Developer"
  description: String,
  color: String, // hex color code
  icon: String, // icon identifier
  is_active: Boolean,
  mentor_count: Number, // number of mentors in this category
  created_at: Date,
  updated_at: Date
}
```

### 4. MentorFollowers Collection (New)
```javascript
{
  _id: ObjectId,
  mentor_id: ObjectId, // reference to users collection (mentor)
  follower_id: ObjectId, // reference to users collection (student)
  followed_at: Date,
  is_active: Boolean
}
```

### 5. MentorReviews Collection (New)
```javascript
{
  _id: ObjectId,
  mentor_id: ObjectId, // reference to users collection (mentor)
  reviewer_id: ObjectId, // reference to users collection (student)
  task_id: ObjectId, // reference to tasks collection (optional)
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review_text: String,
  review_type: {
    type: String,
    enum: ["task_review", "general_review"],
    default: "general_review"
  },
  is_verified: Boolean, // review from actual task completion
  helpful_votes: Number,
  created_at: Date,
  updated_at: Date
}
```

### 6. Tasks Collection (Enhanced)
```javascript
{
  _id: ObjectId,
  title: String, // required
  description: String,
  category: {
    type: String,
    enum: ["UI UX Design", "Web Developer", "Android Developer", "Mobile App", "General"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "overdue", "cancelled"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  deadline: Date, // required for sorting
  estimated_time: {
    hours: Number,
    minutes: Number
  },
  actual_time_spent: {
    hours: Number,
    minutes: Number
  },
  assigned_to: [ObjectId], // array of user IDs
  assigned_by: ObjectId, // reference to users collection
  mentor_id: ObjectId, // reference to users collection (if applicable)
  mentor_assigned_at: Date,
  mentor_completion_date: Date,
  mentor_rating: Number, // rating given to mentor for this task
  mentor_review: String, // review text for mentor
  tags: [String],
  attachments: [{
    filename: String,
    url: String,
    file_type: String,
    uploaded_at: Date
  }],
  comments: [{
    user_id: ObjectId,
    content: String,
    timestamp: Date,
    edited: Boolean
  }],
  created_at: Date,
  updated_at: Date,
  completed_at: Date
}
```

### 7. Categories Collection (Enhanced)
```javascript
{
  _id: ObjectId,
  name: String, // unique
  description: String,
  color: String, // hex color code
  icon: String, // icon identifier
  is_active: Boolean,
  type: {
    type: String,
    enum: ["task", "mentor", "both"],
    default: "both"
  },
  mentor_count: Number, // number of mentors in this category
  task_count: Number, // number of tasks in this category
  created_at: Date,
  updated_at: Date
}
```

### 8. Projects Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: ObjectId, // reference to categories collection
  status: {
    type: String,
    enum: ["planning", "active", "on_hold", "completed", "cancelled"],
    default: "planning"
  },
  start_date: Date,
  end_date: Date,
  tasks: [ObjectId], // array of task IDs
  team_members: [ObjectId], // array of user IDs
  project_manager: ObjectId, // reference to users collection
  mentor_lead: ObjectId, // reference to users collection (mentor)
  budget: {
    estimated: Number,
    actual: Number,
    currency: String
  },
  created_at: Date,
  updated_at: Date
}
```

### 9. Messages Collection
```javascript
{
  _id: ObjectId,
  sender_id: ObjectId, // reference to users collection
  receiver_id: ObjectId, // reference to users collection
  content: String,
  message_type: {
    type: String,
    enum: ["text", "file", "image", "system", "mentor_request"],
    default: "text"
  },
  attachments: [{
    filename: String,
    url: String,
    file_type: String
  }],
  conversation_id: ObjectId, // to group messages
  related_task_id: ObjectId, // optional, if message is about a task
  related_mentor_id: ObjectId, // optional, if message is about mentor consultation
  read_status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread"
  },
  timestamp: Date,
  edited: Boolean,
  deleted: Boolean
}
```

### 10. Conversations Collection
```javascript
{
  _id: ObjectId,
  participants: [ObjectId], // array of user IDs
  conversation_type: {
    type: String,
    enum: ["direct", "group", "task_related", "mentor_consultation"],
    default: "direct"
  },
  title: String, // for group conversations
  last_message: {
    content: String,
    sender_id: ObjectId,
    timestamp: Date
  },
  created_at: Date,
  updated_at: Date
}
```

### 11. Notifications Collection (Enhanced)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId, // reference to users collection
  type: {
    type: String,
    enum: ["task_assigned", "deadline_reminder", "task_completed", "message_received", "mentor_available", "mentor_request", "new_follower", "review_received", "mentor_assigned"],
    required: true
  },
  title: String,
  message: String,
  related_task_id: ObjectId, // optional
  related_user_id: ObjectId, // optional
  related_mentor_id: ObjectId, // optional
  read_status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  created_at: Date,
  read_at: Date
}
```

### 12. TimeTracking Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId, // reference to users collection
  task_id: ObjectId, // reference to tasks collection
  project_id: ObjectId, // reference to projects collection
  mentor_id: ObjectId, // reference to users collection (if mentor is tracking time)
  start_time: Date,
  end_time: Date,
  duration: Number, // in minutes
  description: String,
  billable: Boolean,
  hourly_rate: Number,
  created_at: Date
}
```

### 13. HelpCenter Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  category: {
    type: String,
    enum: ["Getting Started", "Troubleshooting", "Account Management", "Features", "FAQ", "Mentor Guidelines"],
    required: true
  },
  tags: [String],
  author_id: ObjectId, // reference to users collection
  is_published: Boolean,
  view_count: Number,
  helpful_votes: Number,
  created_at: Date,
  updated_at: Date
}
```

### 14. MentorSessions Collection (New)
```javascript
{
  _id: ObjectId,
  mentor_id: ObjectId, // reference to users collection
  student_id: ObjectId, // reference to users collection
  task_id: ObjectId, // reference to tasks collection (optional)
  session_type: {
    type: String,
    enum: ["consultation", "review", "guidance", "code_review"],
    required: true
  },
  status: {
    type: String,
    enum: ["scheduled", "in_progress", "completed", "cancelled"],
    default: "scheduled"
  },
  scheduled_at: Date,
  duration: Number, // in minutes
  notes: String,
  mentor_rating: Number, // rating given by student
  mentor_feedback: String, // feedback from student
  created_at: Date,
  updated_at: Date
}
```

## Indexes

### Users Collection
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "expertise_areas": 1 })
```

### MentorProfiles Collection
```javascript
db.mentorProfiles.createIndex({ "user_id": 1 }, { unique: true })
db.mentorProfiles.createIndex({ "profession": 1 })
db.mentorProfiles.createIndex({ "company": 1 })
db.mentorProfiles.createIndex({ "average_rating": -1 })
db.mentorProfiles.createIndex({ "total_followers": -1 })
db.mentorProfiles.createIndex({ "is_featured": 1 })
db.mentorProfiles.createIndex({ "availability_status": 1 })
```

### MentorFollowers Collection
```javascript
db.mentorFollowers.createIndex({ "mentor_id": 1 })
db.mentorFollowers.createIndex({ "follower_id": 1 })
db.mentorFollowers.createIndex({ "mentor_id": 1, "follower_id": 1 }, { unique: true })
```

### MentorReviews Collection
```javascript
db.mentorReviews.createIndex({ "mentor_id": 1 })
db.mentorReviews.createIndex({ "reviewer_id": 1 })
db.mentorReviews.createIndex({ "rating": 1 })
db.mentorReviews.createIndex({ "created_at": -1 })
```

### Tasks Collection
```javascript
db.tasks.createIndex({ "assigned_to": 1 })
db.tasks.createIndex({ "category": 1 })
db.tasks.createIndex({ "status": 1 })
db.tasks.createIndex({ "deadline": 1 })
db.tasks.createIndex({ "assigned_by": 1 })
db.tasks.createIndex({ "mentor_id": 1 })
db.tasks.createIndex({ "created_at": 1 })
db.tasks.createIndex({ "mentor_assigned_at": 1 })
```

### MentorCategories Collection
```javascript
db.mentorCategories.createIndex({ "name": 1 }, { unique: true })
db.mentorCategories.createIndex({ "is_active": 1 })
```

### MentorSessions Collection
```javascript
db.mentorSessions.createIndex({ "mentor_id": 1 })
db.mentorSessions.createIndex({ "student_id": 1 })
db.mentorSessions.createIndex({ "task_id": 1 })
db.mentorSessions.createIndex({ "status": 1 })
db.mentorSessions.createIndex({ "scheduled_at": 1 })
```

## Sample Data

### Sample Mentor Profile Document
```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("mentor_user_id"),
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
}
```

### Sample Mentor Review Document
```javascript
{
  _id: ObjectId("..."),
  mentor_id: ObjectId("mentor_user_id"),
  reviewer_id: ObjectId("student_user_id"),
  task_id: ObjectId("task_id"),
  rating: 5,
  review_text: "Excellent guidance on the web development project. Very knowledgeable and patient.",
  review_type: "task_review",
  is_verified: true,
  helpful_votes: 12,
  created_at: new Date("2024-01-15")
}
```

### Sample Mentor Follower Document
```javascript
{
  _id: ObjectId("..."),
  mentor_id: ObjectId("mentor_user_id"),
  follower_id: ObjectId("student_user_id"),
  followed_at: new Date("2024-01-10"),
  is_active: true
}
```

## Relationships Summary

- **Users** can have **MentorProfiles** (one-to-one for mentors)
- **Users** can follow multiple **Mentors** through **MentorFollowers**
- **Mentors** can receive multiple **Reviews** from students
- **Tasks** can be assigned to **Mentors** for guidance
- **MentorSessions** track consultation meetings between mentors and students
- **MentorCategories** organize mentors by profession/specialization
- **Notifications** alert users about mentor-related activities
- **Messages** support mentor consultation conversations
- **TimeTracking** records mentor time spent on tasks

This enhanced schema provides comprehensive support for both task management and mentor systems, with proper linking between all entities.

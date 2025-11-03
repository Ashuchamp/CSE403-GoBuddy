# GoBuddy Backend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                        │
│                      (Mobile Client)                        │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │Activity  │  │ Profile  │  │ Requests │  │
│  │ Screen   │  │ Screen   │  │ Screen   │  │  Screen  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │              │              │        │
│       └─────────────┴──────────────┴──────────────┘        │
│                          │                                 │
│                    ┌─────▼─────┐                          │
│                    │ API Service│                          │
│                    │  (Fetch)   │                          │
│                    └─────┬─────┘                          │
└──────────────────────────┼─────────────────────────────────┘
                           │
                           │ HTTP/JSON
                           │
┌──────────────────────────▼─────────────────────────────────┐
│                   Node.js Backend Server                    │
│                    (Express + TypeScript)                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                   │  │
│  │                                                       │  │
│  │  [CORS] → [Helmet] → [Morgan] → [Body Parser]       │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐  │
│  │                   Router Layer                        │  │
│  │                                                       │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │  │
│  │  │   Users   │  │Activities │  │Activity       │   │  │
│  │  │  Routes   │  │  Routes   │  │Requests Routes│   │  │
│  │  └─────┬─────┘  └─────┬─────┘  └───────┬───────┘   │  │
│  └────────┼──────────────┼─────────────────┼───────────┘  │
│           │              │                 │               │
│  ┌────────▼──────────────▼─────────────────▼───────────┐  │
│  │                Controller Layer                      │  │
│  │                                                      │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │  │
│  │  │     User     │ │   Activity   │ │   Request   │ │  │
│  │  │  Controller  │ │  Controller  │ │ Controller  │ │  │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬──────┘ │  │
│  └─────────┼─────────────────┼─────────────────┼────────┘  │
│            │                 │                 │            │
│  ┌─────────▼─────────────────▼─────────────────▼────────┐  │
│  │                   Model Layer (Sequelize)            │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │   User   │  │ Activity │  │ ActivityRequest  │  │  │
│  │  │  Model   │  │  Model   │  │     Model        │  │  │
│  │  └─────┬────┘  └─────┬────┘  └─────┬────────────┘  │  │
│  └────────┼─────────────┼──────────────┼───────────────┘  │
│           │             │              │                   │
└───────────┼─────────────┼──────────────┼───────────────────┘
            │             │              │
            └─────────────┴──────────────┘
                          │
            ┌─────────────▼─────────────┐
            │     PostgreSQL Database    │
            │                            │
            │  ┌──────────────────────┐ │
            │  │    users             │ │
            │  │  - id (PK)           │ │
            │  │  - email             │ │
            │  │  - name              │ │
            │  │  - bio               │ │
            │  │  - skills[]          │ │
            │  │  - preferredTimes[]  │ │
            │  │  - activityTags[]    │ │
            │  │  - googleId          │ │
            │  │  - ...               │ │
            │  └──────────────────────┘ │
            │                            │
            │  ┌──────────────────────┐ │
            │  │    activities        │ │
            │  │  - id (PK)           │ │
            │  │  - userId (FK)       │ │
            │  │  - title             │ │
            │  │  - description       │ │
            │  │  - maxPeople         │ │
            │  │  - currentPeople     │ │
            │  │  - scheduledTimes[]  │ │
            │  │  - status            │ │
            │  │  - ...               │ │
            │  └──────────────────────┘ │
            │                            │
            │  ┌──────────────────────┐ │
            │  │  activity_requests   │ │
            │  │  - id (PK)           │ │
            │  │  - activityId (FK)   │ │
            │  │  - userId (FK)       │ │
            │  │  - userName          │ │
            │  │  - userBio           │ │
            │  │  - userSkills[]      │ │
            │  │  - status            │ │
            │  │  - ...               │ │
            │  └──────────────────────┘ │
            └────────────────────────────┘
```

## Data Flow Examples

### 1. Creating a New Activity

```
Mobile App                 Backend Server           Database
    │                           │                       │
    │  POST /api/activities     │                       │
    ├──────────────────────────>│                       │
    │  {                        │                       │
    │    userId,                │  Validate data        │
    │    title,                 │  ├────────────┐       │
    │    description,           │  │            │       │
    │    maxPeople,             │  └────────────┘       │
    │    scheduledTimes         │                       │
    │  }                        │  Check user exists    │
    │                           ├──────────────────────>│
    │                           │  SELECT * FROM users  │
    │                           │  WHERE id = ?         │
    │                           │<──────────────────────┤
    │                           │  User found           │
    │                           │                       │
    │                           │  Create activity      │
    │                           ├──────────────────────>│
    │                           │  INSERT INTO          │
    │                           │  activities...        │
    │                           │<──────────────────────┤
    │  201 Created              │  Activity created     │
    │<──────────────────────────┤                       │
    │  {                        │                       │
    │    success: true,         │                       │
    │    data: {...}            │                       │
    │  }                        │                       │
```

### 2. Joining an Activity (Request Flow)

```
User A (Creator)    User B (Joiner)    Backend Server       Database
    │                    │                    │                  │
    │                    │  POST /requests    │                  │
    │                    ├───────────────────>│                  │
    │                    │  {                 │  Check activity  │
    │                    │   activityId,      ├─────────────────>│
    │                    │   userId,          │  not full        │
    │                    │   ...              │<─────────────────┤
    │                    │  }                 │                  │
    │                    │                    │  Create request  │
    │                    │                    ├─────────────────>│
    │                    │                    │  status=pending  │
    │                    │<───────────────────┤<─────────────────┤
    │                    │  Request created   │                  │
    │                    │                    │                  │
    │  GET /requests/... │                    │                  │
    ├────────────────────┼───────────────────>│  Get pending     │
    │                    │                    │  requests        │
    │                    │                    ├─────────────────>│
    │<───────────────────┼────────────────────┤<─────────────────┤
    │  [pending requests]│                    │                  │
    │                    │                    │                  │
    │  PATCH /requests/  │                    │                  │
    │  :id/status        │                    │                  │
    ├────────────────────┼───────────────────>│  Update request  │
    │  {status:approved} │                    │  status          │
    │                    │                    ├─────────────────>│
    │                    │                    │  Increment       │
    │                    │                    │  currentPeople   │
    │<───────────────────┼────────────────────┤<─────────────────┤
    │  Request approved  │                    │                  │
    │                    │  [Notification]    │                  │
    │                    │<───────────────────│                  │
```

## API Request/Response Examples

### Create User

**Request:**
```http
POST /api/users HTTP/1.1
Content-Type: application/json

{
  "email": "john@example.com",
  "name": "John Doe",
  "bio": "Love hiking!",
  "skills": ["photography", "hiking"],
  "preferredTimes": ["weekends"],
  "activityTags": ["outdoor", "sports"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "bio": "Love hiking!",
    "skills": ["photography", "hiking"],
    "preferredTimes": ["weekends"],
    "activityTags": ["outdoor", "sports"],
    "createdAt": "2025-11-02T10:30:00.000Z",
    "updatedAt": "2025-11-02T10:30:00.000Z"
  }
}
```

### Create Activity

**Request:**
```http
POST /api/activities HTTP/1.1
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userName": "John Doe",
  "title": "Saturday Hike",
  "description": "Let's hike Discovery Park!",
  "maxPeople": 5,
  "scheduledTimes": ["2025-11-10T09:00:00Z"],
  "campusLocation": "North Campus"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "John Doe",
    "title": "Saturday Hike",
    "description": "Let's hike Discovery Park!",
    "maxPeople": 5,
    "currentPeople": 1,
    "scheduledTimes": ["2025-11-10T09:00:00Z"],
    "campusLocation": "North Campus",
    "status": "active",
    "createdAt": "2025-11-02T10:35:00.000Z",
    "updatedAt": "2025-11-02T10:35:00.000Z"
  }
}
```

## Technology Stack Details

### Backend Technologies
- **Node.js v16+**: JavaScript runtime
- **Express.js v4**: Web application framework
- **TypeScript v5**: Type-safe JavaScript
- **Sequelize v6**: SQL ORM
- **PostgreSQL v12+**: Relational database

### Security & Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger
- **dotenv**: Environment variable management

### Development Tools
- **Nodemon**: Auto-restart on file changes
- **ts-node**: TypeScript execution
- **ESLint**: Code quality
- **Prettier**: Code formatting (optional)

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gobuddy
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8081,exp://localhost:8081
```

## Performance Considerations

- **Connection Pooling**: Sequelize manages database connection pool (max 5 connections)
- **Indexing**: Primary keys and foreign keys automatically indexed
- **Unique Constraints**: Prevent duplicate requests and users
- **Cascading Deletes**: Automatically clean up related records
- **Query Optimization**: Uses Sequelize's query building for efficiency

## Future Enhancements

1. **Authentication**: JWT tokens for secure API access
2. **Real-time**: WebSocket support for live updates
3. **File Upload**: Profile pictures and activity images
4. **Notifications**: Push notifications for requests
5. **Search**: Full-text search for activities
6. **Pagination**: Handle large datasets efficiently
7. **Caching**: Redis for frequently accessed data
8. **Rate Limiting**: Prevent API abuse
9. **Logging**: Structured logging with Winston
10. **Monitoring**: Application performance monitoring

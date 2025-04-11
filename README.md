# School Management System

A TypeScript-based school management system using IndexedDB for data persistence and implementing various design patterns.

---

## 📁 Project Structure

```
src/
├── models/         # Domain entities
├── dao/            # Data Access Object interfaces
├── controllers/    # IndexedDB implementations
└── tests/          # Test suites
```

---

## 🚀 Features

- Resource Management
- Course Management
- Teacher Management
- Student Management
- Relationship handling between entities
- Data persistence using IndexedDB

---

## 🧠 Design Patterns

### 1. DAO Pattern

- Separates data persistence logic from business logic
- Interfaces:
  - `TeacherDAO`
  - `StudentDAO`
  - `CourseDAO`
  - `ResourceDAO`
- Implementations:
  - `IndexedDBTeacherDAO`
  - `IndexedDBStudentDAO`
  - etc.

### 2. Singleton Pattern

- Used in IndexedDB connection management
- Ensures a single database instance shared across DAOs

```ts
private db: IDBDatabase | null = null;

private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    // ... connection logic
}
```

### 3. Factory Pattern

- Implemented in model classes for object creation from JSON
- Static factory methods: `fromJSON()`

```ts
static fromJSON(json: any): Resource {
    const resource = new Resource(json.name, json.type, json.available);
    // ... property initialization
    return resource;
}
```

---

## 🗃️ IndexedDB Implementation

### Database Structure

- **Database Name**: `SchoolManagementSystem`
- **Object Stores**:
  - `teachers`: Stores teacher records
  - `students`: Stores student records
  - `courses`: Stores course records
  - `resources`: Stores resource records

### Key Features

- Asynchronous operations using Promises
- Unique indices for email fields
- Complex relationship handling
- CRUD operations for all entities
- Extra services management for students (tutoring, sports, arts) // Added feature

---

## 📦 Models

### Teacher

- **Properties**: `id`, `name`, `email`, `courses`
- **Methods**: `assignCourse`, `removeCourse`

### Student

- **Properties**: 
  - `id`
  - `name`
  - `email`
  - `enrolledCourses`
  - `extraServices` // Added service tracking
- **Methods**: 
  - `enroll`
  - `withdraw`
  - `addService` // Added service management

### Course

- **Properties**: `id`, `title`, `subject`, `teacher`
- **Methods**: `assignTeacher`, `addStudent`

### Resource

- **Properties**: `id`, `name`, `type`, `available`, `courses`
- **Methods**: `allocate`, `release`, `addCourse`

---

## 🧪 Testing

Comprehensive test suites for each DAO:
- Student tests include:
  - Basic CRUD operations
  - Course enrollment
  - Service management (tutoring, sports, arts)
  - Email-based search
  - Course-based filtering
  - Service-based filtering

```bash
npx ts-node src/tests/testTeacherDAO.ts
npx ts-node src/tests/testStudentDAO.ts
npx ts-node src/tests/testCourseDAO.ts
npx ts-node src/tests/testResourceDAO.ts
```

---

## ⚙️ Getting Started

### Install dependencies:

```bash
npm install
```

### Run tests:

```bash
npm test
```

---

## 📚 Dependencies

- TypeScript
- IndexedDB
- UUID
- fake-indexeddb (for testing) // makhdemchi !

---

## ✅ Best Practices

- Strict typing with TypeScript
- Asynchronous operations handling
- Error handling and validation
- Data integrity through relationships
- Unit testing for all DAOs
- Clean code architecture

---

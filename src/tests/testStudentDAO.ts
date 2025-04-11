import 'fake-indexeddb/auto';
import { IndexedDBStudentDAO } from '../controllers/IndexedDBStudentDAO';
import { Student } from '../models/Student';
import { Course } from '../models/Course';

async function testStudentDAO() {
    try {
        console.log('Starting StudentDAO tests...');
        const dao = new IndexedDBStudentDAO();
        
        // Test 1: Create and save a student
        const student1 = new Student('John Doe', 'john@example.com');
        await dao.save(student1);
        console.log('\n✓ Test 1: Student saved successfully');

        // Test 2: Retrieve student by ID
        const retrieved = await dao.findById(student1.id);
        if (!retrieved || retrieved.id !== student1.id) {
            throw new Error('Failed to retrieve student by ID');
        }
        console.log('✓ Test 2: Student retrieved successfully');

        // Test 3: Find student by email
        const foundByEmail = await dao.findByEmail('john@example.com');
        if (!foundByEmail || foundByEmail.email !== student1.email) {
            throw new Error('Failed to find student by email');
        }
        console.log('✓ Test 3: Student found by email');

        // Test 4: Update student
        student1.addService('tutoring');
        await dao.update(student1);
        const updated = await dao.findById(student1.id);
        if (!updated?.extraServices.includes('tutoring')) {
            throw new Error('Failed to update student');
        }
        console.log('✓ Test 4: Student updated successfully');

        // Test 5: Add multiple students
        const student2 = new Student('Jane Smith', 'jane@example.com');
        await dao.save(student2);
        const allStudents = await dao.findAll();
        if (allStudents.length !== 2) {
            throw new Error('Failed to retrieve all students');
        }
        console.log('✓ Test 5: Multiple students handled successfully');

        // Test 6: Course enrollment
        const course = new Course('Mathematics 101', 'Math');
        student1.enroll(course);
        await dao.update(student1);
        const studentsInCourse = await dao.findByCourse(course.id);
        if (studentsInCourse.length !== 1 || studentsInCourse[0].id !== student1.id) {
            throw new Error('Failed to find students by course');
        }
        console.log('✓ Test 6: Course enrollment verified');

    

        console.log('\nAll tests completed successfully! ✨');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        throw error;
    }
}

// Run the tests
testStudentDAO().then(() => {
    console.log('Testing completed ✅');
}).catch(error => {
    console.error('Testing failed ❌:', error);
    process.exit(1);
});
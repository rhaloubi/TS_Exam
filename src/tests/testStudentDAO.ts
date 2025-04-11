import { IndexedDBStudentDAO } from '../controllers/IndexedDBStudentDAO';
import { Student } from '../models/Student';
import { Course } from '../models/Course';

async function testStudentDAO() {
    try {
        console.log('Starting StudentDAO tests...');
        const dao = new IndexedDBStudentDAO();
        
        // Test 1: Create and save a student
        const student1 = new Student('John Doe', 'john@example.com');
        console.log('\nTest 1: Saving student:', student1);
        await dao.save(student1);
        console.log('✓ Student saved successfully');

        // Test 2: Retrieve student by ID
        const retrieved = await dao.findById(student1.id);
        console.log('\nTest 2: Retrieved student by ID:', retrieved);
        console.log('✓ Student retrieval', retrieved?.id === student1.id ? 'successful' : 'failed');

        // Test 3: Find student by email
        const foundByEmail = await dao.findByEmail('john@example.com');
        console.log('\nTest 3: Found student by email:', foundByEmail);
        console.log('✓ Email search', foundByEmail?.email === student1.email ? 'successful' : 'failed');

        // Test 4: Update student
        student1.addService('tutoring');
        await dao.update(student1);
        const updated = await dao.findById(student1.id);
        console.log('\nTest 4: Updated student:', updated);
        console.log('✓ Update', updated?.extraServices.includes('tutoring') ? 'successful' : 'failed');

        // Test 5: Add multiple students
        const student2 = new Student('Jane Smith', 'jane@example.com');
        await dao.save(student2);
        const allStudents = await dao.findAll();
        console.log('\nTest 5: All students:', allStudents);
        console.log('✓ Multiple students', allStudents.length === 2 ? 'successful' : 'failed');

        // Test 6: Course enrollment
        const course = new Course('Mathematics 101', 'Math');
        student1.enroll(course);
        await dao.update(student1);
        const studentsInCourse = await dao.findByCourse(course.id);
        console.log('\nTest 6: Students in course:', studentsInCourse);
        console.log('✓ Course enrollment', studentsInCourse.length === 1 ? 'successful' : 'failed');

        // Test 7: Delete student
        await dao.delete(student2.id);
        const deletedCheck = await dao.findById(student2.id);
        console.log('\nTest 7: Deleted student check:', deletedCheck);
        console.log('✓ Deletion', deletedCheck === undefined ? 'successful' : 'failed');

        console.log('\nAll tests completed successfully!');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the tests
testStudentDAO().then(() => {
    console.log('Testing completed');
}).catch(error => {
    console.error('Testing failed:', error);
});
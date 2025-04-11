import 'fake-indexeddb/auto';
import { IndexedDBStudentDAO } from '../controllers/IndexedDBStudentDAO';
import { Student } from '../models/Student';
import { Course } from '../models/Course';

async function testStudentDAO() {
    try {
        console.log('\n🚀 Starting StudentDAO tests...');
        const dao = new IndexedDBStudentDAO();
        
        // Test 1: Create and save a student
        const student1 = new Student('John Doe', 'john@example.com');
        console.log('\n📝 Test 1 - Student to save:', {
            id: student1.id,
            name: student1.name,
            email: student1.email
        });
        await dao.save(student1);
        console.log('✓ Student saved successfully');

        // Test 2: Retrieve student by ID
        const retrieved = await dao.findById(student1.id);
        console.log('\n🔍 Test 2 - Retrieved student:', {
            id: retrieved?.id,
            name: retrieved?.name,
            email: retrieved?.email
        });
        if (!retrieved || retrieved.id !== student1.id) {
            throw new Error('Failed to retrieve student by ID');
        }
        console.log('✓ Student retrieved successfully');

        // Test 3: Find student by email
        const foundByEmail = await dao.findByEmail('john@example.com');
        console.log('\n📧 Test 3 - Found by email:', {
            id: foundByEmail?.id,
            name: foundByEmail?.name,
            email: foundByEmail?.email
        });
        if (!foundByEmail || foundByEmail.email !== student1.email) {
            throw new Error('Failed to find student by email');
        }
        console.log('✓ Student found by email');

        // Test 4: Update student
        student1.addService('tutoring');
        await dao.update(student1);
        const updated = await dao.findById(student1.id);
        console.log('\n📝 Test 4 - Updated student:', {
            id: updated?.id,
            name: updated?.name,
            email: updated?.email,
            services: updated?.extraServices
        });
        if (!updated?.extraServices.includes('tutoring')) {
            throw new Error('Failed to update student');
        }
        console.log('✓ Student updated successfully');

        // Test 5: Add multiple students
        const student2 = new Student('Jane Smith', 'jane@example.com');
        await dao.save(student2);
        const allStudents = await dao.findAll();
        console.log('\n👥 Test 5 - All students:', allStudents.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email
        })));
        if (allStudents.length !== 2) {
            throw new Error('Failed to retrieve all students');
        }
        console.log('✓ Multiple students handled successfully');

        // Test 6: Course enrollment
        const course = new Course('Mathematics 101', 'Math');
        student1.enroll(course);
        await dao.update(student1);
        const studentsInCourse = await dao.findByCourse(course.id);
        console.log('\n📚 Test 6 - Course enrollment:', {
            courseId: course.id,
            courseTitle: course.title,
            enrolledStudents: studentsInCourse.map(s => ({
                id: s.id,
                name: s.name,
                email: s.email
            }))
        });
        if (studentsInCourse.length !== 1 || studentsInCourse[0].id !== student1.id) {
            throw new Error('Failed to find students by course');
        }
        console.log('✓ Course enrollment verified');

        // Test 7: Services management
        student1.addService('sports');
        student1.addService('art_club');
        await dao.update(student1);
        const updatedWithServices = await dao.findById(student1.id);
        console.log('\n🎨 Test 7 - Student with services:', {
            id: updatedWithServices?.id,
            name: updatedWithServices?.name,
            services: updatedWithServices?.extraServices
        });
        if (!updatedWithServices?.extraServices.includes('sports') || 
            !updatedWithServices?.extraServices.includes('art_club') ||
            !updatedWithServices?.extraServices.includes('tutoring')) {
            throw new Error('Failed to manage multiple services');
        }
        console.log('✓ Multiple services managed successfully');

        // Test 8: Find students by service
        const studentsInSports = await dao.findByService('sports');
        console.log('\n🏃 Test 8 - Students in sports:', studentsInSports.map(s => ({
            id: s.id,
            name: s.name,
            services: s.extraServices
        })));
        if (studentsInSports.length !== 1 || !studentsInSports[0].extraServices.includes('sports')) {
            throw new Error('Failed to find students by service');
        }
        console.log('✓ Service search successful');

        console.log('\n✨ All tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        throw error;
    }
}

// Run the tests
testStudentDAO().then(() => {
    console.log('✅ Testing completed');
}).catch(error => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
});
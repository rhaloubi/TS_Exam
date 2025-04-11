import 'fake-indexeddb/auto';
import { IndexedDBCourseDAO } from '../controllers/IndexedDBCourseDAO';
import { Course } from '../models/Course';
import { Teacher } from '../models/Teacher';
import { Student } from '../models/Student';

async function testCourseDAO() {
    try {
        console.log('\n🚀 Starting CourseDAO tests...');
        const dao = new IndexedDBCourseDAO();
        
        // Test 1: Create and save a course
        const course1 = new Course('Mathematics 101', 'Math');
        console.log('\n📝 Test 1 - Course to save:', {
            id: course1.id,
            title: course1.title,
            subject: course1.subject
        });
        await dao.save(course1);
        console.log('✓ Course saved successfully');

        // Test 2: Retrieve course by ID
        const retrieved = await dao.findById(course1.id);
        console.log('\n🔍 Test 2 - Retrieved course:', {
            id: retrieved?.id,
            title: retrieved?.title,
            subject: retrieved?.subject
        });
        if (!retrieved || retrieved.id !== course1.id) {
            throw new Error('Failed to retrieve course by ID');
        }
        console.log('✓ Course retrieved successfully');

        // Test 3: Add teacher to course
        const teacher = new Teacher('Prof. Smith', 'smith@example.com');
        course1.assignTeacher(teacher);
        await dao.update(course1);
        const updatedWithTeacher = await dao.findById(course1.id);
        console.log('\n👨‍🏫 Test 3 - Course with teacher:', {
            courseId: updatedWithTeacher?.id,
            teacherId: updatedWithTeacher?.teacher?.id,
            teacherName: updatedWithTeacher?.teacher?.name
        });
        if (!updatedWithTeacher?.teacher) {
            throw new Error('Failed to update course with teacher');
        }
        console.log('✓ Teacher assigned successfully');

        // Test 4: Add multiple courses
        const course2 = new Course('Physics 101', 'Science');
        await dao.save(course2);
        const allCourses = await dao.findAll();
        console.log('\n📚 Test 4 - All courses:', allCourses.map(c => ({
            id: c.id,
            title: c.title,
            subject: c.subject
        })));
        if (allCourses.length !== 2) {
            throw new Error('Failed to retrieve all courses');
        }
        console.log('✓ Multiple courses handled successfully');

        // Test 5: Find by subject
        const mathCourses = await dao.findBySubject('Math');
        console.log('\n📖 Test 5 - Math courses:', mathCourses.map(c => ({
            id: c.id,
            title: c.title,
            subject: c.subject
        })));
        if (mathCourses.length !== 1 || mathCourses[0].subject !== 'Math') {
            throw new Error('Failed to find courses by subject');
        }
        console.log('✓ Subject search successful');

        // Test 6: Find by teacher
        const teacherCourses = await dao.findByTeacher(teacher.id);
        console.log('\n👨‍🏫 Test 6 - Teacher\'s courses:', teacherCourses.map(c => ({
            id: c.id,
            title: c.title,
            subject: c.subject
        })));
        if (teacherCourses.length !== 1 || teacherCourses[0].id !== course1.id) {
            throw new Error('Failed to find courses by teacher');
        }
        console.log('✓ Teacher\'s courses retrieved successfully');

        // Test 7: Delete course
        await dao.delete(course2.id);
        const deletedCheck = await dao.findById(course2.id);
        console.log('\n🗑️ Test 7 - Deleted course check:', deletedCheck);
        if (deletedCheck !== undefined) {
            throw new Error('Failed to delete course');
        }
        console.log('✓ Course deleted successfully');

        console.log('\n✨ All CourseDAO tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        throw error;
    }
}

// Run the tests
testCourseDAO().then(() => {
    console.log('✅ Testing completed');
}).catch(error => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
});
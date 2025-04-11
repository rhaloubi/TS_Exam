import 'fake-indexeddb/auto';
import { IndexedDBTeacherDAO } from '../controllers/IndexedDBTeacherDAO';
import { Teacher } from '../models/Teacher';
import { Course } from '../models/Course';

async function testTeacherDAO() {
    try {
        console.log('\n🚀 Starting TeacherDAO tests...');
        const dao = new IndexedDBTeacherDAO();
        
        // Test 1: Create and save a teacher
        const teacher1 = new Teacher('Prof. Smith', 'smith@example.com');
        console.log('\n📝 Test 1 - Teacher to save:', {
            id: teacher1.id,
            name: teacher1.name,
            email: teacher1.email
        });
        await dao.save(teacher1);
        console.log('✓ Teacher saved successfully');

        // Test 2: Retrieve teacher by ID
        const retrieved = await dao.findById(teacher1.id);
        console.log('\n🔍 Test 2 - Retrieved teacher:', {
            id: retrieved?.id,
            name: retrieved?.name,
            email: retrieved?.email
        });
        if (!retrieved || retrieved.id !== teacher1.id) {
            throw new Error('Failed to retrieve teacher by ID');
        }
        console.log('✓ Teacher retrieved successfully');

        // Test 3: Find teacher by email
        const foundByEmail = await dao.findByEmail('smith@example.com');
        console.log('\n📧 Test 3 - Found by email:', {
            id: foundByEmail?.id,
            name: foundByEmail?.name,
            email: foundByEmail?.email
        });
        if (!foundByEmail || foundByEmail.email !== teacher1.email) {
            throw new Error('Failed to find teacher by email');
        }
        console.log('✓ Teacher found by email');

        // Test 4: Assign course to teacher
        const course = new Course('Mathematics 101', 'Math');
        teacher1.assignCourse(course);
        await dao.update(teacher1);
        const updated = await dao.findById(teacher1.id);
        console.log('\n📚 Test 4 - Updated teacher:', {
            id: updated?.id,
            name: updated?.name,
            courses: updated?.courses.map(c => ({
                id: c.id,
                title: c.title,
                subject: c.subject
            }))
        });
        if (!updated?.courses.some(c => c.id === course.id)) {
            throw new Error('Failed to update teacher with course');
        }
        console.log('✓ Course assignment successful');

        // Test 5: Add multiple teachers
        const teacher2 = new Teacher('Dr. Johnson', 'johnson@example.com');
        await dao.save(teacher2);
        const allTeachers = await dao.findAll();
        console.log('\n👥 Test 5 - All teachers:', allTeachers.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email
        })));
        if (allTeachers.length !== 2) {
            throw new Error('Failed to retrieve all teachers');
        }
        console.log('✓ Multiple teachers handled successfully');

        // Test 6: Find by course
        const teachersForCourse = await dao.findByCourse(course.id);
        console.log('\n📖 Test 6 - Teachers for course:', teachersForCourse.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email
        })));
        if (teachersForCourse.length !== 1 || teachersForCourse[0].id !== teacher1.id) {
            throw new Error('Failed to find teachers by course');
        }
        console.log('✓ Course search successful');

        // Test 7: Delete teacher
        await dao.delete(teacher2.id);
        const deletedCheck = await dao.findById(teacher2.id);
        console.log('\n🗑️ Test 7 - Deleted teacher check:', deletedCheck);
        if (deletedCheck !== undefined) {
            throw new Error('Failed to delete teacher');
        }
        console.log('✓ Teacher deleted successfully');

        console.log('\n✨ All TeacherDAO tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        throw error;
    }
}

// Run the tests
testTeacherDAO().then(() => {
    console.log('✅ Testing completed');
}).catch(error => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
});
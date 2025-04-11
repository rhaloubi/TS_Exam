import 'fake-indexeddb/auto';
import { IndexedDBResourceDAO } from '../controllers/IndexedDBResourceDAO';
import { Resource } from '../models/Resource';
import { Course } from '../models/Course';

async function testResourceDAO() {
    try {
        console.log('\n🚀 Starting ResourceDAO tests...');
        const dao = new IndexedDBResourceDAO();
        
        // Test 1: Create and save a resource
        const resource1 = new Resource('Projector 1', 'Equipment', true);
        console.log('\n📝 Test 1 - Resource to save:', {
            id: resource1.id,
            name: resource1.name,
            type: resource1.type,
            available: resource1.available
        });
        await dao.save(resource1);
        console.log('✓ Resource saved successfully');

        // Test 2: Retrieve resource by ID
        const retrieved = await dao.findById(resource1.id);
        console.log('\n🔍 Test 2 - Retrieved resource:', {
            id: retrieved?.id,
            name: retrieved?.name,
            type: retrieved?.type,
            available: retrieved?.available
        });
        if (!retrieved || retrieved.id !== resource1.id) {
            throw new Error('Failed to retrieve resource by ID');
        }
        console.log('✓ Resource retrieved successfully');

        // Test 3: Update resource availability
        resource1.allocate();
        await dao.update(resource1);
        const updated = await dao.findById(resource1.id);
        console.log('\n🔄 Test 3 - Updated resource:', {
            id: updated?.id,
            name: updated?.name,
            available: updated?.available
        });
        if (updated?.available !== false) {
            throw new Error('Failed to update resource availability');
        }
        console.log('✓ Resource availability updated successfully');

        // Test 4: Add course to resource
        const course = new Course('Physics Lab', 'Science');
        resource1.addCourse(course);
        await dao.update(resource1);
        const updatedWithCourse = await dao.findById(resource1.id);
        console.log('\n📚 Test 4 - Resource with course:', {
            id: updatedWithCourse?.id,
            name: updatedWithCourse?.name,
            courses: updatedWithCourse?.courses.map(c => ({
                id: c.id,
                title: c.title,
                subject: c.subject
            }))
        });
        if (!updatedWithCourse?.courses.some(c => c.id === course.id)) {
            throw new Error('Failed to update resource with course');
        }
        console.log('✓ Course assignment successful');

        // Test 5: Add multiple resources
        const resource2 = new Resource('Lab Equipment', 'Equipment', true);
        await dao.save(resource2);
        const allResources = await dao.findAll();
        console.log('\n📦 Test 5 - All resources:', allResources.map(r => ({
            id: r.id,
            name: r.name,
            type: r.type,
            available: r.available
        })));
        if (allResources.length !== 2) {
            throw new Error('Failed to retrieve all resources');
        }
        console.log('✓ Multiple resources handled successfully');

        // Test 6: Release resource
        resource1.release();
        await dao.update(resource1);
        const releasedResource = await dao.findById(resource1.id);
        console.log('\n🔓 Test 6 - Released resource:', {
            id: releasedResource?.id,
            name: releasedResource?.name,
            available: releasedResource?.available
        });
        if (!releasedResource?.available) {
            throw new Error('Failed to release resource');
        }
        console.log('✓ Resource released successfully');

        // Test 7: Delete resource
        await dao.delete(resource2.id);
        const deletedCheck = await dao.findById(resource2.id);
        console.log('\n🗑️ Test 7 - Deleted resource check:', deletedCheck);
        if (deletedCheck !== undefined) {
            throw new Error('Failed to delete resource');
        }
        console.log('✓ Resource deleted successfully');

        console.log('\n✨ All ResourceDAO tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        throw error;
    }
}

// Run the tests
testResourceDAO().then(() => {
    console.log('✅ Testing completed');
}).catch(error => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
});
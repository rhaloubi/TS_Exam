import { IndexedDBStudentDAO } from '../../dao/IndexedDBStudentDAO';
import { Course } from '../../models/Course';
import { Student } from '../../models/Student';
import { expect, test, describe, beforeEach, afterEach } from '@jest/globals';

describe('IndexedDBStudentDAO', () => {
    let dao: IndexedDBStudentDAO;
    let mockStudent: Student;

    beforeEach(() => {
        dao = new IndexedDBStudentDAO();
        mockStudent = new Student('Test Student', 'test@example.com');
    });

    afterEach(() => {
        // Clean up IndexedDB after each test
        indexedDB.deleteDatabase('SchoolManagementSystem');
    });

    test('should save and retrieve a student', async () => {
        await dao.save(mockStudent);
        const retrieved = await dao.findById(mockStudent.id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.id).toBe(mockStudent.id);
        expect(retrieved?.name).toBe(mockStudent.name);
        expect(retrieved?.email).toBe(mockStudent.email);
    });

    test('should find student by email', async () => {
        await dao.save(mockStudent);
        const found = await dao.findByEmail(mockStudent.email);
        expect(found).toBeDefined();
        expect(found?.email).toBe(mockStudent.email);
    });

    test('should update student', async () => {
        await dao.save(mockStudent);
        mockStudent.addService('tutoring');
        await dao.update(mockStudent);
        
        const updated = await dao.findById(mockStudent.id);
        expect(updated?.extraServices).toContain('tutoring');
    });

    test('should delete student', async () => {
        await dao.save(mockStudent);
        await dao.delete(mockStudent.id);
        
        const deleted = await dao.findById(mockStudent.id);
        expect(deleted).toBeUndefined();
    });

    test('should find all students', async () => {
        const mockStudent2 = new Student('Another Student', 'another@example.com');
        
        await dao.save(mockStudent);
        await dao.save(mockStudent2);
        
        const allStudents = await dao.findAll();
        expect(allStudents.length).toBe(2);
    });

    test('should find students by course', async () => {
        const course = new Course('Test Course', 'Math');
        mockStudent.enroll(course);
        await dao.save(mockStudent);
        
        const studentsInCourse = await dao.findByCourse(course.id);
        expect(studentsInCourse.length).toBe(1);
        expect(studentsInCourse[0].id).toBe(mockStudent.id);
    });
});

import { Course } from '../models/Course';
import { CourseDAO } from '../dao/CourseDAO';
import { IndexedDBManager } from '../dao/IndexedDBManager';

export class IndexedDBCourseDAO implements CourseDAO {
    private dbManager: IndexedDBManager;
    private storeName = 'courses';

    constructor() {
        this.dbManager = IndexedDBManager.getInstance();
    }

    async save(course: Course): Promise<void> {
        await this.dbManager.save(this.storeName, course);
    }

    async findById(id: string): Promise<Course | undefined> {
        return await this.dbManager.findById<Course>(this.storeName, id);
    }

    async findAll(): Promise<Course[]> {
        return await this.dbManager.findAll<Course>(this.storeName);
    }

    async update(course: Course): Promise<void> {
        await this.dbManager.update(this.storeName, course);
    }

    async delete(id: string): Promise<void> {
        await this.dbManager.delete(this.storeName, id);
    }

    async findByTeacher(teacherId: string): Promise<Course[]> {
        const courses = await this.dbManager.findAll<Course>(this.storeName);
        return courses.filter(course => course.teacher?.id === teacherId);
    }

    async findByStudent(studentId: string): Promise<Course[]> {
        const courses = await this.dbManager.findAll<Course>(this.storeName);
        return courses.filter(course => 
            course.students.some(student => student.id === studentId)
        );
    }

    async findBySubject(subject: string): Promise<Course[]> {
        const courses = await this.dbManager.findAll<Course>(this.storeName);
        return courses.filter(course => course.subject === subject);
    }
}
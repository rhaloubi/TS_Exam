import { Course } from '../models/Course';
import { CourseDAO } from '../dao/CourseDAO';
import { IndexedDBCourseDAO } from '../dao/IndexedDBCourseDAO';

export class CourseManager {
    private static instance: CourseManager;
    private courses: Map<string, Course> = new Map();
    private dao: CourseDAO;

    private constructor() {
        this.dao = new IndexedDBCourseDAO();
        this.initializeCourses();
    }

    private async initializeCourses(): Promise<void> {
        const courses = await this.dao.findAll();
        courses.forEach(course => {
            this.courses.set(course.id, course);
        });
    }

    static getInstance(): CourseManager {
        if (!CourseManager.instance) {
            CourseManager.instance = new CourseManager();
        }
        return CourseManager.instance;
    }

    async addCourse(course: Course): Promise<void> {
        await this.dao.save(course);
        this.courses.set(course.id, course);
    }

    async getCourse(id: string): Promise<Course | undefined> {
        const cachedCourse = this.courses.get(id);
        if (cachedCourse) return cachedCourse;

        const course = await this.dao.findById(id);
        if (course) {
            this.courses.set(course.id, course);
        }
        return course;
    }

    async getAllCourses(): Promise<Course[]> {
        return Array.from(this.courses.values());
    }

    async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
        return await this.dao.findByTeacher(teacherId);
    }

    async getCoursesByStudent(studentId: string): Promise<Course[]> {
        return await this.dao.findByStudent(studentId);
    }

    async getCoursesBySubject(subject: string): Promise<Course[]> {
        return await this.dao.findBySubject(subject);
    }

    async updateCourse(course: Course): Promise<void> {
        await this.dao.update(course);
        this.courses.set(course.id, course);
    }

    async deleteCourse(id: string): Promise<void> {
        await this.dao.delete(id);
        this.courses.delete(id);
    }
}
import { Teacher } from '../models/Teacher';
import { TeacherDAO } from '../dao/TeacherDAO';
import { IndexedDBTeacherDAO } from '../dao/IndexedDBTeacherDAO';
import { Course } from '../models/Course';

export class TeacherManager {
    private static instance: TeacherManager;
    private teachers: Map<string, Teacher> = new Map();
    private dao: TeacherDAO;

    private constructor() {
        this.dao = new IndexedDBTeacherDAO();
        this.initializeTeachers();
    }

    private async initializeTeachers(): Promise<void> {
        const teachers = await this.dao.findAll();
        teachers.forEach(teacher => {
            this.teachers.set(teacher.id, teacher);
        });
    }

    static getInstance(): TeacherManager {
        if (!TeacherManager.instance) {
            TeacherManager.instance = new TeacherManager();
        }
        return TeacherManager.instance;
    }

    async addTeacher(teacher: Teacher): Promise<void> {
        await this.dao.save(teacher);
        this.teachers.set(teacher.id, teacher);
    }

    async getTeacher(id: string): Promise<Teacher | undefined> {
        const cachedTeacher = this.teachers.get(id);
        if (cachedTeacher) return cachedTeacher;

        const teacher = await this.dao.findById(id);
        if (teacher) {
            this.teachers.set(teacher.id, teacher);
        }
        return teacher;
    }

    async getAllTeachers(): Promise<Teacher[]> {
        return Array.from(this.teachers.values());
    }

    async getTeacherByEmail(email: string): Promise<Teacher | undefined> {
        return await this.dao.findByEmail(email);
    }

    async getTeacherByCourse(courseId: string): Promise<Teacher | undefined> {
        return await this.dao.findByCourse(courseId);
    }

    async updateTeacher(teacher: Teacher): Promise<void> {
        await this.dao.update(teacher);
        this.teachers.set(teacher.id, teacher);
    }

    async deleteTeacher(id: string): Promise<void> {
        await this.dao.delete(id);
        this.teachers.delete(id);
    }

    async assignCourseToTeacher(teacherId: string, course: Course): Promise<void> {
        const teacher = await this.getTeacher(teacherId);
        if (teacher) {
            teacher.assignCourse(course);
            await this.updateTeacher(teacher);
        }
    }
}
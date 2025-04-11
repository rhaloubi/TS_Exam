import { Student } from '../models/Student';
import { StudentDAO } from '../dao/StudentDAO';
import { IndexedDBStudentDAO } from '../dao/IndexedDBStudentDAO';
import { Course } from '../models/Course';

export class StudentManager {
    private static instance: StudentManager;
    private students: Map<string, Student> = new Map();
    private dao: StudentDAO;

    private constructor() {
        this.dao = new IndexedDBStudentDAO();
        this.initializeStudents();
    }

    private async initializeStudents(): Promise<void> {
        const students = await this.dao.findAll();
        students.forEach(student => {
            this.students.set(student.id, student);
        });
    }

    static getInstance(): StudentManager {
        if (!StudentManager.instance) {
            StudentManager.instance = new StudentManager();
        }
        return StudentManager.instance;
    }

    async addStudent(student: Student): Promise<void> {
        await this.dao.save(student);
        this.students.set(student.id, student);
    }

    async getStudent(id: string): Promise<Student | undefined> {
        const cachedStudent = this.students.get(id);
        if (cachedStudent) return cachedStudent;

        const student = await this.dao.findById(id);
        if (student) {
            this.students.set(student.id, student);
        }
        return student;
    }

    async getAllStudents(): Promise<Student[]> {
        return Array.from(this.students.values());
    }

    async getStudentByEmail(email: string): Promise<Student | undefined> {
        return await this.dao.findByEmail(email);
    }

    async getStudentsByCourse(courseId: string): Promise<Student[]> {
        return await this.dao.findByCourse(courseId);
    }

    async updateStudent(student: Student): Promise<void> {
        await this.dao.update(student);
        this.students.set(student.id, student);
    }

    async deleteStudent(id: string): Promise<void> {
        await this.dao.delete(id);
        this.students.delete(id);
    }

    async addServiceToStudent(studentId: string, serviceName: string): Promise<void> {
        const student = await this.getStudent(studentId);
        if (student) {
            student.addService(serviceName);
            await this.updateStudent(student);
        }
    }

    async enrollStudentInCourse(studentId: string, course: Course): Promise<void> {
        const student = await this.getStudent(studentId);
        if (student) {
            student.enroll(course);
            await this.updateStudent(student);
        }
    }
}
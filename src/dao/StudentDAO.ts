import { Student } from '../models/Student';

export interface StudentDAO {
    save(student: Student): Promise<void>;
    findById(id: string): Promise<Student | undefined>;
    findAll(): Promise<Student[]>;
    update(student: Student): Promise<void>;
    delete(id: string): Promise<void>;
    findByEmail(email: string): Promise<Student | undefined>;
    findByCourse(courseId: string): Promise<Student[]>;
}
import { Course } from '../models/Course';

export interface CourseDAO {
    save(course: Course): Promise<void>;
    findById(id: string): Promise<Course | undefined>;
    findAll(): Promise<Course[]>;
    update(course: Course): Promise<void>;
    delete(id: string): Promise<void>;
    findByTeacher(teacherId: string): Promise<Course[]>;
    findByStudent(studentId: string): Promise<Course[]>;
    findBySubject(subject: string): Promise<Course[]>;
}
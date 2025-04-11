import { Teacher } from '../models/Teacher';

export interface TeacherDAO {
    save(teacher: Teacher): Promise<void>;
    findById(id: string): Promise<Teacher | undefined>;
    findAll(): Promise<Teacher[]>;
    findByEmail(email: string): Promise<Teacher | undefined>;
    findByCourse(courseId: string): Promise<Teacher[]>; // Changed return type
    update(teacher: Teacher): Promise<void>;
    delete(id: string): Promise<void>;
}
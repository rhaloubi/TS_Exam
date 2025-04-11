import { Course } from '../models/Course';
import { CourseDAO } from '../dao/CourseDAO';

export class IndexedDBCourseDAO implements CourseDAO {
    private dbName = 'SchoolManagementSystem';
    private storeName = 'courses';
    private db: IDBDatabase | null = null;

    private async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            };
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    store.createIndex('subject', 'subject', { unique: false });
                    store.createIndex('teacherId', 'teacher.id', { unique: false });
                }
            };
        });
    }

    async save(course: Course): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(course.toJSON());

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async findById(id: string): Promise<Course | undefined> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => 
                resolve(request.result ? Course.fromJSON(request.result) : undefined);
        });
    }

    async findAll(): Promise<Course[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => 
                resolve(request.result.map((data: any) => Course.fromJSON(data)));
        });
    }

    async update(course: Course): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(course.toJSON());

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async delete(id: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async findByTeacher(teacherId: string): Promise<Course[]> {
        const allCourses = await this.findAll();
        return allCourses.filter(course => course.teacher?.id === teacherId);
    }

    async findByStudent(studentId: string): Promise<Course[]> {
        const allCourses = await this.findAll();
        return allCourses.filter(course => 
            course.students.some(student => student.id === studentId)
        );
    }

    async findBySubject(subject: string): Promise<Course[]> {
        const allCourses = await this.findAll();
        return allCourses.filter(course => course.subject === subject);
    }
}
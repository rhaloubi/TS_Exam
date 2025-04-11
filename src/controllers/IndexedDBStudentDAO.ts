import { Student } from '../models/Student';
import { StudentDAO } from '../dao/StudentDAO';

export class IndexedDBStudentDAO implements StudentDAO {
    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async findByCourse(courseId: string): Promise<Student[]> {
        const allStudents = await this.findAll();
        return allStudents.filter(student => 
            student.enrolledCourses.some(course => course.id === courseId)
        ).map(student => Student.fromJSON(student));
    }
    private dbName = 'SchoolManagementSystem';
    private storeName = 'students';
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
                    store.createIndex('email', 'email', { unique: true });
                }
            };
        });
    }

    async save(student: Student): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(student.toJSON());

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async findById(id: string): Promise<Student | undefined> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => 
                resolve(request.result ? Student.fromJSON(request.result) : undefined);
        });
    }

    async findByEmail(email: string): Promise<Student | undefined> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('email');
            const request = index.get(email);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => 
                resolve(request.result ? Student.fromJSON(request.result) : undefined);
        });
    }

    async findAll(): Promise<Student[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => 
                resolve(request.result.map((data: any) => Student.fromJSON(data)));
        });
    }

    async update(student: Student): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(student.toJSON());

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}
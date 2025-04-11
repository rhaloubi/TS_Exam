import { Teacher } from '../models/Teacher';
import { TeacherDAO } from '../dao/TeacherDAO';

export class IndexedDBTeacherDAO implements TeacherDAO {
    private dbName = 'SchoolManagementSystem';
    private storeName = 'teachers';
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

    async save(teacher: Teacher): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(teacher.toJSON());

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async findByEmail(email: string): Promise<Teacher | undefined> {
        const allTeachers = await this.findAll();
        return allTeachers.find(teacher => teacher.email === email);
    }

    async findByCourse(courseId: string): Promise<Teacher[]> {
        const allTeachers = await this.findAll();
        return allTeachers.filter(teacher => 
            teacher.courses.some(course => course.id === courseId)
        );
    }

    async findById(id: string): Promise<Teacher | undefined> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => 
                resolve(request.result ? Teacher.fromJSON(request.result) : undefined);
        });
    }

    async findAll(): Promise<Teacher[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => 
                resolve(request.result.map((data: any) => Teacher.fromJSON(data)));
        });
    }

    async update(teacher: Teacher): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(teacher.toJSON());

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
}
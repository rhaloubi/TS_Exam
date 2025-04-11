import { v4 as uuidv4 } from 'uuid';
import { Teacher } from './Teacher';
import { Student } from './Student';
import { Resource } from './Resource';

export class Course {
    private _id: string;
    private _teacher?: Teacher;
    private _students: Student[] = [];
    private _resources: Resource[] = [];

    constructor(
        private _title: string,
        private _subject: string
    ) {
        this._id = uuidv4();
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get subject(): string {
        return this._subject;
    }

    get teacher(): Teacher | undefined {
        return this._teacher;
    }

    get students(): Student[] {
        return [...this._students];
    }

    get resources(): Resource[] {
        return [...this._resources];
    }

    assignTeacher(teacher: Teacher): void {
        this._teacher = teacher;
    }

    addStudent(student: Student): void {
        if (!this._students.includes(student)) {
            this._students.push(student);
        }
    }

    assignResource(resource: Resource): void {
        if (!this._resources.includes(resource)) {
            this._resources.push(resource);
            resource.addCourse(this);
        }
    }
}
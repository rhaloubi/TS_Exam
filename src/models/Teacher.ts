import { v4 as uuidv4 } from 'uuid';
import { Course } from './Course';
export class Teacher {
    private _id: string;
    private _courses: Course[] = [];

    constructor(
        private _name: string,
        private _email: string
    ) {
        this._id = uuidv4();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get courses(): Course[] {
        return [...this._courses];
    }

    assignCourse(course: Course): void {
        if (!this._courses.includes(course)) {
            this._courses.push(course);
            course.assignTeacher(this);
        }
    }
}
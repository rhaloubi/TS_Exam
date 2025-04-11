import { v4 as uuidv4 } from 'uuid';
import { Course } from './Course';
export class Student {
    private _id: string;
    private _enrolledCourses: Course[] = [];
    private _extraServices: string[] = [];

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

    get enrolledCourses(): Course[] {
        return [...this._enrolledCourses];
    }

    get extraServices(): string[] {
        return [...this._extraServices];
    }

    enroll(course: Course): void {
        if (!this._enrolledCourses.includes(course)) {
            this._enrolledCourses.push(course);
            course.addStudent(this);
        }
    }

    addService(serviceName: string): void {
        if (!this._extraServices.includes(serviceName)) {
            this._extraServices.push(serviceName);
        }
    }
}
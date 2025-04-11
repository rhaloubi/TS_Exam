import { v4 as uuidv4 } from 'uuid';
import { Course } from './Course';

export class Resource {
    private _id: string;
    private _courses: Course[] = [];

    constructor(
        private _name: string,
        private _type: string,
        private _available: boolean = true
    ) {
        this._id = uuidv4();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get type(): string {
        return this._type;
    }

    get available(): boolean {
        return this._available;
    }

    get courses(): Course[] {
        return [...this._courses];
    }

    allocate(): void {
        if (!this._available) {
            throw new Error('Resource is not available');
        }
        this._available = false;
    }

    release(): void {
        this._available = true;
    }

    addCourse(course: Course): void {
        if (!this._courses.includes(course)) {
            this._courses.push(course);
        }
    }
}
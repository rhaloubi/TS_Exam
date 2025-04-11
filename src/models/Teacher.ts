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

    toJSON() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            courses: this._courses.map(course => ({
                id: course.id,
                title: course.title,
                subject: course.subject
            }))
        };
    }

    static fromJSON(json: any): Teacher {
        const teacher = new Teacher(json.name, json.email);
        teacher._id = json.id;
        if (json.courses) {
            teacher._courses = json.courses.map((c: any) => 
                Object.assign(new Course(c.title, c.subject), { _id: c.id }));
        }
        return teacher;
    }
}
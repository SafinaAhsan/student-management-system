#! /usr/bin/env node
export { Student, Instructor, Courses }
class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age
    }
    getName() {
        return this.name
    }
}

class Student extends Person {
    courses: string[] = [];
    balance:number=3000
    id:number=Math.floor(Math.random()*100000)
    
    constructor(name: string, age: number) {
        super(name, age)
   }
    registerForCourses(course: Courses) {
        this.courses.push(course.name)
        this.balance-=course.fees
    }
    addStudents(course: Courses) {
        course.setStudents(this)
    }
}

class Instructor extends Person {
  courses: string[] = []
  id:number=Math.floor(Math.random()*100000)
    constructor(name: string, age: number) {
        super(name, age)
        
    }
    assignCourse(course: Courses) {
        this.courses.push(course.name)
    }
    addTeacherInCourse(course: Courses) {
        course.setInstructor(this)
    }
}

class Courses {
    name: string;
    fees: number;
    timings: string;
    students: string[] = []
    instructors: string[] = []
    id:number=Math.floor(Math.random()*100000)
    constructor(name: string, fees: number, timings: string) {
        this.name = name;
        this.fees = fees;
        this.timings = timings;
       }
    enrollStudents(student: Student) {
        student.registerForCourses(this)
    }
enrollInstructors(instructors: Instructor) {
        instructors.assignCourse(this);
    }
    setStudents(student: Student) {
        this.students.push(student.name)
    }
    setInstructor(instructor: Instructor) {
        this.instructors.push(instructor.name)
    }
}






import inquirer from "inquirer";
import { Student, Instructor, Courses } from "./main.js";
import chalk from "chalk";

let students: Student[] = [];
let teachers: Instructor[] = [];
let courses: Courses[] = [];

console.log(chalk.red("\tSTUDENT MANAGEMENT SYSTEM\t"));

const askForAddBalance = async (typeOrCourseIndex: string , studentIndex?: string) => {
    if (typeOrCourseIndex === "add-direct") {
        const bal = await inquirer.prompt({
            type: "input",
            name: "balance",
            message: "Enter the index of the student you want to add balance to"
        })
        if (bal.balance < students.length) {
            const addBalance = await inquirer.prompt({
                type: "number",
                name: "amount",
                message: "Enter the amount you wanot to add"
            })
            students[bal.balance].balance += addBalance.amount
        }
    }
      else if (studentIndex) {
        const choice = await inquirer.prompt({
            type: "list",
            name: "choice",
            message: "Would you like to add balance",
            choices: ["Yes", "No"]
        })
        if (choice.choice == "Yes") {
            let currentStudent = students[Number(studentIndex)]

            const addBalance = await inquirer.prompt({
                type: "number",
                name: "amount",
                message: "Enter the amount you want to add"
            })

            currentStudent.balance += addBalance.amount

            const enroll = await inquirer.prompt({
                type: "list",
                name: "choice",
                message: "Would you like to enroll again",
                choices: ["Yes", "No"]
            })
            if (enroll.choice == "Yes") {
                let currentCourse = courses[Number(typeOrCourseIndex)]

                currentStudent.addStudents(currentCourse)
                currentStudent.registerForCourses(currentCourse)

                console.table(courses)
                console.table(students)
            }
        }
    }
}

const mainMenu = async () => {
    const options = await inquirer.prompt({
        type: "list",
        name: "choices",
        message: "Select One",
        choices: ["Student", "Teacher", "Courses"],
    });

    if (options.choices === "Student") {
        const stud = await inquirer.prompt({
            type: "list",
            name: "student",
            message: "Select One",
            choices: ["Add Student", "View Student"],
        });

        if (stud.student === "Add Student") {
            const add = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Enter Name",
                },
                {
                    type: "input",
                    name: "age",
                    message: "Enter Age",
                },
            ]);
            const student = new Student(add.name, add.age);
            students.push(student);
//            console.log(students);
            console.log("Student Added Successfully");
        } else if (stud.student === "View Student") {
            if (students.length === 0) {
                console.log("No Students to show.");
                return false
            } else {
                console.table(students);
            }
            const ques = await inquirer.prompt({
                name: "options",
                type: "list",
                message: "Would you like to enroll in course or delete student or Exit",
                choices: ["Enroll in course", "Delete student", "Add Balance", "Exit"]
            })
            if (ques.options == "Exit") {
                return false
            }
            if (ques.options == "Add Balance") {
                await askForAddBalance("add-direct")
            }
            if (ques.options == "Delete student") {
                const ques = await inquirer.prompt({
                    type: "number",
                    name: "options",
                    message: "Enter the Index of the student You want to delete"
                })
                if (ques.options < students.length) {

                    courses.map((courseObj, index) => {
                        let findIndexOfStudent: number = courseObj.students.findIndex((studentName) => {
                            return studentName === students[ques.options].name
                        })
                        if (findIndexOfStudent !== -1) {
                            courses[index].students.splice(findIndexOfStudent, 1)
                        }
                    })
                    students.splice(ques.options, 1)
                }
                else {
                    console.log("Invalid Command");
                }
            }
            if (ques.options == "Enroll in course") {
                if (courses.length === 0) {
                    console.log("There are no courses")
                    return false;
                }
                console.table(courses)
                const ques = await inquirer.prompt([{
                    type: "number",
                    name: "options",
                    message: "Enter the index number of the student you want to enroll"
                },
                {
                    type: "number",
                    name: "index",
                    message: "Enter the index number of the course in which you want to enroll student"
                }])

                if (ques.options < students.length && ques.index < courses.length) {
                    let currentStudent = students[ques.options]
                    let currentCourse = courses[ques.index]
                    if (currentCourse.fees < currentStudent.balance) {

                        currentStudent.addStudents(currentCourse)
                        currentStudent.registerForCourses(currentCourse)

                        console.table(courses)
                        console.table(students)
                    } else {
                        console.log("You don't have sufficeint balance");
                        await askForAddBalance(ques.options.toString(), ques.index.toString())
                    }
                }
            }
        }

    } else if (options.choices === "Teacher") {
        const teacher = await inquirer.prompt({
            type: "list",
            name: "teacher",
            message: "Select One",
            choices: ["Add Teacher", "View Teacher"],
        });

        if (teacher.teacher === "Add Teacher") {
            const add = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Enter Name",
                },
                {
                    type: "input",
                    name: "age",
                    message: "Enter Age",
                },
            ]);
            const Teacher = new Instructor(add.name, add.age);
            teachers.push(Teacher);
            console.log("Teacher Added Successfully");
        } else if (teacher.teacher === "View Teacher") {
            if (teachers.length === 0) {
                console.log("No Teachers to show.");
                return false
            } else {
                console.table(teachers);
            }

            const ques = await inquirer.prompt({
                name: "options",
                type: "list",
                message: "d you d you like to Assign or delete instructor or Exit",
                choices: ["Assign Instructor", "Delete Instructor", "Exit"]
            })
            if (ques.options == "Exit") {
                return false
            }
            if (ques.options == "Assign Instructor") {
                if (courses.length === 0) {
                    console.log("There are no courses")
                    return false;
                }
                console.table(teachers);
                const ques = await inquirer.prompt([{
                    type: "number",
                    name: "options",
                    message: "Enter the index number of the teacher you want to assign"
                },
                {
                    type: "number",
                    name: "index",
                    message: "Enter the index number of the course in which you want to assign teacher"
                }])
                if (ques.options < teachers.length && ques.index < courses.length) {
                    let currentTeacher = teachers[ques.options]
                    let currentCourse = courses[ques.index]

                    currentTeacher.addTeacherInCourse(currentCourse)
                    currentTeacher.assignCourse(currentCourse)

                    console.table(courses)
                    console.table(teachers)
                }
                else {
                    "Invalid command "
                }
            }
            if (ques.options == "Delete Instructor") {
                const ques = await inquirer.prompt({
                    type: "number",
                    name: "options",
                    message: "Enter the Index of the instructor You want to delete"
                })
                if (ques.options < teachers.length) {
                    courses.map((courseObj, index) => {
                        let findIndexOfInstructor: number = courseObj.instructors.findIndex((instructorName) => {
                            return instructorName === teachers[ques.options].name
                        })
                        if (findIndexOfInstructor !== -1) {
                            courses[index].instructors.splice(findIndexOfInstructor, 1)
                        }
                    })
                    teachers.splice(ques.options, 1)
                }
                else {
                    console.log("Invalid Command");
                }
            }
        }
    } else if (options.choices === "Courses") {
        const course1 = await inquirer.prompt({
            type: "list",
            name: "courses",
            message: "Select One",
            choices: ["Add Course", "View Course"],
        });

        if (course1.courses === "Add Course") {
            const add = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Enter Name",
                },
                {
                    type: "input",
                    name: "fees",
                    message: "Enter Fees",
                },
                {
                    type: "input",
                    name: "timings",
                    message: "Enter Time",
                },
            ]);
            const Course = new Courses(add.name, add.fees, add.timings);
            courses.push(Course);
 console.log("Course Added Successfully");
        } else if (course1.courses === "View Course") {
            if (courses.length === 0) {
                console.log("No Courses to show.");
                return false
            } else {
                console.table(courses);
            }
            const ques = await inquirer.prompt({
                name: "options",
                type: "list",
                message: "Would you like to delete course or Exit",
                choices: ["Delete course", "Exit"]
            })
            if (ques.options == "Exit") {
                return false
            }
            if (ques.options == "Delete course") {
                const ques = await inquirer.prompt({
                    type: "number",
                    name: "options",
                    message: "Enter the Index of the course You want to delete"
                })
                if (ques.options < courses.length) {
                    teachers.map((teacherObj, index) => {
                        let findIndexOfCourses: number = teacherObj.courses.findIndex((teacherName) => {
                            return teacherName === courses[ques.options].name
                        })
                        if (findIndexOfCourses !== -1) {
                            teachers[index].courses.splice(findIndexOfCourses, 1)
                        }
                    })
                    students.map((studentObj, index) => {
                        let findIndexOfCourses: number = studentObj.courses.findIndex((courseData) => {
                            return courseData === courses[ques.options].name
                        })
                        if (findIndexOfCourses !== -1) {
                            students[index].courses.splice(findIndexOfCourses, 1)
                        }
                    })
                    courses.splice(ques.options, 1)
                }
                else {
                    console.log("Invalid Command");
                }
            }
        }
    }
    const cont = await inquirer.prompt({
        type: "list",
        name: "continue",
        message: "Would you like to continue?",
        choices: ["yes", "no"]
    })
    if (cont.continue == "yes") {
        mainMenu()
    };
}

// Call the main menu to start the program
mainMenu();

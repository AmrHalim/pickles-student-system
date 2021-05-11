
import { inject, injectable } from "inversify";
import { Filter, Paginate, Sort } from "../dto/FilterSortPagination";
import { StudentModelDTO } from "../dto/Student";
import { IStudentRepository } from "../repositories/IStudentRepository";
import { ContainerTypes } from "../types/Container";
import IStudentService from "./IStudentService";
import { StudentFields, FilterOperations } from "../enums";
import { BadRequestError } from "../errors/Errors";

@injectable()
export default class StudentService implements IStudentService {

    // Inject studentRepository
    constructor(@inject(ContainerTypes.StudentRepository) private studentRepository: IStudentRepository) { }

    /**
     * Create a student
     * Only create a student if the email doesn't exist in the database
     */
    public async createStudent(student: StudentModelDTO): Promise<StudentModelDTO> {

        // Check if email exists 
        let studentEmailCount: number = await this.studentRepository.count([
            {
                operator: FilterOperations.EQUAL,
                field: StudentFields.EMAIL,
                value: student.email
            }
        ]);

        // Check if any students found with that email
        if (studentEmailCount > 0) {

            throw new BadRequestError(`Email is already being used by another student.`);
        }

        // No students found with this email, create student
        return await this.studentRepository.insert(student);
    }

    // List students
    public async listStudents(filter?: Filter[], sort?: Sort, pagination?: Paginate): Promise<StudentModelDTO[]> {

        return this.studentRepository.findAll(filter, sort, pagination);
    }
}
import { Filter, Paginate, Sort } from "../dto/FilterSortPagination";
import { StudentModelDTO } from "../dto/Student";

export default interface IStudentService {

    createStudent(student: StudentModelDTO): Promise<StudentModelDTO>;
    listStudents(filter?: Filter[], sort?: Sort, pagination?: Paginate): Promise<StudentModelDTO[]>;
}
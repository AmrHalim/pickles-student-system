
import { StudentModelDTO } from "../dto/Student";
import { IRepository } from "./IRepository";

export interface IStudentRepository extends IRepository<StudentModelDTO> { }
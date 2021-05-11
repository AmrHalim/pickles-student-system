import { injectable } from 'inversify';
import Repository from "./Repository";
import { StudentModelDTO } from '../dto/Student';
import { StudentModel } from "../models/StudentModel";
import { IStudentRepository } from './IStudentRepository';

@injectable()
export default class StudentRepository extends Repository<StudentModelDTO> implements IStudentRepository {

    constructor() {

        super(StudentModel);
    }
}
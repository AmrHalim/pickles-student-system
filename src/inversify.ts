import { Container } from 'inversify';
import { ContainerTypes } from './types/Container';

import { StudentController } from "./controllers/StudentController";

import { IStudentRepository } from './repositories/IStudentRepository';
import StudentRepository from './repositories/StudentRepository';
import IStudentService from './services/IStudentService';
import StudentService from './services/StudentService';

const container = new Container();

container.bind(StudentController).to(StudentController);

container.bind<IStudentRepository>(ContainerTypes.StudentRepository).to(StudentRepository);
container.bind<IStudentService>(ContainerTypes.StudentService).to(StudentService);

export default container;
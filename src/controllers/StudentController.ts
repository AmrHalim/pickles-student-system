import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import * as Joi from "joi";

import { StudentModelDTO } from "../dto/Student";
import { ContainerTypes } from '../types/Container';

import { Filter, Sort, Paginate } from "../dto/FilterSortPagination";

import { StudentFields, RequestSortDirections, FilterOperations, PaginationDefaults } from "../enums";
import IStudentService from '../services/IStudentService';
import { BadRequestError } from '../errors/Errors';

@injectable()
export class StudentController {

    // Inject student service
    constructor(@inject(ContainerTypes.StudentService) private studentService: IStudentService) { }

    // Create student
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {

        // Define validation schema for creating a student
        const createStudentSchema = Joi.object({
            name: Joi.string()
                .min(1)
                .max(30)
                .required(),

            email: Joi.string()
                .required()
                .email(),

            age: Joi.number()
                .integer()
                .min(17)
                .max(2013)
        });

        // Validate schema
        let result = createStudentSchema.validate(req.body);

        // Check if validation didn't pass
        if (result.error) {

            // Send bad request error
            return next(new BadRequestError(`Invalid request: ${result.error.message}.`));
        }

        // Get validated values from Joi
        const { email, name, age } = result.value;

        // Prepare student object
        const student: StudentModelDTO = {
            email,
            name,
            age
        };

        // Call studentService to create student
        let object = await this.studentService.createStudent(student)
            .catch(err => next(err));

        // Check if student was created to only send success response ..
        // .. in case of no errors
        if (object) {

            // Send response
            res.status(200).send({
                message: "Student created!",
                data: object
            });
        }
    }

    // List students
    public async list(req: Request, res: Response, next: NextFunction): Promise<void> {

        // Define validation schema for listing students
        const createStudentSchema = Joi.object({

            // Oprtionally allow filtering by age parameter
            age: Joi.object()
                .keys(
                    {
                        value: Joi.number()
                            .required(),
                        // Operator to be one a string of this list, defaults to =
                        operator: Joi.string()
                            .valid(
                                FilterOperations.GREATER_THAN,
                                FilterOperations.LESS_THAN,
                                FilterOperations.EQUAL)
                            .default(FilterOperations.EQUAL)
                    }
                )
                .optional(),

            // Pagination parameters
            // Limit to be a number and maximum 50 records, and defaults to 10
            limit: Joi.number()
                .max(PaginationDefaults.LIMIT_MAX)
                .default(PaginationDefaults.LIMIT_DEFAULT)
                .optional(),

            // Page to be a positive number and defaults to 1
            page: Joi.number()
                .min(PaginationDefaults.PAGE_MIN)
                .default(PaginationDefaults.PAGE_DEFAULT)
                .optional(),

            // Allow sorting the results
            sort: Joi.object()
                .keys(
                    {
                        field: Joi.string()
                            .valid(StudentFields.AGE, StudentFields.NAME)
                            .required(),
                        // Direction to be ASC or DESC , defaults to ASC
                        direction: Joi.string()
                            .valid(RequestSortDirections.DESC, RequestSortDirections.ASC)
                            .default(RequestSortDirections.ASC)
                    }
                )
                .optional()
        });

        // Validate schema
        let result = createStudentSchema.validate(req.body);

        // Check if validation didn't pass
        if (result.error) {

            // Send bad request error
            return next(new BadRequestError(`Invalid request: ${result.error.message}.`));
        }

        // Get validated values from Joi
        const { age, sort, page, limit } = result.value;

        // Define filterObject with an empty array
        let filterObject: Filter[] = [];

        // Check if age parameter is sent to add it to filterObject
        if (age) {

            // Add filter for age
            filterObject.push({
                operator: age.operator,
                value: age.value,
                field: StudentFields.AGE
            })
        }

        // Define sortObject with null
        let sortObject: Sort = null;

        // Check if sort parameter is sent to populate sortObject
        if (sort) {

            // Populate sort object
            sortObject = {
                field: sort.field,
                direction: sort.direction
            }
        }

        // Define paginationObject
        const paginationObject: Paginate = {
            page: page,
            limit: limit,
            skip: (page - 1) * limit
        }

        // Call studentService to get data
        let students = await this.studentService.listStudents(filterObject, sortObject, paginationObject)
            .catch(err => next(err));

        // Check if students were listed to only send success response ..
        // .. if no error occured
        if (students) {

            // Send response
            res.status(200).send({
                message: "Students listed successfully!",
                data: students
            });
        }
    }
}
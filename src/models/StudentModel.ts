
import { StudentModelDTO } from "../dto/Student";
import { Table, Model, Column, PrimaryKey, AutoIncrement } from "sequelize-typescript";

@Table({
    tableName: "student",
    timestamps: false
})
export class StudentModel extends Model<StudentModelDTO> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id?: number;

    @Column
    name: string;

    @Column
    email: string;

    @Column
    age: number;
}
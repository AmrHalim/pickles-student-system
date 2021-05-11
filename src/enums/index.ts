export enum StudentFields {
    ID = "id",
    NAME = "name",
    EMAIL = "email",
    AGE = "age",
}

export enum RequestSortDirections {
    ASC = 1,
    DESC = -1
}

export enum DatabaseSortDirections {
    ASC = "ASC",
    DESC = "DESC"
}

export enum FilterOperations {
    GREATER_THAN = "gt",
    LESS_THAN = "lt",
    EQUAL = "eq"
}

export enum PaginationDefaults {
    LIMIT_DEFAULT = 10,
    LIMIT_MAX = 50,
    PAGE_DEFAULT = 1,
    PAGE_MIN = 1
}
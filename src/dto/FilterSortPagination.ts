interface IFilter {
    operator: string;
    value: any;
    field: string;
}
export class Filter implements IFilter {
    operator: string;
    value: any;
    field: string;
}

interface ISort {
    direction: any;
    field: string;
}
export class Sort implements ISort {
    direction: number;
    field: string;
}

interface IPaginate {
    page: number;
    limit: number;
    skip: number;
}

export class Paginate implements IPaginate {
    page: number;
    limit: number;
    skip: number;
}
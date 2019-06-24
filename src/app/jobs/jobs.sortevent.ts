import { SortMeta } from './jobs.sortmeta';



export interface SortEvent {

    data?: any[];

    mode?: string;

    field?: string;

    order?: number;

    multiSortMeta?: SortMeta[];

}
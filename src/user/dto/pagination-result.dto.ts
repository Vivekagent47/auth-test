// import { Recruiter } from '../recruiter.entity';
// import { Student } from '../student.entity';

// type Profile = Recruiter | Student;

export class PaginatedResultDto<T> {
  data: Array<T>;
  currPage: number;
  prevPage: number;
  nextPage: number;
  totalPages: number;
  limit: number;
  totalCount: number;
}

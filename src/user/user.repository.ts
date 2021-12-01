import { Repository, EntityRepository } from 'typeorm';
import { Recruiter } from './recruiter.entity';
import { Student } from './student.entity';
import { User } from './user.entity';

/**
 * User repository class
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {}

/**
 * Student repository class
 */
@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {}

/**
 * Recruiter repository class
 */
@EntityRepository(Recruiter)
export class RecruiterRepository extends Repository<Recruiter> {}

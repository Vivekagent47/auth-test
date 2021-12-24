import { Repository, EntityRepository } from 'typeorm';
import { KYC } from './kyc.entity';
import { Recruiter } from './recruiter.entity';
import { Student } from './student.entity';
import { User } from './user.entity';
import { Education } from './education.entity';
import { Experience } from './experience.entity';

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

/**
 * KYC repository class
 */
@EntityRepository(KYC)
export class KYCRepository extends Repository<KYC> {}

/**
 * Education repository class
 */
@EntityRepository(Education)
export class EducationRepository extends Repository<Education> {}

/**
 * Experience repository class
 */
@EntityRepository(Experience)
export class ExperienceRepository extends Repository<Experience> {}

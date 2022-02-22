import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { Student } from './student.entity';
import { Recruiter } from './recruiter.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from '.';
import { Company } from './company.entity';
import { KycDto } from './dto/kyc.dto';
import { Education } from './education.entity';
import { Experience } from './experience.entity';
import { AdminDto } from '../auth/dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { Internship } from '../internship/internship.entity';
import { InternshipService } from '../internship/internship.service';
import { PaginationDto } from './dto/pagination.dto';

/**
 * User service
 */
@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,

    private internshipService: InternshipService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,

    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * create user
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.roles = ['user'];
    user.isActive = true;
    user.userType = userData.userType;
    user.mobileNumber = userData.mobileNumber ? userData.mobileNumber : '';
    user.countryCode = userData.countryCode ? userData.countryCode : '';
    user.password = await this.hashPassword(userData.password);
    user.profile = '';

    try {
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * create a admin
   */
  async createAdmin(userData: AdminDto): Promise<User> {
    const user = new User();
    user.firstName = 'admin';
    user.lastName = 'admin';
    user.email = userData.email;
    user.roles = ['admin'];
    user.password = await this.hashPassword(userData.password);

    // check the admintoken from the config
    if (userData.adminToken !== this.configService.get<string>('ADMIN_TOKEN')) {
      throw new Error('Invalid admin token');
    }

    try {
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async initialStudentProfile(id: string): Promise<Student> {
    const profile = new Student();
    profile.gender = 'male';
    profile.currentLocation = '';
    profile.title = '';
    profile.discription = '';
    profile.socials = '';
    profile.protfolios = '';
    profile.discription = '';
    profile.advancedSkills = [];
    profile.begnierSkills = [];
    profile.appliedJobs = [];
    profile.intermediateSkills = [];
    profile.experience = [];
    profile.education = [];

    try {
      const temp = await this.studentRepository.save(profile);
      await this.userRepository.update(id, { profile: temp.id });
      return temp;
    } catch (error) {
      throw new Error(error);
    }
  }

  async initialRecruiterProfile(id: string): Promise<Recruiter> {
    const profile = new Recruiter();
    profile.gender = 'male';
    profile.currentLocation = '';
    profile.kyc = '';
    profile.postedInternship = [];

    try {
      const temp = await this.recruiterRepository.save(profile);
      await this.userRepository.update(id, { profile: temp.id });
      return temp;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * get user and the profile by id
   */
  async getUserById(id: string): Promise<any> {
    const user = await this.userRepository.findOne(id);
    delete user.password;
    let profile = {};
    if (user.profile !== '') {
      profile =
        user.userType === 'student'
          ? await this.studentRepository.findOne({ id: user.profile })
          : await this.recruiterRepository.findOne({ id: user.profile });
    }

    return { ...user, profile };
  }

  /**
   * get user by email
   */
  getUserByEmail(email): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * encrypt password
   */
  hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject(null);
        }

        bcrypt.hash(password, salt, (err2, hash) => {
          return err2 ? reject(null) : resolve(hash);
        });
      });
    });
  }

  /**
   * compare user password hash
   */
  checkPassword(user: User, password: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, ok) => {
        return error || !ok ? resolve(false) : resolve(true);
      });
    });
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<any>) {
    if (
      data.password ||
      data.roles ||
      data.isActive ||
      data.userType ||
      data.profile
    ) {
      throw new Error(
        'You can not update password, roles, isActive, userType or profile',
      );
    }

    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    await this.userRepository.update(id, data);

    const newUser = await this.getUserById(id);
    delete newUser.password;
    return newUser;
  }

  /**
   * Update Password
   */
  async updatePassword(id: string, data: UpdatePasswordDto) {
    const user = await this.getUserByEmail(data.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (id !== user.id) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('User is not active');
    }

    const isMatched = await this.checkPassword(user, data.prvPassword);

    if (!isMatched) {
      throw new Error('Invalid Old Password');
    }

    const hashNew = await this.hashPassword(data.newPassword);

    try {
      await this.userRepository.update(user.id, { password: hashNew });
      return {
        success: true,
        message: 'Password Changed Successfully',
      };
    } catch {
      throw new Error('Some error');
    }
  }

  async updateRole(id: string, data: { roles: UserRole[] }) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (id !== user.id) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('User is not active');
    }

    try {
      await this.userRepository.update(user.id, { roles: data.roles });
      return {
        success: true,
        message: 'Role Changed Successfully',
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteUser(id: string) {
    try {
      const data = await this.getUserById(id);
      if (data.userType === 'student') {
        await this.studentRepository.delete(data.profile.id);
        for (let i = 0; i < data.profile.education.length; i++) {
          await this.educationRepository.delete(data.profile.education[i]);
        }

        for (let i = 0; i < data.profile.experience.length; i++) {
          await this.experienceRepository.delete(data.profile.experience[i]);
        }
      } else {
        if (data.profile.kyc !== '') {
          await this.companyRepository.delete(data.profile.kyc);
        }
        await this.recruiterRepository.delete(data.profile.id);
      }
      await this.userRepository.delete(data.id);
      return {
        success: true,
        message: 'User Deleted Successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async applyKyc(
    token: string,
    data: KycDto,
  ): Promise<{ success: boolean; message: string }> {
    let payLoad: any;
    try {
      payLoad = await this.jwtService.verify(token.split(' ')[1]);
    } catch (err) {
      throw new Error('Invalid token');
    }

    const { profile, userType } = await this.getUserById(payLoad.userId);

    if (userType !== 'recruiter') {
      throw new Error('Not authorized');
    }

    if (profile.kyc === '' && userType === 'recruiter') {
      const companyData = new Company();
      companyData.kycStatus = false;
      companyData.companyName = data.companyName;
      companyData.establishmentDate = data.establishmentDate;
      companyData.companySize = data.companySize;
      companyData.headOffice = data.headOffice;
      companyData.branchOffice = data.branchOffice;
      companyData.aboutCompany = data.aboutCompany;
      companyData.socials = this.jsonToString(data.socials);

      try {
        const res = await this.companyRepository.save(companyData);
        console.log(res);
        await this.recruiterRepository.update(profile.id, {
          kyc: res.id,
        });

        return {
          success: true,
          message: 'KYC Applied Successfully',
        };
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new Error('Not allowed to apply kyc');
    }
  }

  async applieInternship(
    userId: string,
    internshipId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { profile } = await this.getUserById(userId);
      const student = await this.studentRepository.findOne(profile.id);
      if (!student) {
        throw new Error('Student not found');
      }

      student.appliedJobs.push(internshipId);
      await this.studentRepository.update(student.id, student);

      return {
        success: true,
        message: 'Internship applied successfully',
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async createInternship(
    userId: string,
    internshipID: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { profile } = await this.getUserById(userId);
      const recuiter = await this.recruiterRepository.findOne(profile.id);

      if (!recuiter) {
        throw new Error('Invalid credentials');
      }

      recuiter.postedInternship.push(internshipID);
      await this.recruiterRepository.update(recuiter.id, recuiter);

      return {
        success: true,
        message: 'Internship Posted Successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  jsonToString(json_arr: any[]): string {
    let jsonArr_string = '[';
    for (let i = 0; i < json_arr.length; i++) {
      jsonArr_string += JSON.stringify(json_arr[i]);
      if (i < json_arr.length - 1) {
        jsonArr_string += ',';
      }
    }
    jsonArr_string += ']';
    return jsonArr_string;
  }

  async getKycDeatils(id: string) {
    const { profile } = await this.getUserById(id);
    try {
      const kyc = await this.companyRepository.findOne(profile.kyc);
      kyc.socials = JSON.parse(kyc.socials);
      return kyc;
    } catch (err) {
      throw new Error(err);
    }
  }

  async verifyKyc(id: string): Promise<{ success: boolean; message: string }> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // if (user.userType !== 'recruiter') {
    //   throw new Error('Invalid credentials');
    // }

    const company = await this.companyRepository.findOne(user.profile.kyc);

    if (!company) {
      throw new Error('KYC is not applied');
    }

    try {
      await this.companyRepository.update(company.id, { kycStatus: true });
      return {
        success: true,
        message: 'KYC Verified Successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getStudentProfile(id: string) {
    const { profile } = await this.getUserById(id);
    try {
      let temp = [];
      for (let i = 0; i < profile.education.length; i++) {
        temp.push(await this.educationRepository.findOne(profile.education[i]));
      }
      profile.education = temp;

      temp = [];
      for (let i = 0; i < profile.experience.length; i++) {
        temp.push(
          await this.experienceRepository.findOne(profile.experience[i]),
        );
      }
      profile.experience = temp;

      return profile;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * get all the companies with verified kyc status
   */
  async getAllCompanies(): Promise<Company[]> {
    try {
      const companies = await this.companyRepository
        .createQueryBuilder('company')
        .where('company.kycStatus = :kycStatus', { kycStatus: true })
        .getMany();

      return companies;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * get count of companies, internships and students
   */
  async getDashboardDetails(): Promise<{
    countCompanies: number;
    countInternships: number;
    countStudents: number;
    countApplicationRate: number;
  }> {
    try {
      const countCompanies = await this.companyRepository.count({
        kycStatus: true,
      });

      const countInternships = await this.internshipService.countInternships();

      const countStudents = await this.studentRepository.count();

      const internships = await this.internshipService.getRawInternships();

      let totalViewsCount = 0;

      for(let internship of internships) {
        const views = await this.internshipService.getViews(internship.id);
        totalViewsCount += views;
      }

      const countApplicationRate=(countInternships/totalViewsCount)*100

      return {
        countCompanies,
        countInternships,
        countStudents,
        countApplicationRate
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRecruiterDashboard(user : User) : Promise<any>{
    const userPayload = await this.getUserById(user.id);

    // check the user is a recruiter or not

    if(userPayload.userType !== 'recruiter'){
      throw new UnauthorizedException('Not allowed to access this route');
    }

    // get the count of posted internships

    const countInternships = userPayload.profile.postedInternship.length;
    
    // get all the internship id's from the profile.
    // and count all the applicants for each internship as totalApplicants

    // const totalApplicants = await profile.postedInternship.reduce(async (acc : number, internshipId : string) => {
    //   const internship = await this.internshipService.getInternshipById(user, internshipId);
    //   return acc + internship.applicant.length;
    // })

    let totalApplicants : number = 0;
    let totalViews : number = 0;


    for(const internhipId of userPayload.profile.postedInternship) {
      const internship = await this.internshipService.getInternshipById(user, internhipId);
      totalApplicants += internship.applicant.length;
      totalViews += internship.viewCount;
    }
    
    const applicationRate = (countInternships/totalApplicants)*100

    return {
      countInternships,
      totalApplicants,
      totalViews,
      applicationRate
    }
  }

  async getAllApplicants(userPayload : User) {

    const user = await this.getUserById(userPayload.id);
    
    if(user.userType !== 'recruiter'){
      throw new UnauthorizedException('Not allowed to access this route');
    }

    let data = [];

    for(const internhipId of user.profile.postedInternship) {
      const internship = await this.internshipService.getInternshipById(user, internhipId);
      for(const applicant of internship.applicant) {
        const { userId } = await this.internshipService.getApplyInternship(applicant);
        const studentUser = await this.getUserById(userId);
        data.push(studentUser);
      }
    }

    return {
      data
    }
  }

}

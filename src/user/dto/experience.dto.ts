import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type Status = 'pursuing' | 'completed';

export type ExpType = 'job' | 'internship' | 'freelance' | 'training';

export class Experience {
  @IsNotEmpty()
  @ApiProperty({ enum: ['job', 'internship', 'freelance', 'training'] })
  readonly experienceType: ExpType;

  @IsNotEmpty()
  @ApiProperty({ enum: ['pursuing', 'completed'] })
  readonly experienceStatus: Status;

  @IsNotEmpty()
  @ApiProperty({ example: 'Fullstack Developer' })
  readonly designation: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Google' })
  readonly company: string;

  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly startDate: Date;

  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly endDate: Date;

  @ApiProperty()
  readonly description: string;
}

import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type Status = 'pursuing' | 'completed';

export class EducationDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly instituteName: string;

  @IsNotEmpty()
  @ApiProperty({ examples: ['B.Tech', 'M.Tech'] })
  readonly degree: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly fieldOfStudy: string;

  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly startDate: Date;

  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly endDate: Date;

  @IsNotEmpty()
  @ApiProperty({ enum: ['pursuing', 'completed'] })
  readonly status: Status;
}

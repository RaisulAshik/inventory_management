import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ProcessCreditNoteDto {
  @ApiProperty({ example: 'CN-2024-001' })
  @IsString()
  @IsNotEmpty()
  creditNoteNumber: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0.01)
  creditAmount: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType } from '@prisma/client';

class OfferDocumentDto {
  @ApiProperty({ example: 'NATIONAL_ID', enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ example: 'https://cdn.example.com/docs/123/national-id.jpg' })
  @IsUrl()
  documentUrl: string;
}

export class AcceptOfferDto {
  @ApiProperty({ type: [OfferDocumentDto], description: 'Verification documents URLs the borrower submits when accepting the offer' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferDocumentDto)
  documents: OfferDocumentDto[];
}
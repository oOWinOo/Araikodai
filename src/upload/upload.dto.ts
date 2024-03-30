import { IsNotEmpty } from 'class-validator';

export class PresignedPutDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  contentType: 'image/jpeg' | 'image/png' | 'image/svg';
}

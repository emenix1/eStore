import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterRequest {
  @IsString()
  @IsNotEmpty()
  @Length(2, 32)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;
}

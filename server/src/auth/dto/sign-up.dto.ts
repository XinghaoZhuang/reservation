import { IsString, IsPhoneNumber, Min } from "class-validator";


export class SignUpDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @Min(8)
  password: string;
}

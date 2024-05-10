import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsPhoneNumber } from "class-validator";


export class LoginDto {
  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}

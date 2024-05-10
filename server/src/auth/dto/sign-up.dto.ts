import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsPhoneNumber, Min } from "class-validator";


export class SignUpDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsString()
  @Min(8)
  password: string;
}

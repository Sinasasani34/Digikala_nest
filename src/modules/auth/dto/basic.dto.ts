import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsString } from "class-validator";

export class SignupDto {
  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsMobilePhone(
    "fa-IR",
    {},
    { message: "فرمت شماره تماس وارد شده نادرست میباشد" },
  )
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: "ایمیل وارد شده نادرست میباشد" })
  email: string;
}

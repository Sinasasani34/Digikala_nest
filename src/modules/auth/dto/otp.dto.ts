import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString, Length } from "class-validator";

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone(
    "fa-IR",
    {},
    { message: "فرمت شماره تماس وارد شده نادرست میباشد" },
  )
  mobile: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone(
    "fa-IR",
    {},
    { message: "فرمت شماره تماس وارد شده نادرست میباشد" },
  )
  mobile: string;
  @ApiProperty()
  @IsString()
  @Length(5, 5, { message: "کد وارد شده نادرست میباشد" })
  code: string;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enum/form-type.enum";
import { CheckOtpDto, SendOtpDto } from "./dto/otp.dto";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/send-otp")
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }

  @Post("check-otp")
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  checkOtp(@Body() otpDto: CheckOtpDto) {
    return this.authService.checkOtp(otpDto);
  }
}

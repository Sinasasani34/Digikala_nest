import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { SendOtpDto } from "./dto/otp.dto";
import { randomInt } from "crypto";
import { OTPEntity } from "../user/entities/otp.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,
  ) {}

  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;

    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) {
      user = this.userRepository.create({
        mobile,
      });
      user = await this.userRepository.save(user);
    }
    await this.createOtpForUser(user);
    return {
      message: "کد یکبار مصرف با موفقیت ارسال شد",
    };
  }

  async createOtpForUser(user: UserEntity) {
    const expires_in = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();

    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException(
          "لطفا تا پایان منقضی شدن کد یکبار مصرف صبر کنید.",
        );
      }
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in: expires_in,
        userId: user.id,
      });
    }

    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;
    await this.userRepository.save(user);
  }
}

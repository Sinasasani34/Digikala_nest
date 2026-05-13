import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { CheckOtpDto, SendOtpDto } from "./dto/otp.dto";
import { randomInt } from "crypto";
import { OTPEntity } from "../user/entities/otp.entity";
import { TokenPayload } from "./types/payload.type";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,
    private jwtService: JwtService,
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

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const user = await this.userRepository.findOne({
      where: {
        mobile,
      },
      relations: {
        otp: true,
      },
    });

    if (!user || !user?.otp)
      throw new UnauthorizedException("حساب کاربری یافته نشد");

    const otp = user?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException("کد یکبار مصرف نادرست میباشد");
    if (otp?.expires_in < now)
      throw new UnauthorizedException("کد یکبار مصرف منقضی شده است");
    if (!user.mobile_verify) {
      await this.userRepository.update(
        { id: user.id },
        { mobile_verify: true },
      );
    }

    const { accessToken, refreshToken } = this.makeTokensForUser({
      id: user.id,
    });
    return {
      accessToken,
      refreshToken,
      message: "شما با موفقیت وارد شدید",
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

  makeTokensForUser(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user)
          throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید");
        return user;
      }
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید");
    } catch (error) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید");
    }
  }
}

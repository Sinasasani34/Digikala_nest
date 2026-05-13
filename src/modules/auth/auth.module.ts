import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { OTPEntity } from "../user/entities/otp.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OTPEntity]), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService, TypeOrmModule],
})
export class AuthModule {}

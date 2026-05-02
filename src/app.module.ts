import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "digikala",
      autoLoadEntities: false,
      synchronize: true,
      entities: [
        "dist/**/**/**/*.entity{.ts, .js}",
        "dist/**/**/*.entity{.ts, .js}",
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

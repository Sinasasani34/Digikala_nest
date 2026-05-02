import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { SwaggerConfigInit } from "src/config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  await app.listen(3000, () => {
    console.log("Server run: http://localhost:3000");
  });
}
bootstrap();

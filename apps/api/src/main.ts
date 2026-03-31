import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // 필수 — AuthModule이 body parser를 직접 등록
  });

  const port = process.env.PORT ?? 8000;

  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();

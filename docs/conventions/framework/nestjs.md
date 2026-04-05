# NestJS 컨벤션

## 디렉터리 구조

도메인 단위로 모듈을 분리한다. `apps/api/src/` 아래에 도메인별 폴더를 생성한다.

```
apps/api/src/
├── main.ts
├── app.module.ts
├── common/                     # 전역 공통 컴포넌트
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── <domain>/                   # 도메인별 Feature Module
    ├── <domain>.module.ts
    ├── <domain>.controller.ts
    ├── <domain>.service.ts
    ├── <domain>.repository.ts
    └── dto/
        ├── create-<domain>.dto.ts
        └── update-<domain>.dto.ts
```

## 레이어 분리

```
Request → Controller → Service → Repository → DB
```

| 레이어 | 책임 | 금지 |
|--------|------|------|
| Controller | 라우팅, 요청/응답 처리, DTO 바인딩 | 비즈니스 로직 |
| Service | 비즈니스 로직 전담 | DB 직접 접근 |
| Repository | 데이터 접근 로직 캡슐화 | 비즈니스 로직 |

```ts
// ✅ Controller — 얇게 유지
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}

// ✅ Service — 비즈니스 로직만
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
}

// ✅ Repository — DB 접근만
@Injectable()
export class UsersRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async findById(id: string) {
    return this.db.query.users.findFirst({ where: eq(users.id, id) });
  }
}
```

## DTO 및 유효성 검사

`class-validator` + `class-transformer`를 사용한다. `ValidationPipe`는 `main.ts`에서 전역 등록한다.

```ts
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,             // DTO에 없는 필드 자동 제거
    forbidNonWhitelisted: true,  // 불필요한 필드 전송 시 400
    transform: true,             // payload를 DTO 인스턴스로 자동 변환
  }),
);
```

```ts
// create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// update-user.dto.ts — PartialType으로 중복 제거
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

## 예외 처리

서비스에서는 NestJS 내장 예외 클래스를 사용한다. `try-catch` 구문이 필요한 경우 `@briefly/utils`의 `tryCatch` / `tryCatchSync`를 사용한다 ([TypeScript 컨벤션](../typescript.md#오류-처리) 참고).

```ts
// ✅ 내장 예외 클래스 사용
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input');
throw new ConflictException('Email already exists');
throw new UnauthorizedException();
throw new ForbiddenException();
```

글로벌 예외 필터는 `APP_FILTER` 토큰으로 모듈에 등록한다 (`main.ts`에 등록하면 DI 불가).

```ts
// app.module.ts
@Module({
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
```

## 의존성 주입

Constructor Injection만 사용한다.

```ts
// ✅
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}
}
```

전역 프로바이더(Guard, Interceptor, Filter, Pipe)는 `APP_*` 토큰으로 모듈에 등록해야 DI 컨텍스트에서 동작한다.

```ts
{ provide: APP_GUARD, useClass: JwtAuthGuard }
{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
{ provide: APP_FILTER, useClass: AllExceptionsFilter }
{ provide: APP_PIPE, useClass: ValidationPipe }
```

## 환경변수

`@nestjs/config`의 `ConfigModule`을 사용한다. 앱 시작 시 Zod 스키마로 유효성을 검증한다.

```ts
// config/env.config.ts
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const appConfig = registerAs('app', () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid env: ${JSON.stringify(parsed.error.format())}`);
  }
  return parsed.data;
});
```

```ts
// app.module.ts
ConfigModule.forRoot({ isGlobal: true, load: [appConfig] })
```

## Guard / Interceptor / Pipe 사용 시점

```
Middleware → Guard → Interceptor(전) → Pipe → Handler → Interceptor(후) → Filter
```

| 컴포넌트 | 사용 시점 |
|----------|-----------|
| Guard | 인증/인가, 접근 제어 |
| Interceptor | 응답 포맷 통일, 로깅, 실행 시간 측정 |
| Pipe | 입력 변환, 유효성 검사 |
| Filter | 예외 캐치 및 에러 응답 포맷 |

## 커스텀 데코레이터

요청 객체에서 값을 추출할 때 커스텀 파라미터 데코레이터를 사용한다.

```ts
// decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: UserPayload }>();
    return data ? request.user?.[data] : request.user;
  },
);

// 사용
@Get('me')
getMe(@CurrentUser() user: UserPayload) {
  return user;
}
```

## OpenAPI (Swagger)

`@nestjs/swagger`를 사용해 API 문서를 자동 생성한다.

### 설치

```sh
pnpm --filter @briefly/api add @nestjs/swagger swagger-ui-express
```

### 초기 설정

`main.ts`에서 `DocumentBuilder`로 문서를 구성하고, `/api` 경로에 Swagger UI를 마운트한다.

```ts
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Briefly API')
    .setDescription('Briefly API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 8000);
}
```

### 컨트롤러 데코레이터

```ts
@ApiTags('users')           // Swagger UI에서 그룹화
@Controller('users')
export class UsersController {

  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: [UserDto] })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @Get()
  findAll() { ... }

  @ApiOperation({ summary: '사용자 단건 조회' })
  @ApiParam({ name: 'id', description: '사용자 UUID' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, description: '사용자 없음' })
  @Get(':id')
  findOne(@Param('id') id: string) { ... }

  @ApiOperation({ summary: '사용자 생성' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: UserDto })
  @Post()
  create(@Body() dto: CreateUserDto) { ... }
}
```

### DTO 문서화

DTO의 모든 프로퍼티에 `@ApiProperty`를 붙인다. `UpdateDto`는 `@nestjs/swagger`의 `PartialType`을 사용해 Swagger 메타데이터가 유지되도록 한다.

```ts
// create-user.dto.ts
export class CreateUserDto {
  @ApiProperty({ example: '홍길동', description: '이름' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'p@ssw0rd', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

// update-user.dto.ts — @nestjs/swagger의 PartialType 사용 (Swagger 메타데이터 유지)
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

> `PartialType`은 반드시 `@nestjs/swagger`에서 import한다. `@nestjs/mapped-types`를 사용하면 Swagger 메타데이터가 손실된다.

### 인증 엔드포인트 표시

Bearer 토큰 인증이 필요한 엔드포인트에는 `@ApiBearerAuth()`를 추가한다.

```ts
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('me')
getMe(@CurrentUser() user: UserPayload) { ... }
```

### 내부 엔드포인트 숨기기

Swagger 문서에 노출하지 않을 엔드포인트에는 `@ApiExcludeEndpoint()`를 사용한다.

```ts
@ApiExcludeEndpoint()
@Get('health')
healthCheck() { ... }
```

## 금지 패턴

- Controller에 비즈니스 로직 작성 금지
- Service에서 DB 직접 접근 금지 (Repository를 통할 것)
- `main.ts`에 전역 Guard/Filter/Interceptor 등록 금지 (DI 불가)
- `REQUEST` 스코프 남용 금지 (성능 비용 발생)
- `PartialType`을 `@nestjs/mapped-types`에서 import 금지 (Swagger 메타데이터 손실)

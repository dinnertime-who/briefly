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

## 금지 패턴

- Controller에 비즈니스 로직 작성 금지
- Service에서 DB 직접 접근 금지 (Repository를 통할 것)
- `main.ts`에 전역 Guard/Filter/Interceptor 등록 금지 (DI 불가)
- `REQUEST` 스코프 남용 금지 (성능 비용 발생)

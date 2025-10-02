import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from './intefaces/jwt.interface';
import { LoginRequest } from './dto/login.dto';
import type { Request, Response } from 'express';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN: string;
  private readonly JWT_REFRESH_TOKEN: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN = config.getOrThrow<string>('JWT_ACCESS_TOKEN');
    this.JWT_REFRESH_TOKEN = config.getOrThrow<string>('JWT_REFRESH_TOKEN');
  }

  async register(res: Response, dto: RegisterRequest) {
    const { name, email, password } = dto;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser) {
      throw new ConflictException('Пользователь с такой почтой уже существует');
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });
    return this.auth(res, user.id, user.role);
  }

  private auth(res: Response, id: number, role: Role) {
    const { accessToken, refreshToken } = this.generateTokens(id, role);
    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    );
    return { token: accessToken, user: { id, role } };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      expires,
      secure: false,
      sameSite: 'lax',
    });
  }
  async login(res: Response, dto: LoginRequest) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        role: true,
        password: true,
      },
    });

    if (!user)
      throw new NotFoundException('Пользователь с таким email не найден');

    const IsValidPassword = await verify(user.password, password);
    if (!IsValidPassword) throw new NotFoundException();

    return this.auth(res, user.id, user.role);
  }

  async refresh(res: Response, req: Request) {
    const refreshToken = (req.cookies as Record<string, string>)[
      'refreshToken'
    ];
    if (!refreshToken) throw new UnauthorizedException();
    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);
    if (payload) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          id: true,
          role: true,
        },
      });
      if (!user) throw new NotFoundException();
      return this.auth(res, user.id, user.role);
    }
  }

  async validate(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async logout(res: Response) {
    this.setCookie(res, 'refresh', new Date(0));
  }

  private generateTokens(id: number, role: Role) {
    const payload: JwtPayload = { id, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

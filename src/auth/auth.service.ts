import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { SignInResponse } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SignUpResponse } from './dto/signUp-service-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return createAuthDto;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return updateAuthDto;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async generateToken(user: User) {
    const payload = { sub: user.id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '45m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return { access_token, refresh_token };
  }
  async signIn(username: string, pass: string): Promise<SignInResponse> {
    const user = await this.userService.findOneByUserName(username);
    if (!user) throw new UnauthorizedException('User not exist');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const { access_token, refresh_token } = await this.generateToken(user);

    return {
      id: user.id,
      username,
      access_token,
      refresh_token,
      role: user.roleId,
    };
  }
  async signUp(username: string, pass: string): Promise<SignUpResponse> {
    const user = await this.userService.findOneByUserName(username);

    if (user) throw new UnauthorizedException('User already exist ');
    const password = await bcrypt.hash(pass, 10);

    const newUser = await this.userService.create({
      username,
      password,
      roleId: 1,
    });

    const { access_token, refresh_token } = await this.generateToken(newUser);
    return {
      id: newUser.id,
      username: newUser.username,
      access_token,
      refresh_token,
      roleId: newUser.roleId,
    };
  }
  async validateRefreshToken(
    refreshToken: string,
  ): Promise<Record<string, string>> {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      console.log(process.env.REFRESH_TOKEN_SECRET);
      return { userId: payload.sub, username: payload.username };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refreshToken(token: string) {
    const { username } = await this.validateRefreshToken(token);
    const user = await this.userService.findOneByUserName(username);
    if (!user) throw new UnauthorizedException('User not exist');
    const { access_token } = await this.generateToken(user);
    return {
      access_token,
    };
  }
}

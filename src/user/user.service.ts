import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly dataUserFilePath = path.join(
    __dirname,
    '..',
    '../../src/db/user.json',
  );
  private generateId = (user: User[]) => {
    const id = user.length + 1;
    return id;
  };
  private readUserJson = (filePath: string) => {
    const fileContent: User[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return fileContent;
  };
  private writeUserJson = (filePath: string, user: User[]) => {
    fs.writeFileSync(filePath, JSON.stringify(user));
  };
  create(createUserDto: CreateUserDto) {
    try {
      const users = this.readUserJson(this.dataUserFilePath);

      const newUser: User = {
        ...createUserDto,
        id: this.generateId(users),
      };
      users.push(newUser);
      this.writeUserJson(this.dataUserFilePath, users);
      return newUser;
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    const users = this.readUserJson(this.dataUserFilePath);
    const user = users.find((user) => user.id === id);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findOneByUserName(username: string): Promise<User | undefined> {
    const users = this.readUserJson(this.dataUserFilePath);
    const user = users.find((user) => user.username === username);
    return user;
  }
}

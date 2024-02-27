import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.userRepository.findOne({
        where: { username: createUserDto.username },
      })
    ) {
      throw new ConflictException('Username already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      const updatedUser = this.userRepository.merge(user, updateUserDto);
      return this.userRepository.save(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<void> {
    if (!(await this.userRepository.findOne({ where: { id } }))) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    try {
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findOne(@Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.userService.findOne(userId);
  }

  @Put()
  @UseGuards(AuthGuard)
  update(@Body() updateUserDto: UpdateUserDto, @Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.userService.update(userId, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.userService.remove(userId);
  }
}

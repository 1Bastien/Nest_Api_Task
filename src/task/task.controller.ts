import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.taskService.create(createTaskDto, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.taskService.findOne(+id, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllByUsertoken(@Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.taskService.findAllByUserId(userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: Request,
  ) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.taskService.update(+id, updateTaskDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken['sub']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId: number = decodedToken['sub'];

    return this.taskService.remove(+id, userId);
  }
}

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: TaskRepository,
    @Inject(UserService)
    private userService: UserService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    try {
      const task = this.taskRepository.create(createTaskDto);
      task.user = user;
      return this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllByUserId(userId: number): Promise<Task[]> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    try {
      return this.taskRepository.find({ where: { user: user } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number, userId: number): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.user.id !== userId) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.user.id !== userId) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    try {
      const updatedTask = this.taskRepository.merge(task, updateTaskDto);
      return this.taskRepository.save(updatedTask);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.user.id !== userId) {
      throw new UnauthorizedException(
        `User with id ${userId} is not authorized to delete task with id ${id}`,
      );
    }

    try {
      await this.taskRepository.delete(id);
    } catch (error) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}

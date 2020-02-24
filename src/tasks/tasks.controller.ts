import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
    }

//     @Get()
//     getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
//         if (Object.keys(filterDto).length) {
//             return this.tasksService.getTasksWithFilters(filterDto);
//         }

//         return this.tasksService.getAllTasks();
//     }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

//     @Get('/:id')
//     getTaskById(@Param('id') id: string): Task {
//         return this.tasksService.getTaskById(id);
//     }

// // Alternate ways to do this...
//     // @Post()
//     // //createTask(@Body() body) { // @Body collects entire http request and puts it in the argument.
//     // createTask(
//     //     @Body('title') title: string, // @Body with a parameter can also extract specific parameters into arguments.
//     //     @Body('description') description: string,
//     // ): Task {
//     //     return this.tasksService.createTask(title, description);
//     // }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
        return this.tasksService.createTask(createTaskDto, user);
    }

//     @Post()
//     @UsePipes(ValidationPipe)
//     createTask(@Body() createTaskDto: CreateTaskDto): Task {
//         return this.tasksService.createTask(createTaskDto);
//     }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

//     @Delete('/:id')
//     deleteTask(@Param('id') id: string): void {
//         this.tasksService.deleteTask(id);
//     }

//     @Patch('/:id/status')
//     updateTaskStatus(
//         @Param('id') id: string,
//         @Body('status', TaskStatusValidationPipe) status: TaskStatus
//     ): Task {
//         return this.tasksService.updateTaskStatus(id, status);
//     }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }
}

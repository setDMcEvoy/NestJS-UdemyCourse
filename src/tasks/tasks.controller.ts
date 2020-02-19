import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);
    }

//     @Get()
//     getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
//         if (Object.keys(filterDto).length) {
//             return this.tasksService.getTasksWithFilters(filterDto);
//         }

//         return this.tasksService.getAllTasks();
//     }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
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
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

//     @Post()
//     @UsePipes(ValidationPipe)
//     createTask(@Body() createTaskDto: CreateTaskDto): Task {
//         return this.tasksService.createTask(createTaskDto);
//     }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTask(id);
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
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }
}

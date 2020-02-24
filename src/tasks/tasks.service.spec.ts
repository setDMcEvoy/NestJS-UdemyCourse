import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = { id: 12, username: 'Test User' };
const mockTaskRepo = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
});

describe('tasks service', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepo },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('get tasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some Search Query' };
            const result = await tasksService.getTasks(filters, mockUser);

            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('get task by id', () => {
        it('returns task successfully', async () => {
            const mockTask = { title: 'test', description: 'test desc' };
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                }
            });
        });

        it('throws TaskNotFound error', () => {
            taskRepository.findOne.mockResolvedValue(null);

            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException); // catches a rejection, then finds the thrown

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                }
            });
        });
    });

    describe('create task', () => {
        it('creates a task', async () => {
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const mockCreation = { title: 't', description: 'd', id: 1, userId: mockUser.id, status: TaskStatus.OPEN };
            taskRepository.createTask.mockResolvedValue(mockCreation);

            let dto = { title: 't', description: 'd' } as CreateTaskDto;
            const result = await tasksService.createTask(dto, mockUser);
            expect(result).toEqual(mockCreation);
            expect(taskRepository.createTask).toHaveBeenCalledWith(dto, mockUser);
        });
    });

    describe('delete task', () => {
        it('call task repo to delete task', async () => {
            taskRepository.deleteTask.mockResolvedValue({ affected: 1 });
            expect(taskRepository.deleteTask).not.toHaveBeenCalled();

            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.deleteTask).toHaveBeenCalledWith(1, { id: mockUser.id, username: "Test User" } );
        });
    });

    describe('update task', () => {
        it('update a task status', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});
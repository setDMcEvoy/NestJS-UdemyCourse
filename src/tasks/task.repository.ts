import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { NotFoundException, Logger, InternalServerErrorException } from "@nestjs/common";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('task.description LIKE :search OR task.title LIKE :search', { search: `%${search}%` })
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}", Filters: ${JSON.stringify(filterDto)}`,
            error.stack)
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
        } catch (error) {
            this.logger.error(`Failed to create task for user ${user.username}, Data: ${createTaskDto}`, error.stack);
            throw new InternalServerErrorException();
        }

        delete task.user; // just removes user from the return, not the entity.

        return task;
    }

    // async deleteTask(task: Task): Promise<Task> {
    //     return await task.remove();
    // }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.delete({ id, userId: user.id }); // delete does not require "where" because id is unique

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}
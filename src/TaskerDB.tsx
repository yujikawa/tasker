import { Dayjs } from "dayjs";
import Database from "tauri-plugin-sql-api";
export class MyTask {
    id: number;
    title: string;
    description: string;
    deadline: Dayjs;
    status: number;
    constructor({ title, description, deadline, status = 0, id = 0 }: { title: string, description: string, deadline: Dayjs, status?: number, id?: number }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.status = status;
    }
}

class TaskerDB {
    dbname: string;

    constructor(dbname: string) {
        this.dbname = dbname;
    }

    async get_tasks() {
        const db = await Database.load(this.dbname);
        const result: [] = await db.select(
            "select id, title, description, deadline, status from task"
        );
        return (result);
    }


    async register_task(task: MyTask) {
        const db = await Database.load(this.dbname);
        const result = await db.execute(
            "insert into task (title, description, deadline, status) values ($1, $2, $3, $4)",
            [task.title, task.description, task.deadline, task.status]
        );
        return result;
    }

    async update_task(task: MyTask) {
        const db = await Database.load(this.dbname);
        const result = await db.execute(
            "update task set title =$1, description=$2, deadline=$3 where id=$4",
            [task.title, task.description, task.deadline, task.id]
        );
        return result;
    }

    async update_task_status(id: number, status: number) {
        const db = await Database.load(this.dbname);
        const result = await db.execute(
            "update task set status=$1 where id=$2",
            [status, id]
        );
        return result;
    }

    async delete_task(id: number) {
        const db = await Database.load(this.dbname);
        const result = await db.execute(
            "delete from task where id=$1",
            [id]
        );
        return result;
    }
}

export default TaskerDB;
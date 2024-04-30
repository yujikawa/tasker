import { useEffect, useState } from "react";
import "./App.css";
import Database from "tauri-plugin-sql-api";
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base';
import { Input } from '@mui/base/Input';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import TaskTable from './components/TaskTable';
import TaskerDB from './TaskerDB';
import { MyTask } from './TaskerDB';

// class Task {
//   id?: number;
//   title: string;
//   description?: string;
//   deadline: Dayjs;
//   constructor(title: string, description: string, deadline: Dayjs, id?: number) {
//     this.id = id;
//     this.title = title;
//     this.description = description;
//     this.deadline = deadline;
//   }
// }


function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Dayjs>(dayjs());
  const [result, setResult] = useState([]);
  const taskerDB = new TaskerDB("sqlite:tasker.db");


  useEffect(() => {
    get_tasks()
  }, [result]);


  async function register_task() {
    let task = new MyTask({ title, description, deadline })
    await taskerDB.register_task(task);
  }

  async function get_tasks() {
    let result: [] = await taskerDB.get_tasks();
    setResult(result);
  }

  return (
    <div className="container">
      <h1>Tasker</h1>
      <div className="tasker-container">
        <form className="tasker-input-group"
          onSubmit={(e) => {
            e.preventDefault();
            register_task();
          }}
        >

          <div className="input-form">
            <div className="input-title-group">
              <div className="input-textfiled">
                <Input
                  className="title-input"

                  onChange={(e) => setTitle(e.currentTarget.value)}
                  placeholder="Enter title"
                />
                <TextareaAutosize
                  className="description-input"

                  minRows={10}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  placeholder="Enter description"
                />
              </div>

              <div className="date=input">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    defaultValue={dayjs()}
                    onChange={(date) => setDeadline(date)}
                    slotProps={{
                      toolbar: { toolbarFormat: 'YYYY/MM/DD', hidden: false },
                    }}
                  />
                </LocalizationProvider>

              </div>

            </div>

            <div className="input-save-group">

              <Button
                size="large"
                variant="contained"
                type="submit"
              >Register</Button>
            </div>
          </div>
        </form>

      </div>




      <TaskTable rows={result} />

    </div>
  );
}

export default App;

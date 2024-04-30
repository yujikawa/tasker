import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Database from "tauri-plugin-sql-api";
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base';
import { Input } from '@mui/base/Input';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ReportIcon from '@mui/icons-material/Report';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { yellow } from '@mui/material/colors';

class Task {
  id?: number;
  title: string;
  description?: string;
  deadline: Dayjs;
  constructor(title: string, description: string, deadline: Dayjs, id?: number) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
  }
}

function renderTable(rows: Array<any>) {
  let now = dayjs().locale("jst");

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="center">Deadline</TableCell>
            <TableCell align="center">Until the deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="left">{row.description}</TableCell>
              <TableCell align="center">{dayjs(row.deadline).locale("jst").format("YYYY/MM/DD").toString()}</TableCell>
              <TableCell align="center">
                {dayjs(row.deadline).locale("jst") < now && <ReportIcon sx={{ color: yellow[900] }} />}
                {dayjs(row.deadline).locale("jst") >= now && dayjs(row.deadline).locale("jst").diff(now, 'day') + 1}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(dayjs());
  const [result, setResult] = useState([]);
  const locale = 'zh-cn';

  useEffect(() => {
    get_tasks()
  }, [result]);


  async function register_task() {
    const db = await Database.load("sqlite:tasker.db");
    const result = await db.execute(
      "insert into task (title, description, deadline) values ($1, $2, $3)",
      [title, description, deadline]
    );
    console.log(result.rowsAffected);
  }

  async function update_task(task: Task) {
    const db = await Database.load("sqlite:tasker.db");
    const result = await db.execute(
      "update task set title =$1, description=$2, deadline=$3 where id=$4",
      [task.title, task.description, task.deadline, task.id]
    );
    console.log(result.rowsAffected);

  }

  async function get_tasks() {
    const db = await Database.load("sqlite:tasker.db");
    const result = await db.select(
      "select id, title, description, deadline from task"
    );
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
              >Save</Button>
            </div>
          </div>
        </form>

      </div>



      {renderTable(result)}

    </div>
  );
}

export default App;

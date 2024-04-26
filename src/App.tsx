import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Database from "tauri-plugin-sql-api";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base';
import { Input } from '@mui/base/Input';

function renderTable(result: Array<any>) {
  const rows = result.map((row) => <tr>
    <td>{row.title}</td>
    <td>{row.description}</td>
    <td>{row.deadline}</td>
  </tr>)
  return (
    rows
  )
}

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [result, setResult] = useState([]);

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

      <p>Create your task</p>

      <form className="container"
        onSubmit={(e) => {
          e.preventDefault();
          register_task();
        }}
      >
        <Input
          id="title-input"
          className="input-group"
          onChange={(e) => setTitle(e.currentTarget.value)}
          placeholder="Enter title"
        />
        <TextareaAutosize
          id="description-input"
          className="input-group"
          minRows={3}
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder="Enter description"
        />
        <DatePicker
          className="input-group"
          selected={deadline}
          onChange={(date) => setDeadline(date)}
        />
        <Button type="submit"
          >Register</Button>
      </form>

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>description</th>
            <th>deadline</th>
          </tr>
        </thead>
        <tbody>
          {renderTable(result)}
        </tbody>
      </table>
    </div>
  );
}

export default App;

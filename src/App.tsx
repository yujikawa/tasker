import { useEffect, useState } from "react";
import "./App.css";
import TaskTable from './components/TaskTable';
import TaskerDB from './TaskerDB';
import InputForm from "./components/InputForm";


function App() {
  const [result, setResult] = useState([]);
  const taskerDB = new TaskerDB("sqlite:tasker.db");


  useEffect(() => {
    get_tasks()
  }, [result]);


  async function get_tasks() {
    let result: [] = await taskerDB.get_tasks();
    setResult(result);
  }

  return (
    <div className="container">
      <div className="title">
        <img src="../src-tauri/icons/Square89x89Logo.png" ></img>
      </div>

      <div className="tasker-container">
        <InputForm />
      </div>

      <TaskTable rows={result} />

    </div>
  );
}

export default App;

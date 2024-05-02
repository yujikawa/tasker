import { useEffect, useState } from "react";
import "./App.css";
import TaskTable from './components/TaskTable';
import TaskerDB, { MyTask } from './TaskerDB';
import InputForm from "./components/InputForm";
import { Tabs } from '@mui/base/Tabs';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tab } from '@mui/base/Tab';


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
      <InputForm />
      <div className="title">
        <img src="../src-tauri/icons/Square89x89Logo.png" ></img>
      </div>

      <Tabs defaultValue={0}>
        <TabsList>
          <Tab value={0}>Work in progress</Tab>
          <Tab value={1}>Done</Tab>
        </TabsList>
        <TabPanel value={0}>
          <h2>Work in progress</h2>
          <TaskTable rows={result.filter((r: MyTask) => r.status == 0)} />
        </TabPanel>
        <TabPanel value={1}>
          <h2>Done</h2>
          <TaskTable rows={result.filter((r: MyTask) => r.status == 1)} />
        </TabPanel>
      </Tabs>

    </div>
  );
}

export default App;

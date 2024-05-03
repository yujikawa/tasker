import { useEffect, useState } from "react";
import "./App.css";
import TaskTable from './components/TaskTable';
import TaskerDB, { MyTask } from './TaskerDB';
import InputForm from "./components/InputForm";

import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';

function App() {
  const [result, setResult] = useState([]);
  const [tab_page, setTabPage] = useState(0);
  const taskerDB = new TaskerDB("sqlite:tasker.db");


  useEffect(() => {
    get_tasks()
  }, [result]);


  async function get_tasks() {
    let result: [] = await taskerDB.get_tasks();
    setResult(result);
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar disableGutters>
          <img className="logo" src="../src-tauri/icons/128x128.png" ></img>
          <Typography variant="h6" component="div"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
            }}>
            Tasker
          </Typography>
          <MenuItem key={0} onClick={() => { setTabPage(0) }}>
            <Typography textAlign="center">WIP</Typography>
          </MenuItem>
          <MenuItem key={1} onClick={() => { setTabPage(1) }}>
            <Typography textAlign="center">Done</Typography>
          </MenuItem>
          <InputForm />

        </Toolbar>
      </AppBar>


      <Box sx={{ flexGrow: 1 }}>

        {
          tab_page == 0 && <>
            <Toolbar>
              <Typography variant="h5">
                Work in progress
              </Typography>
            </Toolbar>
            <TaskTable rows={result.filter((r: MyTask) => r.status == 0)} />
          </>
        }
        {
          tab_page == 1 && <>
            <Toolbar>
              <Typography variant="h5">
                Done
              </Typography>
            </Toolbar>
            <TaskTable rows={result.filter((r: MyTask) => r.status == 1)} />
          </>
        }

      </Box>

    </>
  );
}

export default App;

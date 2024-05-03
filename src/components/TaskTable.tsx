import dayjs from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ReportIcon from '@mui/icons-material/Report';
import { yellow } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import { MyTask } from "../TaskerDB";
import TaskerDB from '../TaskerDB';
import Typography from '@mui/material/Typography';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

function TaskTable({ rows }: { rows: Array<MyTask> }) {
    const taskerDB = new TaskerDB("sqlite:tasker.db");

    // let rows = props.rows;
    let now = dayjs().locale("jst");

    if (rows.length == 0) {
        return (
            <>
                <Typography variant="h4" textAlign="center" component="div"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        textDecoration: 'none',
                    }}
                >
                    No tasks
                    <ChecklistRtlIcon sx={{ fontSize: 30 }} />

                </Typography>
            </>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="center">Deadline</TableCell>
                        <TableCell align="center">Until the deadline</TableCell>
                        <TableCell align="center">Delete</TableCell>
                        <TableCell align="center">Status</TableCell>
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
                            <TableCell align="center">
                                <IconButton aria-label="delete" size="large" onClick={() => {
                                    taskerDB.delete_task(row.id);
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">
                                <ToggleButton
                                    key={row.id}
                                    value="check"
                                    color="primary"
                                    selected={row.status == 1}
                                    onChange={() => {
                                        let status = row.status == 0 ? 1 : 0;
                                        taskerDB.update_task_status(row.id, status);
                                        // setSelected(status == 0 ? false : true);
                                    }}
                                >
                                    <CheckIcon />
                                </ToggleButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    )
}

export default TaskTable;
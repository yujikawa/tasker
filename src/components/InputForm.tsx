import { useState } from "react";
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base';
import { Input } from '@mui/base/Input';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import TaskerDB from '../TaskerDB';
import { MyTask } from '../TaskerDB';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ModeEditOutline } from '@mui/icons-material';

const modal_style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid gray',
    boxShadow: 24,
    p: 4,
};

function InputForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState<Dayjs>(dayjs());
    const taskerDB = new TaskerDB("sqlite:tasker.db");

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    async function register_task() {
        let task = new MyTask({ title, description, deadline })
        await taskerDB.register_task(task);
    }

    return (
        <div className="create-form">

            <Button className="create-button" onClick={handleOpen} startIcon={<ModeEditOutline />}>
                Create task
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modal_style}>
                    <form className="tasker-input-group"
                        onSubmit={(e) => {
                            e.preventDefault();
                            register_task();
                            handleClose();
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


                                <div className="date-input">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <StaticDatePicker
                                            displayStaticWrapperAs="desktop"
                                            defaultValue={dayjs()}
                                            onChange={(date) => {
                                                if (date == null) {
                                                    date = dayjs();
                                                }
                                                setDeadline(date)
                                            }}
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
                </Box>
            </Modal>

        </div>
    )
}

export default InputForm;
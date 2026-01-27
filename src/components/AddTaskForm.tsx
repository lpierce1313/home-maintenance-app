import { addTask } from '@/app/actions';
import { Button, TextField } from '@mui/material';

export default function AddTaskForm({ homeId }: { homeId: string }) {
  return (
    <form action={addTask}>
      <input type="hidden" name="homeId" value={homeId} />
      <TextField name="title" label="Task Name" variant="outlined" fullWidth />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Save Task
      </Button>
    </form>
  );
}

// I am using React's useState function to create state variables for my component. 
// const [ tasks, setTasks ] = useState([]);
// tasks: is a state variable that will store an array of tasks
// setTasks: is a function that I can use to update the value of "tasks"
// useState([]): Initializes 'tasks' with an empty arra as its initial value

// const [newTask, setNewTask] = useState('');
// newTask is a state variable that will store a string representing a new task.
// setNewTask is a function that you can use to update the value of newTask.
// useState('') initializes newTask with an empty string as its initial value.

// const [editingTaskId, setEditingTaskId] = useState(null);
// editingTaskId is a state variable that will store an identifier for the task being edited 
// (or null if no task is being edited).
// setEditingTaskId is a function that you can use to update the value of editingTaskId.
// useState(null) initializes editingTaskId with a null value, indicating that no task is initially being edited.

// const [editedTask, setEditedTask] = useState('');
// editedTask is a state variable that will store a string representing the edited task.
// setEditedTask is a function that you can use to update the value of editedTask.
// useState('') initializes editedTask with an empty string as its initial value.

//useEffect hook in a React functional component. Here's what it's doing:
//useEffect is a hook in React that allows you to perform side effects in your functional components. 
//Side effects can include data fetching, setting up subscriptions, or manually changing the DOM.
//The code inside the useEffect block is a function that will be executed when the component is mounted
// (i.e., when it's initially rendered) and whenever any of the dependencies (specified as an array) change
// In your code, the useEffect hook is used to make an initial call to the fetchTasks function as soon as the
// component is mounted. This is a common use case for useEffect when you want to perform an action when the


// component first loads.
import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:3001/api/tasks')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  };

  const addTask = () => {
    fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: newTask }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks((prevTasks) => [...prevTasks, data]);
        setNewTask('');
      })
      .catch((error) => {
        console.error('Error adding a task:', error);
      });
  };

  const deleteTask = (taskId) => {
    fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      })
      .catch((error) => {
        console.error('Error deleting a task:', error);
      });
  };

  const startEditingTask = (taskId, description) => {
    setEditingTaskId(taskId);
    setEditedTask(description);
  };

  const updateTask = () => {
    if (editedTask.trim() === '') {
      return;
    }

    fetch(`http://localhost:3001/api/tasks/${editingTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: editedTask }),
    })
      .then(() => {
        setEditingTaskId(null);
        setEditedTask('');
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editingTaskId ? { ...task, description: editedTask } : task
          )
        );
      })
      .catch((error) => {
        console.error('Error updating a task:', error);
      });
  };

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task._id === editingTaskId ? (
              <div>
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button onClick={updateTask}>Update</button>
              </div>
            ) : (
              <span>{task.description}</span>
            )}
            <button onClick={() => startEditingTask(task._id, task.description)}>Edit</button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default App;
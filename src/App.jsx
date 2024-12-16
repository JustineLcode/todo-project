import { useState, useEffect } from 'react'
import './index.css'
const APIurl = "http://localhost:3000/todos";

function App() {

  // state (état, données)
  const [title, setTitle] = useState("")
  const [tasks, setTasks] = useState([    
    { id: 1, title: "First Task" },
    { id: 2, title: "Second Task" },
    { id: 3, title: "Third Task" },
  ]);

useEffect(()=>{
  const fetchTasks = async () => {
  try{
    const response = await fetch(APIurl);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    const data = await response.json();
    setTasks(data);
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};
fetchTasks();
}, []);

const handleAdd = async (task) => {
  const newTask = {
    title: task,
    isCompleted: false,
  }
  try {
    const response = await fetch(APIurl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newTask),
    });
    if (!response.ok) throw new Error("Failed to add task");
    const savedTask = await response.json();
    setTasks([...tasks, savedTask]);
    setTitle("");
  } catch (error) {
    console.error("Error adding task:", error);
  }
  };

const handleDelete = async (id) => {
  try{
    const response = await fetch (`${APIurl}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete task");
    const updatedTasks = await fetch(APIurl);
    setTasks(await updatedTasks.json());
    setTasks(tasks.filter((task) => task.id !== id));
  } catch (error) {
    console.error("Error deleting task", error);
  }
};
/*   //1. copie du state
  const tasksCopy = [...tasks];
  //2. manipuler mon state
  const tasksCopyUpdated = tasksCopy.filter((task) => task.id !== id);
  //3. modifier mon state avec le setter
  setTasks(tasksCopyUpdated);
  } */
/* 
const handleEdit = (id) => {
  //1. copie du state
const tasksCopy = [...tasks];
  //2. manipuler mon state
const tasksCopyUpdated = tasksCopy.map((task) => {
  if(task.id === id){
    return {...task, title: newTitle};
}
return task;
});
//3. modifier mon state avec le setter
setTasks(tasksCopyUpdated);
}

const handleEditToggle = (id) => {
  const tasksUpdated = tasks.map((task) =>
    task.id === id ? { ...task, isEditing: !task.isEditing } : task
  );
  setTasks(tasksUpdated);
}; */

const handleEditChange = (id, newTitle) => {
  // Mettre à jour le titre de la tâche modifiée
  const tasksUpdated = tasks.map((task) =>
    task.id === id ? { ...task, title: newTitle } : task
  );
  setTasks(tasksUpdated);
}; 

const handleEditSubmit = async (id) => {
  const taskToEdit = tasks.find((task) => task.id === id);
  try {
    const response = await fetch(`${APIurl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskToEdit),
    });
    if (!response.ok) throw new Error("Failed to edit task");
    setTasks(tasks.map((task) =>
      (task.id === id ? { ...task, isEditing: false } : task)));
  } catch (error) {
    console.error("Error editing task:", error);
  }
};

const handleEditToggle = (id) => {
  const tasksUpdated = tasks.map((task) =>
    task.id === id ? { ...task, isEditing: !task.isEditing } : task
  );
  setTasks(tasksUpdated);
};

  // Sauvegarder la modification et désactiver le mode édition
/*   const tasksUpdated = tasks.map((task) =>
    task.id === id ? { ...task, isEditing: false } : task
  );
  setTasks(tasksUpdated);
}; */

const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim()){
      handleAdd(title);
    }
    };

const handleChange = (event) => {
      setTitle(event.target.value);
    };

  return (
  <>
    <header>
      <h1>TODO LIST</h1>
      <form onSubmit={handleSubmit}>
        <input className='handleAdd' type="text" value={title} placeholder='Add a new task' onChange={handleChange} />
        <button className='create' >Create</button>
      </form>
    </header>
    <main>
    {tasks.map((task) => (
      <div key={task.id} className='newTask'>

        {/* <p className='handleAdd'> */}
        {task.isEditing ? (
        <input
          type="text"
          value={task.title}
          className='handleAdd'
          onChange={(e) => handleEditChange(task.id, e.target.value)}
              onBlur={() => handleEditSubmit(task.id)} // Sauvegarder au blur
              autoFocus
        />
      ) : ( 
        <p className='handleAdd'
        onDoubleClick={() => handleEditToggle(task.id)} 
        >
        {task.title}
      </p>
)}
        <button className='edit' onClick={()=>handleEditToggle(task.id)}>Edit</button>

        <button className='delete'onClick={()=>handleDelete(task.id)}>Delete</button>
      
      </div>
      ))}
    </main>
  </>
  );
}

export default App

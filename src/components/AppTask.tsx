import React, { useState } from 'react';
import '../App.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const AppTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  const addTask = () => {
    if (newTask.trim() === '') return;
    const task: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id: number, newText: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  return (
    <div className='containerTask'>
      <h1 className=''>To-Do List</h1>
      <input
        className='inputTask'
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Adicionar nova tarefa"
        maxLength={20}
      />
      <button onClick={addTask}>Adicionar</button>

      <ul className='listTask'>
        {tasks.map(task => (
          <li key={task.id} className='itemTask'>
            <div className='box-task'>
              <div className='text-area'>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className='checkBoxTask'
                />
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                  className='textTask'
                >
                  {task.text}
                </span>
              </div>
              <div className='box-button'>
                <button className='buttonEdit' onClick={() => editTask(task.id, prompt('Editar tarefa:', task.text) || task.text)}>
                  Editar
                </button>
                <button className='buttonDelete' onClick={() => deleteTask(task.id)}>Excluir</button>
              </div>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppTask;
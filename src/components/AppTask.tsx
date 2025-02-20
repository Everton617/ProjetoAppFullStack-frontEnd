import React, { useEffect, useState } from 'react';
import '../App.css';
import { toast } from "mui-sonner";
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineRemoveDone } from "react-icons/md";
import { format } from 'date-fns';


interface Task {
  id: number;
  description: string;
  done: boolean;
  concludedAt: string | null;
  createdAt: string;
}


const AppTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [editedTask, setEditedTask] = useState<string>('');
  const token = localStorage.getItem('token');

  const fetchTasks = async () => {

    if (!token) {
      toast.error('Usuário não autenticado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });



      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas.');
      }

      const data = await response.json();
      console.log(data);
      setTasks(data);
    } catch (error) {
      toast.error('Erro ao buscar tarefas.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (description: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Usuário não autenticado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 400 && errorData.message === 'Tarefa já existe') {
          toast.error('Essa tarefa já foi adicionada.');
        } else {
          toast.error('Erro ao adicionar tarefa.');
        }

        throw new Error(errorData.message || 'Erro ao adicionar tarefa.');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error) {
      console.error(error);
    }
  };


  const editTask = async (taskId: number, description: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Usuário não autenticado.');
      return;
    }
    
    if(description === ''){
      toast.error('A descrição da tarefa não pode ser vazia.');
      return;
    }


    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, description }),
      });

      if (!response.ok) {
        throw new Error('Erro ao editar tarefa.');
      }

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, text: description } : task
        )
      );
      toast.success('Tarefa editada com sucesso!');
    } catch (error) {
      toast.error('Erro ao editar tarefa.');
      console.error(error);
    }
  };

  const deleteTask = async (taskId: number) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Usuário não autenticado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir tarefa.');
      }

      setTasks(tasks.filter((task) => task.id !== taskId)); 
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tarefa.');
      console.error(error);
    }
  };

  const toggleComplete = async (taskId: number) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Usuário não autenticado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tasks/complete', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao concluir tarefa.');
      }

    
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task
        )
      );

  
      const task = tasks.find((task) => task.id === taskId);
      if (task && task.done) {
        toast.info('Tarefa marcada como pendente!');

      } else {
        toast.success('Tarefa concluída com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao concluir tarefa.');
      console.error(error);
    }
  };

  const completedTasks = tasks.filter((task) => task.done);
  const pendingTasks = tasks.filter((task) => !task.done);

  const formatConcludedAt = (dateString: string | null) => {
    if (dateString) {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    }
    return null;
  };

  

  return (
    <div className='containerTask'>
      <h1>To-Do List</h1>
      <div className='boxAddTask'>
        <input
          className='inputTask'
          type='text'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder='Adicionar nova tarefa'
          maxLength={20}
        />
        <button className='btnAddTask' onClick={() => addTask(newTask)}>Adicionar</button>
      </div>


      <div className='task-section'>
        <h2 className='h2Task'>Tarefas Pendentes</h2>
        <ul className="listTask">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task) => (
              <li key={task.id} className="itemTask">
                <div className="box-task">
                  <div className="text-area">
                    <span
                      style={{
                        textDecoration: task.done ? "line-through" : "none",
                      }}
                      className="textTask"
                    >
                      {task.description}
                    </span>
                  </div>
                  <div className="box-button">
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <button className="buttonEdit">Editar</button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                          <Dialog.Title className="DialogTitle">
                            Editar tarefa
                          </Dialog.Title>
                          <Dialog.Description className="DialogDescription">
                            <div>
                              Preencha o campo passando uma nova descrição para a
                              tarefa:
                            </div>
                            <div className="textTask">"{task.description}"</div>
                          </Dialog.Description>
                          <fieldset className="Fieldset">
                            <label className="Label" htmlFor="description">
                              Descrição
                            </label>
                            <input
                              value={editedTask}
                              onChange={(e) => setEditedTask(e.target.value)}
                              className="Input"
                              id="description"
                              defaultValue={task.description}
                            />
                          </fieldset>
                          <div
                            style={{
                              display: "flex",
                              marginTop: 25,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Dialog.Close asChild>
                              <button
                                onClick={() => editTask(task.id, editedTask)}
                                className="Button green"
                              >
                                Salvar alterações
                              </button>
                            </Dialog.Close>
                          </div>
                          <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                              <Cross2Icon />
                            </button>
                          </Dialog.Close>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>

                    <button
                      className="buttonDelete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Excluir
                    </button>

                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="toggleTask"
                    >
                      <MdOutlineDone />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <span className="noTasksMessage">Não há tarefas pendentes</span>
          )}
        </ul>
      </div>


      <div className='task-section'>
        <h2 className='h2Task'>Tarefas Concluídas</h2>
        <ul className="listTask">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <li key={task.id} className="itemTask">
                <div className="box-task">
                  <div className="text-area">
                    <span
                        title={task.concludedAt ? `Concluído em: ${formatConcludedAt(task.concludedAt)}` : "Tarefa não concluída"}
                      style={{
                        textDecoration: task.done ? "line-through" : "none",
                      }}
                      className="textTask"
                    >
                      {task.description}
                    </span>

                  </div>
                  <div className="box-button">
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <button className="buttonEdit">Editar</button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                          <Dialog.Title className="DialogTitle">Editar Tarefa</Dialog.Title>
                          <Dialog.Description className="DialogDescription">
                            Faça alterações na tarefa aqui. Clique em salvar quando terminar.
                          </Dialog.Description>
                          <fieldset className="Fieldset">
                            <label className="Label" htmlFor="description">
                              Descrição
                            </label>
                            <input
                              className="Input"
                              id="description"
                              defaultValue={task.description}
                              maxLength={20}
                            />
                          </fieldset>
                          <div
                            style={{
                              display: "flex",
                              marginTop: 25,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Dialog.Close asChild>
                              <button
                                onClick={() => editTask(task.id, task.description)}
                                className="Button green"
                              >
                                Salvar alterações
                              </button>
                            </Dialog.Close>
                          </div>
                          <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                              <Cross2Icon />
                            </button>
                          </Dialog.Close>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>

                    <button
                      className="buttonDelete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Excluir
                    </button>

                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="removeDone"
                    >
                      <MdOutlineRemoveDone />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <span className="noTasksMessage">Não há tarefas concluídas</span>
          )}
        </ul>

      </div>
    </div>
  );
};

export default AppTask;
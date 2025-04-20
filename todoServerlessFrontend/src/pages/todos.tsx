import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubHeading from '../components/subHeading';

const TodoApp = () => {
  // States for managing todos and input fields
  const [updateTodos, setUpdateTodos] = useState(true);
  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useState<{ title: string; description: string; completed: boolean; id: number }[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newTodoAdded, setNewTodoAdded] = useState(true);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const [warning, setWarning] = useState({
    dataValid: true,
  });
  // Handler to add a new todo
  const addTodo = async () => {
    try {
      //@ts-ignore
      const res = await axios.post("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/todos/postTodo", {
        title: title,
        description: description
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setNewTodoAdded(!newTodoAdded);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setWarning({ dataValid: false });
        }
      }
    }
  };

  // Handler to mark a todo as completed
  const markCompleted = async (id: number) => {
    //@ts-ignore
    const result = await axios.patch("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/todos/putTodo", {
      id,
      completed: true,
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    setUpdateTodos(!updateTodos);
  };
  function handleLogOut() {
    localStorage.removeItem("token");
    navigate("/");
  }
  useEffect(() => {
    const fetchTodo = async () => {
      const res = await axios.get("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/todos/getTodo", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setTodos(res.data.todos);
    }
    fetchTodo();
  }, [newTodoAdded, updateTodos]);
  useEffect(() => {
    const fetchName = async () => {
      const res = await axios.get("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/todos/name", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setFirstName(res.data.firstName[0]);
    }
    fetchName();
  }, []);
  const handleDelete = async (id: number) => {
    console.log("delete button Clicked")
    const res = await axios.delete("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/todos/deleteTodo", {
      data: {
        id: id,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    setUpdateTodos(!updateTodos);
    console.log(res);
  }
  const handleEdit = async (id: number, title: string, description: string) => {
    setCurrentTodoId(id);
    setTitle(title);
    setDescription(description);
    setIsModalOpen(true);
  }

  const handleUpdate = async () => {
    if (currentTodoId !== null) {
      try {
        await axios.patch("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/todos/putTodo", {
          id: currentTodoId,
          title: title,
          description: description
        }, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        setIsModalOpen(false);
        setUpdateTodos(!updateTodos)
      } catch (err) {
        console.log(err);
      }
    }
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-gray-800 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">Todo App</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>Hello</span>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="font-bold">{firstName.toUpperCase()}</span>
          </div>
          <button onClick={handleLogOut} className="bg-red-500 py-1 px-4 rounded-md text-white">Log Out</button>
        </div>
      </nav>

      {/* Todo Adding Section */}
      <section className="max-w-3xl w-96 mx-auto mt-10 p-5">
        <h2 className="text-2xl font-semibold mb-4">Add Todo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-lg mb-2">Title</label>
            <input
              type="text"
              placeholder="Enter title"
              className="w-full p-2 bg-gray-700 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg mb-2">Description</label>
            <input
              type="text"
              placeholder="Enter description"
              className="w-full p-2 bg-gray-700 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            onClick={addTodo}
            className="w-full py-2 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700"
          >
            Add Todo
          </button>
          <SubHeading label={warning.dataValid ? "" : " incorrect data"} />
        </div>
      </section>

      {/* Todo Display Section */}
      <section className="max-w-3xl mx-auto mt-10 p-5">
        <h2 className="text-2xl font-semibold mb-4">Your Todos</h2>
        <div className="space-y-4">
          {todos.map((todo) => (
            <div className="flex justify-between">
              <div key={todo.id} className="bg-gray-800 p-4 w-full rounded-md">
                <div>
                  <h3 className="text-lg font-semibold">{todo.title}</h3>
                  <p>{todo.description}</p>
                </div>
                <div></div>
                <button
                  onClick={() => markCompleted(todo.id)}
                  className={`mt-2 px-4 py-2 rounded-md ${todo.completed ? 'bg-green-500' : 'bg-gray-600'} text-white`}
                >
                  {todo.completed ? 'Completed' : 'Mark as Completed'}
                </button>

              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <button onClick={() => handleEdit(todo.id, todo.title, todo.description)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button className="pt-4" onClick={() => handleDelete(todo.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-md w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Todo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-lg mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-lg mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded-md"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsModalOpen(false)} // Close the modal
                  className="bg-gray-600 py-1 px-4 rounded-md text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate()}
                  className="bg-blue-600 py-1 px-4 rounded-md text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;

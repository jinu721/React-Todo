import React, { FormEvent, useRef, useState } from "react";
import { Plus, Filter, Calendar, Edit, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistanceToNow } from "date-fns";

interface TodoIF {
  id: string;
  text: string;
  completed: boolean;
  date?: Date;
}
const Todos = () => {
  const [todos, setTodo] = useState<TodoIF[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [editTodoId, setEditTodoId] = useState<string | null>("1737975093461");
  const [editTodoText, setEditTodoText] = useState<string>("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addTodo = (e: FormEvent): void => {
    e.preventDefault();

    if (!newTodo.trim()) {
      inputRef.current?.focus();
    } else if (todos.some((todo) => todo.text === newTodo)) {
      toast.error("This todo already exists", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setTodo([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          date: new Date(),
        },
      ]);
      setNewTodo("");
    }
  };

  const openDeleteAlert = (id: string) => {
    setTodoToDelete(id);
    setShowDeleteAlert(true);
  };

  const closeDeleteAlert = () => {
    setTodoToDelete(null);
    setShowDeleteAlert(false);
  };

  const deleteTodo = (): void => {
    if (todoToDelete) {
      setTodo((prev) => prev.filter((todo) => todo.id !== todoToDelete));
      toast.success("Todo deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      closeDeleteAlert();
    }
  };

  const changeStatus = (id: string): void => {
    setTodo((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditTodo = (id: string, text: string): void => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const saveEditedTodo = (id: string) => {
    if (todos.some((todo) => todo.text === editTodoText)) {
      toast.error("This todo already exists", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setTodo((prev) => {
        return prev.map((todo) => {
          return todo.id === id ? { ...todo, text: editTodoText } : todo;
        });
      });
    }
    setEditTodoId(null);
    setEditTodoText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !todo.completed;
    if (filter === "Completed") return todo.completed;
  });

  const reversedTodos = [...filteredTodos].reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-700 p-8 pt-30">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Todo-s</h1>
          <p>{newTodo}</p>
        </div>

        <form className="flex gap-2 mb-6" onSubmit={addTodo}>
          <input
            type="text"
            value={newTodo}
            // onChange={(e) => setNewTodo(e.target.value)}
            ref={inputRef}
            onChange={(e)=>setNewTodo(e.target.value)}
            placeholder="Add new..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </form>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
            <p>{filteredTodos.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          {reversedTodos.length === 0 ? (
            <div className="flex items-center justify-center mt-10 mb-10" >
              <p>No todos yet!</p>
            </div>
          ) : (
            reversedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {
                      changeStatus(todo.id);
                    }}
                    className="w-5 h-5 accent-purple-600 rounded"
                  />
                  {editTodoId && editTodoId === todo.id ? (
                    <input
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                      type="text"
                      value={editTodoText}
                      onChange={(e) => setEditTodoText(e.target.value)}
                    />
                  ) : (
                    <span
                      className={`${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editTodoId === todo.id ? (
                    <button
                      onClick={() => saveEditedTodo(todo.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      {todo.date && (
                        <div className="flex items-center mr-45 gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          {formatDistanceToNow(todo.date)}
                        </div>
                      )}
                      <button
                        onClick={() => startEditTodo(todo.id, todo.text)}
                        className="px-4 py-2 bg-yellow-400 text-white rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteAlert(todo.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteAlert && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative shadow-lg">
            <button
              onClick={closeDeleteAlert}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Todo
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete this todo? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteAlert}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteTodo}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Todos;

import { useState, useEffect } from "react"
import axios from "axios";

function App() {
  const [todoText, setTodoText] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const fetchTodos = async () => {
    try {
      const response = await axios.get('https://to-do-app-backend-g3j9.onrender.com/todos')
      console.log(response.data);
      setTodoList(response.data.todos || [])
      setLoading(false)
    } catch (error) {
      console.log('Error fetching todos:', error)
      setLoading(false)
      setTodoList([])
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      const response = await axios.post('https://to-do-app-backend-g3j9.onrender.com/addtodo',{
        todo: todoText
      })
      setTodoList(prevList => [...prevList, response.data.todo]);
      setTodoText('');
    }catch(error){
      console.log('Error adding todo:', error);
    }
  }
  const handleDelete = async(todoId)=>{
    try{
      await axios.delete(`https://to-do-app-backend-g3j9.onrender.com/delete/${todoId}`)
      setTodoList(prevList => prevList.filter(todo =>todo._id !== todoId));
    }catch(error){
      console.log('Error deleting todo:', error)
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditText(todo.todo)
  }

  const handleUpdate = async (todoId) => {
    try {
      await axios.put('https://to-do-app-backend-g3j9.onrender.com/update', {
        _id: todoId,
        todo: editText
      })
      setTodoList(prevList => 
        prevList.map(todo => 
          todo._id === todoId ? { ...todo, todo: editText } : todo
        )
      )
      setEditingId(null)
      setEditText('')
    } catch (error) {
      console.log('Error updating todo:', error)
    }
  }

  const handleToggleComplete = async (todoId, currentStatus) => {
    try {
      await axios.put('https://to-do-app-backend-g3j9.onrender.com/update', {
        _id: todoId,
        completed: !currentStatus
      })
      setTodoList(prevList =>
        prevList.map(todo =>
          todo._id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      )
    } catch (error) {
      console.log('Error updating todo status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-8 md:py-10 transition-colors duration-200">
      <div className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg text-lg"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6 sm:mb-8">
          My Todo App
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <input 
              type="text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              placeholder="Enter your todo"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Todo
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading todos...
            </div>
          ) : (
            <>
              {Array.isArray(todoList) && todoList.map((todo) => (
                <div 
                  key={todo._id} 
                  className={`bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border transition-all
                    ${todo.completed 
                      ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-700'} 
                    hover:shadow-md`}
                >
                  {editingId === todo._id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      <button
                        onClick={() => handleUpdate(todo._id)}
                        className="flex items-center gap-1 bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        <span>✓</span> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 bg-gray-500 text-white px-4 py-1 rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      >
                        <span>×</span> Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => handleToggleComplete(todo._id, todo.completed)}
                      >
                        <button
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors
                            ${todo.completed
                              ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white'
                              : 'border-gray-300 dark:border-gray-600'
                            } hover:border-green-500 dark:hover:border-green-400`}
                        >
                          {todo.completed && '✓'}
                        </button>
                        <p className={`text-lg break-words flex-1 select-none
                          ${todo.completed
                            ? 'text-green-700 dark:text-green-400 line-through'
                            : 'text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {todo.todo}
                        </p>
                      </div>
                      <div className="flex gap-2 justify-end sm:justify-start">
                        <button
                          onClick={() => startEditing(todo)}
                          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
                        >
                          <span className="text-lg">✎</span>
                          <span className="font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(todo._id)}
                          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm sm:text-base"
                        >
                          <span className="text-lg">🗑</span>
                          <span className="font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {(!Array.isArray(todoList) || todoList.length === 0) && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No todos yet. Add one above!
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

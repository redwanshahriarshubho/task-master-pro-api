import { useState, useEffect } from 'react'
import { Plus, Filter, CheckCircle2, Clock, PlayCircle, Edit2, Trash2, Calendar } from 'lucide-react'
import TaskForm from './TaskForm'

const API_URL = 'https://task-master-pro-api-v2kt.onrender.com/api'

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50'
  },
  'in-progress': {
    label: 'In Progress',
    icon: PlayCircle,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/20',
    border: 'border-green-500/50'
  }
}

export default function TaskList({ token }) {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks([...tasks, newTask])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
        setEditingTask(null)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const cycleStatus = (currentStatus) => {
    const statuses = ['pending', 'in-progress', 'completed']
    const currentIndex = statuses.indexOf(currentStatus)
    return statuses[(currentIndex + 1) % statuses.length]
  }

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter)

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filters and Add Button */}
      <div className="glass rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-white/60" />
            {['all', 'pending', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === status
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-white/60 hover:text-white glass-hover'
                }`}
              >
                {status === 'all' ? 'All' : statusConfig[status].label}
                <span className="ml-2 text-xs opacity-75">({taskCounts[status]})</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl flex items-center gap-2 transition-all"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </div>

      {/* Task Form Modal */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask 
            ? (data) => handleUpdateTask(editingTask.id, data)
            : handleCreateTask
          }
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white/80 mb-2">No tasks yet</h3>
          <p className="text-white/50">
            {filter === 'all' 
              ? "Click 'Add Task' to create your first task"
              : `No ${filter === 'in-progress' ? 'in progress' : filter} tasks`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task, index) => {
            const StatusIcon = statusConfig[task.status].icon
            return (
              <div
                key={task.id}
                className="glass rounded-xl p-6 glass-hover group animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <button
                    onClick={() => handleUpdateTask(task.id, { ...task, status: cycleStatus(task.status) })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${statusConfig[task.status].bg} ${statusConfig[task.status].border} hover:scale-105`}
                  >
                    <div className="flex items-center gap-1">
                      <StatusIcon size={14} />
                      {statusConfig[task.status].label}
                    </div>
                  </button>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit2 size={16} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-white/40 pt-4 border-t border-white/10">
                  <Calendar size={14} />
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats Footer */}
      {tasks.length > 0 && (
        <div className="glass rounded-2xl p-6 mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {taskCounts.pending}
              </div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {taskCounts['in-progress']}
              </div>
              <div className="text-sm text-white/60">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {taskCounts.completed}
              </div>
              <div className="text-sm text-white/60">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
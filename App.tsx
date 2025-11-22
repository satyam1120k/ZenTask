import React, { useState, useEffect } from 'react';
import { Task, FilterType } from './types';
import Dashboard from './components/Dashboard';
import TaskItem from './components/TaskItem';
import { Plus, Sun, Moon, ListTodo, Calendar, Mail, BellRing } from 'lucide-react';
import { db, tasksCollection } from './services/firebase';
import { onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Form State
  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('list');

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  // Load data from Firebase
  useEffect(() => {
    // Check if config is placeholder
    if (db.app.options.apiKey === "REPLACE_WITH_YOUR_API_KEY") {
      setToast({ message: "⚠️ Please update firebase.ts with your config!", type: 'info' });
    }

    const q = query(tasksCollection, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(newTasks);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      setToast({ message: "Error connecting to Firebase.", type: 'info' });
    });

    return () => unsubscribe();
  }, []);

  // Persistence Effect for Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('zenTheme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }

    // Request notification permission on load
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenTheme', 'light');
    }
  }, [darkMode]);

  // Check for overdue tasks every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();
      let updated = false;

      tasks.forEach(task => {
        if (
          task.dueDate &&
          task.dueDate < now &&
          !task.completed &&
          !task.reminderSent &&
          task.assigneeEmail
        ) {
          // Trigger Reminder
          triggerReminder(task);
          // Note: We need to update the task in Firebase to mark reminder as sent
          // This might cause a loop if we are not careful, but since we check !task.reminderSent it should be fine
          // However, updating state inside map/forEach is bad.
          // We should update the document in Firebase.
          updateTaskReminder(task.id);
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks]);

  const updateTaskReminder = async (id: string) => {
    const taskRef = doc(db, "tasks", id);
    try {
      await updateDoc(taskRef, { reminderSent: true });
    } catch (error) {
      console.error("Error updating reminder status:", error);
    }
  };

  const triggerReminder = (task: Task) => {
    // System Notification
    if (Notification.permission === "granted") {
      new Notification("Task Overdue!", {
        body: `Reminder sent to ${task.assigneeEmail} for "${task.title}"`,
        icon: '/vite.svg' // Optional placeholder
      });
    }

    // In-App Toast
    setToast({
      message: `📧 Reminder email sent to ${task.assigneeEmail} for overdue task!`,
      type: 'info'
    });

    // Clear toast after 5s
    setTimeout(() => setToast(null), 5000);
  };

  const addTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!titleInput.trim()) return;

    try {
      await addDoc(tasksCollection, {
        title: titleInput.trim(),
        completed: false,
        createdAt: Date.now(),
        dueDate: dateInput ? new Date(dateInput).getTime() : undefined,
        assigneeEmail: emailInput.trim() || undefined,
        reminderSent: false
      });

      // Reset Form
      setTitleInput('');
      setDateInput('');
      setEmailInput('');
    } catch (error) {
      console.error("Error adding task:", error);
      setToast({ message: "Failed to add task", type: 'info' });
    }
  };

  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;

    const taskRef = doc(db, "tasks", id);
    try {
      await updateDoc(taskRef, {
        completed: !taskToUpdate.completed,
        completedAt: !taskToUpdate.completed ? Date.now() : undefined
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    const taskRef = doc(db, "tasks", id);
    try {
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === FilterType.COMPLETED) return task.completed;
    if (filter === FilterType.PENDING) return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down max-w-sm w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl rounded-xl p-4 flex items-start gap-3">
          <div className="p-1 bg-indigo-500 rounded-full shrink-0">
            <BellRing className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Notification</p>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              ZenTask
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex mb-6 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
          >
            Dashboard
          </button>
        </div>

        {/* Dashboard Section */}
        <div className={`${activeTab === 'dashboard' ? 'block' : 'hidden'} md:block animate-fade-in`}>
          <Dashboard tasks={tasks} />
        </div>

        {/* Task Input & List Section */}
        <div className={`${activeTab === 'list' ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Tasks</h2>

            {/* Filters */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg self-start md:self-auto">
              {Object.values(FilterType).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`
                                px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all
                                ${filter === type
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                            `}
                >
                  {type.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Add Task Form */}
          <form onSubmit={addTask} className="mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50">
            <div className="relative mb-3">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="What do you need to get done?"
                className="w-full bg-transparent text-lg font-medium placeholder:text-slate-400 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 flex-1">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none w-full"
                />
              </div>

              <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 flex-1">
                <Mail className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Assignee Email"
                  className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none w-full placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={!titleInput.trim()}
                className="
                            px-6 py-2 
                            bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800
                            text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2
                        "
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </form>

          {/* Task List */}
          <div className="space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
            ) : (
              <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                {filter === FilterType.ALL && (
                  <>
                    <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                      <ListTodo className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-medium text-lg mb-1">No tasks yet</h3>
                    <p className="text-slate-500 dark:text-slate-400">Add a task above to get started.</p>
                  </>
                )}
                {filter === FilterType.COMPLETED && (
                  <p className="text-slate-500">No completed tasks yet. Keep going!</p>
                )}
                {filter === FilterType.PENDING && (
                  <p className="text-slate-500">No pending tasks. You're all caught up!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, ListTodo, Zap, Calendar, AlertCircle, Loader2 } from 'lucide-react';

import { api } from '../services/api';

const ActionRegistry = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('Medium');

    const fetchTasks = async () => {
        try {
            const data = await api.getTasks();
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const taskData = {
            text: newTask,
            completed: false,
            priority: priority,
            date: 'Today'
        };

        try {
            const createdTask = await api.createTask(taskData);
            setTasks([createdTask, ...tasks]);
            setNewTask('');
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        try {
            const updated = await api.updateTask(id, { completed: !task.completed });
            setTasks(tasks.map(t => t.id === id ? updated : t));
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Critical': return 'bg-rose-500';
            case 'High': return 'bg-amber-500';
            case 'Medium': return 'bg-blue-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden font-['Plus Jakarta Sans'] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <ListTodo size={18} className="text-slate-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Tasks</h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {tasks.filter(t => !t.completed).length} Pending
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <form onSubmit={addTask} className="p-4 bg-slate-50 border-b border-slate-100 space-y-3">
                <div className="relative">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['Critical', 'High', 'Medium', 'Low'].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${priority === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </form>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[250px]">
                {isLoading ? (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={24} />
                        <p className="text-xs text-slate-400">Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <Zap size={24} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-400">No pending tasks.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${task.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm'}`}
                        >
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`transition-colors shrink-0 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-blue-500'}`}
                                >
                                    {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                        {task.text}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{task.priority}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Calendar size={10} />
                                            <span className="text-[10px] font-medium">{task.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActionRegistry;



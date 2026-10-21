import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FunctionForm } from '../features/functions/FunctionForm';
import { TaskForm } from '../features/tasks/TaskForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  User, 
  MapPin, 
  MessageSquare, 
  Send,
  AlertCircle
} from 'lucide-react';
import { inputClasses } from '../components/ui/FormField';

export function FamilyCoordination({
  functions = [],
  tasks = [],
  announcements = [],
  members = [],
  onAddFunction,
  onUpdateFunction,
  onDeleteFunction,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskStatus,
  onAddAnnouncement,
}) {
  const [activeTab, setActiveTab] = useState('functions'); // 'functions' | 'tasks' | 'announcements'

  // Modals state
  const [isFunctionModalOpen, setIsFunctionModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState(null);
  const [deletingFunction, setDeletingFunction] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Filters for tasks
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');
  const [taskMemberFilter, setTaskMemberFilter] = useState('All');

  // Announcement state
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcementAuthor, setAnnouncementAuthor] = useState(members[0]?.name || 'Family Member');

  // Helpers
  const getMemberName = (memberId) => {
    const found = members.find((m) => m.id === memberId);
    return found ? found.name : 'Unassigned';
  };

  const getFunctionName = (fnId) => {
    const found = functions.find((f) => f.id === fnId);
    return found ? found.name : null;
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Completed') return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Function handlers
  const handleSaveFunction = (data) => {
    if (editingFunction) {
      onUpdateFunction({ ...data, id: editingFunction.id, wedding_id: editingFunction.wedding_id });
    } else {
      onAddFunction({ ...data, id: `fn-${Date.now()}`, wedding_id: 'wed-001' });
    }
  };

  // Task handlers
  const handleSaveTask = (data) => {
    if (editingTask) {
      onUpdateTask({ ...data, id: editingTask.id, wedding_id: editingTask.wedding_id });
    } else {
      onAddTask({ ...data, id: `task-${Date.now()}`, wedding_id: 'wed-001' });
    }
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    onAddAnnouncement({
      id: `ann-${Date.now()}`,
      wedding_id: 'wed-001',
      message: newAnnouncement.trim(),
      author_name: announcementAuthor,
      created_at: new Date().toISOString(),
    });
    setNewAnnouncement('');
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = taskStatusFilter === 'All' || t.status === taskStatusFilter;
    const matchesMember = taskMemberFilter === 'All' || t.assigned_member_id === taskMemberFilter;
    return matchesStatus && matchesMember;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Coordination"
        subtitle="Organize wedding functions, assign family tasks, and share important announcements"
      />

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-200/80 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('functions')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'functions'
              ? 'border-sage-700 text-sage-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Wedding Functions ({functions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'border-sage-700 text-sage-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Family Tasks ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'border-sage-700 text-sage-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Family Announcements ({announcements.length})</span>
        </button>
      </div>

      {/* SECTION 1: WEDDING FUNCTIONS */}
      {activeTab === 'functions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Ceremonies & Itinerary
            </h3>
            <Button
              size="sm"
              onClick={() => {
                setEditingFunction(null);
                setIsFunctionModalOpen(true);
              }}
              icon={PlusCircle}
            >
              Add Function
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {functions.map((fn) => (
              <Card key={fn.id} padding="default" className="relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800">
                      {fn.status || 'Confirmed'}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-stone-900 mt-2">
                      {fn.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFunction(fn);
                        setIsFunctionModalOpen(true);
                      }}
                      className="p-1.5 text-stone-400 hover:text-sage-700 rounded-lg hover:bg-stone-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingFunction(fn)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>
                      {new Date(fn.starts_at).toLocaleString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{fn.venue}</span>
                  </div>
                  {fn.notes && (
                    <p className="pt-2 text-stone-500 italic border-t border-stone-100">
                      "{fn.notes}"
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: FAMILY TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className={`${inputClasses} py-1.5 px-3 text-xs w-auto`}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={taskMemberFilter}
                onChange={(e) => setTaskMemberFilter(e.target.value)}
                className={`${inputClasses} py-1.5 px-3 text-xs w-auto`}
              >
                <option value="All">All Assignees</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              icon={PlusCircle}
            >
              Add Task
            </Button>
          </div>

          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <p className="text-sm text-stone-400 py-8 text-center bg-white rounded-2xl border border-stone-200">
                No tasks match your filters.
              </p>
            ) : (
              filteredTasks.map((t) => {
                const overdue = isOverdue(t.due_date, t.status);
                const relatedFn = getFunctionName(t.function_id);

                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border bg-white transition-colors flex items-start justify-between gap-3 ${
                      overdue ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleTaskStatus(t.id)}
                        className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                          t.status === 'Completed'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-stone-300 text-transparent hover:border-emerald-500'
                        }`}
                        title="Toggle task completion"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-sm font-semibold ${
                              t.status === 'Completed'
                                ? 'line-through text-stone-400'
                                : 'text-stone-900'
                            }`}
                          >
                            {t.title}
                          </h4>
                          {overdue && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                              <AlertCircle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                              t.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : t.status === 'In Progress'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>

                        {t.description && (
                          <p className="text-xs text-stone-500 mt-1 max-w-xl">
                            {t.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-stone-400 flex-wrap">
                          <span className="flex items-center gap-1 text-stone-600">
                            <User className="w-3 h-3 text-stone-400" />
                            {getMemberName(t.assigned_member_id)}
                          </span>
                          {t.due_date && (
                            <span className={`flex items-center gap-1 ${overdue ? 'text-rose-600 font-semibold' : ''}`}>
                              <Clock className="w-3 h-3" />
                              Due: {t.due_date}
                            </span>
                          )}
                          {relatedFn && (
                            <span className="text-stone-500">
                              &bull; {relatedFn}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingTask(t);
                          setIsTaskModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-sage-700 rounded-lg hover:bg-stone-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTask(t)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: FAMILY ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Post announcement box */}
          <Card padding="default">
            <CardHeader
              title="Post Family Announcement"
              subtitle="Share updates, reminders, or dress code notes with all family members"
            />
            <form onSubmit={handlePostAnnouncement} className="mt-4 space-y-3">
              <textarea
                rows={3}
                placeholder="Write an announcement for the family..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                className={inputClasses}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <span>Posting as:</span>
                  <select
                    value={announcementAuthor}
                    onChange={(e) => setAnnouncementAuthor(e.target.value)}
                    className="py-1 px-2.5 rounded-lg border border-stone-200 text-xs bg-white"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" size="sm" icon={Send}>
                  Post Update
                </Button>
              </div>
            </form>
          </Card>

          {/* Announcements list */}
          <div className="space-y-3">
            {announcements.map((ann) => (
              <Card key={ann.id} padding="default" className="border-l-4 border-l-sage-600">
                <p className="text-sm text-stone-800 leading-relaxed font-normal">
                  {ann.message}
                </p>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span className="font-semibold text-stone-700">{ann.author_name}</span>
                  <span>{new Date(ann.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Function Modals */}
      <FunctionForm
        isOpen={isFunctionModalOpen}
        onClose={() => setIsFunctionModalOpen(false)}
        onSubmit={handleSaveFunction}
        initialData={editingFunction}
      />

      <ConfirmDialog
        isOpen={!!deletingFunction}
        onClose={() => setDeletingFunction(null)}
        onConfirm={() => {
          if (deletingFunction) onDeleteFunction(deletingFunction.id);
        }}
        title="Delete Function"
        message={`Are you sure you want to delete "${deletingFunction?.name}"?`}
      />

      {/* Task Modals */}
      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        members={members}
        functions={functions}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) onDeleteTask(deletingTask.id);
        }}
        title="Delete Task"
        message={`Are you sure you want to delete task "${deletingTask?.title}"?`}
      />
    </div>
  );
}

export default FamilyCoordination;

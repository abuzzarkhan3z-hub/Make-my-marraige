import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Invitations } from './pages/Invitations';
import { FamilyCoordination } from './pages/FamilyCoordination';
import { SettingsAdmin } from './pages/SettingsAdmin';
import { ExpenseForm } from './features/expenses/ExpenseForm';
import { AuthModal } from './components/auth/AuthModal';
import { CreateWeddingModal } from './components/wedding/CreateWeddingModal';
import { useAuth } from './context/AuthContext';
import { isSupabaseConfigured } from './lib/supabase';

// Supabase services
import * as weddingService from './services/weddings';
import * as expenseService from './services/expenses';
import * as functionService from './services/functions';
import * as taskService from './services/tasks';
import * as guestService from './services/guests';
import * as invitationService from './services/invitations';
import * as announcementService from './services/announcements';
import * as memberService from './services/members';

import {
  initialWedding,
  initialMembers,
  initialFunctions,
  initialExpenses,
  initialTasks,
  initialAnnouncements,
  initialInvitation,
  initialGuests,
} from './data/sampleData';

const STORAGE_KEY = 'mmm_prototype_state_v1';

export function App() {
  const { user, profile, isConfigured } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  // Modals
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);
  const [isCreateWeddingOpen, setIsCreateWeddingOpen] = useState(false);
  const [isLoadingWeddingData, setIsLoadingWeddingData] = useState(false);

  // App State
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      wedding: initialWedding,
      members: initialMembers,
      functions: initialFunctions,
      expenses: initialExpenses,
      tasks: initialTasks,
      announcements: initialAnnouncements,
      invitation: initialInvitation,
      guests: initialGuests,
    };
  });

  // Sync to localStorage when running in local prototype mode
  useEffect(() => {
    if (!isConfigured || !user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // storage disabled or full
      }
    }
  }, [state, isConfigured, user]);

  // Load user's live data from Supabase when authenticated
  const loadSupabaseData = useCallback(async () => {
    if (!isConfigured || !user) return;

    setIsLoadingWeddingData(true);
    try {
      // 1. Fetch user weddings
      const { data: weddings, error: wedError } = await weddingService.getUserWeddings();
      if (wedError) throw wedError;

      if (!weddings || weddings.length === 0) {
        // User has no weddings yet; keep state clean or prompt to create one
        setState((prev) => ({
          ...prev,
          wedding: null,
          expenses: [],
          functions: [],
          tasks: [],
          announcements: [],
          guests: [],
          members: [],
        }));
        setIsLoadingWeddingData(false);
        return;
      }

      const activeWedding = weddings[0];

      // 2. Fetch all collections in parallel for the active wedding
      const [
        expensesRes,
        functionsRes,
        tasksRes,
        announcementsRes,
        guestsRes,
        invitationRes,
        membersRes,
      ] = await Promise.all([
        expenseService.getExpenses(activeWedding.id),
        functionService.getWeddingFunctions(activeWedding.id),
        taskService.getTasks(activeWedding.id),
        announcementService.getAnnouncements(activeWedding.id),
        guestService.getGuests(activeWedding.id),
        invitationService.getPrimaryInvitation(activeWedding.id),
        memberService.getWeddingMembers(activeWedding.id),
      ]);

      setState({
        wedding: activeWedding,
        expenses: expensesRes.data || [],
        functions: functionsRes.data || [],
        tasks: tasksRes.data || [],
        announcements: announcementsRes.data || [],
        guests: guestsRes.data || [],
        invitation: invitationRes.data || {
          ...initialInvitation,
          wedding_id: activeWedding.id,
          couple_names: activeWedding.couple_names || activeWedding.name,
        },
        members: membersRes.data || [],
      });
    } catch (err) {
      console.error('Error loading Supabase data:', err);
    } finally {
      setIsLoadingWeddingData(false);
    }
  }, [isConfigured, user]);

  useEffect(() => {
    if (isConfigured && user) {
      loadSupabaseData();
    }
  }, [isConfigured, user, loadSupabaseData]);

  // ================= EXPENSE HANDLERS =================
  const handleAddExpense = async (newExpense) => {
    if (isConfigured && user && state.wedding?.id) {
      try {
        const created = await expenseService.createExpense(state.wedding.id, newExpense);
        setState((prev) => ({
          ...prev,
          expenses: [created, ...prev.expenses],
        }));
        return;
      } catch (err) {
        console.error('Failed to create expense in Supabase:', err);
      }
    }
    // Fallback local update
    setState((prev) => ({
      ...prev,
      expenses: [
        {
          ...newExpense,
          id: newExpense.id || `exp-${Date.now()}`,
          wedding_id: state.wedding?.id || 'wed-001',
        },
        ...prev.expenses,
      ],
    }));
  };

  const handleUpdateExpense = async (updatedExpense) => {
    if (isConfigured && user && !updatedExpense.id.startsWith('exp-')) {
      try {
        const updated = await expenseService.updateExpense(updatedExpense.id, updatedExpense);
        setState((prev) => ({
          ...prev,
          expenses: prev.expenses.map((e) => (e.id === updated.id ? updated : e)),
        }));
        return;
      } catch (err) {
        console.error('Failed to update expense in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)),
    }));
  };

  const handleDeleteExpense = async (expenseId) => {
    if (isConfigured && user && !expenseId.startsWith('exp-')) {
      try {
        await expenseService.deleteExpense(expenseId);
      } catch (err) {
        console.error('Failed to delete expense in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
  };

  // ================= WEDDING FUNCTION HANDLERS =================
  const handleAddFunction = async (fn) => {
    if (isConfigured && user && state.wedding?.id) {
      try {
        const created = await functionService.createWeddingFunction(state.wedding.id, fn);
        setState((prev) => ({
          ...prev,
          functions: [...prev.functions, created],
        }));
        return;
      } catch (err) {
        console.error('Failed to create function in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      functions: [
        ...prev.functions,
        { ...fn, id: fn.id || `fn-${Date.now()}`, wedding_id: state.wedding?.id || 'wed-001' },
      ],
    }));
  };

  const handleUpdateFunction = async (fn) => {
    if (isConfigured && user && !fn.id.startsWith('fn-')) {
      try {
        const updated = await functionService.updateWeddingFunction(fn.id, fn);
        setState((prev) => ({
          ...prev,
          functions: prev.functions.map((f) => (f.id === updated.id ? updated : f)),
        }));
        return;
      } catch (err) {
        console.error('Failed to update function in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      functions: prev.functions.map((f) => (f.id === fn.id ? fn : f)),
    }));
  };

  const handleDeleteFunction = async (fnId) => {
    if (isConfigured && user && !fnId.startsWith('fn-')) {
      try {
        await functionService.deleteWeddingFunction(fnId);
      } catch (err) {
        console.error('Failed to delete function in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      functions: prev.functions.filter((f) => f.id !== fnId),
    }));
  };

  // ================= TASK HANDLERS =================
  const handleAddTask = async (task) => {
    if (isConfigured && user && state.wedding?.id) {
      try {
        const created = await taskService.createTask(state.wedding.id, task);
        setState((prev) => ({
          ...prev,
          tasks: [created, ...prev.tasks],
        }));
        return;
      } catch (err) {
        console.error('Failed to create task in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      tasks: [
        { ...task, id: task.id || `task-${Date.now()}`, wedding_id: state.wedding?.id || 'wed-001' },
        ...prev.tasks,
      ],
    }));
  };

  const handleUpdateTask = async (task) => {
    if (isConfigured && user && !task.id.startsWith('task-')) {
      try {
        const updated = await taskService.updateTask(task.id, task);
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
        }));
        return;
      } catch (err) {
        console.error('Failed to update task in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  };

  const handleDeleteTask = async (taskId) => {
    if (isConfigured && user && !taskId.startsWith('task-')) {
      try {
        await taskService.deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleToggleTaskStatus = async (taskId) => {
    const existing = state.tasks.find((t) => t.id === taskId);
    if (!existing) return;

    const nextStatus =
      existing.status === 'Completed'
        ? 'Pending'
        : existing.status === 'Pending'
        ? 'In Progress'
        : 'Completed';

    if (isConfigured && user && !taskId.startsWith('task-')) {
      try {
        const updated = await taskService.updateTask(taskId, { status: nextStatus });
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
        }));
        return;
      } catch (err) {
        console.error('Failed to update task status in Supabase:', err);
      }
    }

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
    }));
  };

  // ================= ANNOUNCEMENTS =================
  const handleAddAnnouncement = async (ann) => {
    const authorName = profile?.full_name || user?.email?.split('@')[0] || ann.author_name || 'Family Organizer';

    if (isConfigured && user && state.wedding?.id) {
      try {
        const created = await announcementService.createAnnouncement(
          state.wedding.id,
          ann,
          authorName
        );
        setState((prev) => ({
          ...prev,
          announcements: [created, ...prev.announcements],
        }));
        return;
      } catch (err) {
        console.error('Failed to create announcement in Supabase:', err);
      }
    }

    setState((prev) => ({
      ...prev,
      announcements: [
        {
          ...ann,
          id: ann.id || `ann-${Date.now()}`,
          author_name: authorName,
          created_at: new Date().toISOString(),
          wedding_id: state.wedding?.id || 'wed-001',
        },
        ...prev.announcements,
      ],
    }));
  };

  // ================= INVITATIONS =================
  const handleUpdateInvitation = async (inv) => {
    if (isConfigured && user && state.wedding?.id) {
      try {
        const saved = await invitationService.savePrimaryInvitation(state.wedding.id, inv);
        setState((prev) => ({
          ...prev,
          invitation: saved,
        }));
        return;
      } catch (err) {
        console.error('Failed to save invitation in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      invitation: inv,
    }));
  };

  // ================= GUESTS =================
  const handleAddGuest = async (guest) => {
    if (isConfigured && user && state.wedding?.id) {
      try {
        const created = await guestService.createGuest(state.wedding.id, guest);
        setState((prev) => ({
          ...prev,
          guests: [...prev.guests, created],
        }));
        return;
      } catch (err) {
        console.error('Failed to create guest in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        { ...guest, id: guest.id || `g-${Date.now()}`, wedding_id: state.wedding?.id || 'wed-001' },
      ],
    }));
  };

  const handleDeleteGuest = async (guestId) => {
    if (isConfigured && user && !guestId.startsWith('g-')) {
      try {
        await guestService.deleteGuest(guestId);
      } catch (err) {
        console.error('Failed to delete guest in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== guestId),
    }));
  };

  // ================= MEMBERS =================
  const handleAddMember = async (member) => {
    setState((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        { ...member, id: member.id || `mem-${Date.now()}`, wedding_id: state.wedding?.id || 'wed-001' },
      ],
    }));
  };

  const handleDeleteMember = async (memberId) => {
    if (isConfigured && user && !memberId.startsWith('mem-')) {
      try {
        await memberService.removeWeddingMember(memberId);
      } catch (err) {
        console.error('Failed to remove member in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
  };

  // ================= WEDDING SETTINGS =================
  const handleUpdateWedding = async (updatedWedding) => {
    if (isConfigured && user && state.wedding?.id && !state.wedding.id.startsWith('wed-')) {
      try {
        const updated = await weddingService.updateWedding(state.wedding.id, updatedWedding);
        setState((prev) => ({
          ...prev,
          wedding: updated,
        }));
        return;
      } catch (err) {
        console.error('Failed to update wedding in Supabase:', err);
      }
    }
    setState((prev) => ({
      ...prev,
      wedding: updatedWedding,
    }));
  };

  const handleWeddingCreated = (newWedding) => {
    setState((prev) => ({
      ...prev,
      wedding: newWedding,
      expenses: [],
      functions: [],
      tasks: [],
      announcements: [],
      guests: [],
      members: [
        {
          id: `mem-${Date.now()}`,
          name: profile?.full_name || user?.email?.split('@')[0] || 'Admin',
          role: 'Admin',
          email: user?.email || '',
        },
      ],
    }));
    setActivePage('dashboard');
  };

  return (
    <AppLayout
      activePage={activePage}
      setActivePage={setActivePage}
      wedding={state.wedding}
      onOpenCreateWedding={() => setIsCreateWeddingOpen(true)}
    >
      {/* Loading state indicator for Supabase data fetch */}
      {isLoadingWeddingData && (
        <div className="mb-4 px-4 py-2 bg-sage-50 border border-sage-200/80 rounded-xl text-xs text-sage-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sage-600 animate-ping" />
          <span>Synchronizing with Supabase workspace...</span>
        </div>
      )}

      {/* When authenticated user has no wedding yet */}
      {user && !state.wedding && !isLoadingWeddingData && (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center max-w-lg mx-auto my-8 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">💍</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
            No Wedding Workspace Found
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            You don’t have an active wedding workspace yet. Create your wedding now to start planning with your family.
          </p>
          <button
            onClick={() => setIsCreateWeddingOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-medium text-sm transition-colors shadow-sm"
          >
            Create Your Wedding
          </button>
        </div>
      )}

      {/* Main Pages */}
      {(!user || state.wedding) && (
        <>
          {activePage === 'dashboard' && (
            <Dashboard
              wedding={state.wedding}
              expenses={state.expenses}
              functions={state.functions}
              tasks={state.tasks}
              onNavigate={setActivePage}
              onOpenAddExpense={() => setIsQuickExpenseOpen(true)}
            />
          )}

          {activePage === 'expenses' && (
            <Expenses
              expenses={state.expenses}
              functions={state.functions}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activePage === 'invitations' && (
            <Invitations
              invitation={state.invitation}
              onUpdateInvitation={handleUpdateInvitation}
              guests={state.guests}
              onAddGuest={handleAddGuest}
              onDeleteGuest={handleDeleteGuest}
            />
          )}

          {activePage === 'coordination' && (
            <FamilyCoordination
              functions={state.functions}
              tasks={state.tasks}
              announcements={state.announcements}
              members={state.members}
              onAddFunction={handleAddFunction}
              onUpdateFunction={handleUpdateFunction}
              onDeleteFunction={handleDeleteFunction}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTaskStatus={handleToggleTaskStatus}
              onAddAnnouncement={handleAddAnnouncement}
            />
          )}

          {activePage === 'settings' && (
            <SettingsAdmin
              wedding={state.wedding}
              onUpdateWedding={handleUpdateWedding}
              members={state.members}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
            />
          )}
        </>
      )}

      {/* Quick Add Expense Modal */}
      <ExpenseForm
        isOpen={isQuickExpenseOpen}
        onClose={() => setIsQuickExpenseOpen(false)}
        onSubmit={(newExpense) => {
          handleAddExpense({
            ...newExpense,
            id: `exp-${Date.now()}`,
            wedding_id: state.wedding?.id || 'wed-001',
          });
        }}
        functions={state.functions}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal />

      {/* Create Wedding Modal */}
      <CreateWeddingModal
        isOpen={isCreateWeddingOpen}
        onClose={() => setIsCreateWeddingOpen(false)}
        onWeddingCreated={handleWeddingCreated}
      />
    </AppLayout>
  );
}

export default App;

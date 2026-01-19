
import { Home, NotebookPen, Moon, Dumbbell, User, Calendar, Plus } from 'lucide-react';

export const USER_DATA = {
  name: "Alex",
  avatarUrl: null, // Use placeholder logic
  streakDays: 3,
  lastSession: "2 days ago"
};

export const WEEKLY_ACTIVITY = [
  { day: 'M', status: false },
  { day: 'T', status: true },
  { day: 'W', status: false },
  { day: 'T', status: true },
  { day: 'F', status: true }, // Today?
  { day: 'S', status: false },
  { day: 'S', status: false },
];

export const ROUTINES = [
  {
    id: 1,
    name: "Leg Day B",
    duration: "60-75 min",
    focus: "Hypertrophy",
    exercises: [
      { id: 'l1', name: 'Barbell Squat', setCount: 4, muscles: 'Legs', image: null },
      { id: 'l2', name: 'Leg Press', setCount: 3, muscles: 'Legs', image: null }
    ]
  },
  {
    id: 2,
    name: "Pull Day A",
    duration: "50-60 min",
    focus: "Strength",
    exercises: [
      { id: 'p1', name: 'Deadlift', setCount: 3, muscles: 'Back', image: null },
      { id: 'p2', name: 'Pull Ups', setCount: 3, muscles: 'Back', image: null }
    ]
  },
  {
    id: 3,
    name: "Push Day A",
    duration: "55-65 min",
    focus: "Strength",
    exercises: [
      { id: 'pu1', name: 'Bench Press', setCount: 4, muscles: 'Chest', image: null },
      { id: 'pu2', name: 'Overhead Press', setCount: 3, muscles: 'Shoulders', image: null }
    ]
  },
];

export const RECENT_PRS = [
  {
    id: 1,
    exercise: "Bench Press",
    weight: "225 lbs",
    improvement: "+5 lbs",
  },
  {
    id: 2,
    exercise: "Deadlift",
    weight: "315 lbs",
    improvement: "+10 lbs",
  },
  {
    id: 3,
    exercise: "Squat",
    weight: "275 lbs",
    improvement: "+5 lbs",
  },
];

export const LAST_WORKOUT = {
  name: "Upper Body Power",
  date: "Tuesday, 10:30 AM",
  duration: "55 min",
  volume: "12k kg",
  records: 2,
  exercises: ['CH', 'TR', 'SH'] // Chest, Tricep, Shoulder
};

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'log', label: 'Log', icon: Calendar }, // Changed label to Log, icon to Calendar
  { id: 'add', label: 'Add', icon: Plus, isFab: true }, // Icon Plus, handled specially
  { id: 'exercise', label: 'Exercise', icon: Dumbbell }, // Changed id to 'exercise' (singular per requirement description, though usually plural, stick to requirement or common sense? Req says 'Exercise'), label 'Exercise'
  { id: 'profile', label: 'Profile', icon: User },
];

export const MOCK_HISTORY_DATA = {
  workoutDays: [2, 5, 7, 9, 12, 14, 16, 21, 23, 24, 28, 30], // Dates in October with workouts
  selectedDate: {
    fullDate: "Wednesday, Oct 24",
    workout: {
      title: "Upper Body Hypertrophy",
      category: "STRENGTH",
      duration: "1h 15m",
      calories: "440 kcal",
      status: "Completed",
      exercises: [
        { id: 1, name: "Barbell Squat", performance: "225 lbs x 5", isPR: true, trend: "up" },
        { id: 2, name: "Bench Press", performance: "185 lbs x 8", isPR: false, trend: "up" },
        { id: 3, name: "Pull Ups", performance: "BW + 25lbs x 8", isPR: false, trend: "stable" },
        { id: 4, name: "Face Pulls", performance: "45 lbs x 15", isPR: false, trend: "up" },
      ]
    }
  }
};

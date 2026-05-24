'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserSettings, DailyNutrition, MealEntry, DEFAULT_SETTINGS, WorkoutDay, DailyQuest, DAILY_QUESTS, BodyChartPRs } from './types'
import { DEFAULT_WORKOUT_SPLIT } from './exercise-data'

interface QuestState {
  quest: DailyQuest
  progress: number
  completed: boolean
  assignedDate: string
}

interface AppState {
  settings: UserSettings
  riseScore: number
  streak: number
  nutrition: DailyNutrition
  workoutSplit: WorkoutDay[]
  questState: QuestState | null
  bodyPRs: BodyChartPRs
  updateSettings: (settings: Partial<UserSettings>) => void
  addRiseScore: (points: number) => void
  addMealEntry: (meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks', entry: MealEntry) => void
  removeMealEntry: (meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks', entryId: string) => void
  getTodayTotals: () => { calories: number; protein: number; carbs: number; fats: number }
  addExerciseToDay: (dayIndex: number, exercise: import('./types').Exercise) => void
  removeExerciseFromDay: (dayIndex: number, exerciseId: string) => void
  updateExercise: (dayIndex: number, exerciseId: string, updates: Partial<import('./types').Exercise>) => void
  updateQuestProgress: (progress: number) => void
  completeQuest: () => void
  updateBodyPR: (group: keyof BodyChartPRs, exerciseId: string, value: number) => void
  resetAllPRs: () => void
}

const AppContext = createContext<AppState | undefined>(undefined)

const getTodayString = () => new Date().toISOString().split('T')[0]

const getEmptyNutrition = (): DailyNutrition => ({
  date: getTodayString(),
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
})

const getEmptyPRs = (): BodyChartPRs => ({
  chest: {},
  back: {},
  shoulders: {},
  arms: {},
  legs: {},
  core: {},
})

function getDailyQuest(dateString: string): DailyQuest {
  // Use date as seed for consistent daily quest
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0)
  const index = seed % DAILY_QUESTS.length
  return DAILY_QUESTS[index]
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [riseScore, setRiseScore] = useState(5250)
  const [streak, setStreak] = useState(7)
  const [nutrition, setNutrition] = useState<DailyNutrition>(getEmptyNutrition())
  const [workoutSplit, setWorkoutSplit] = useState<WorkoutDay[]>(DEFAULT_WORKOUT_SPLIT)
  const [questState, setQuestState] = useState<QuestState | null>(null)
  const [bodyPRs, setBodyPRs] = useState<BodyChartPRs>(getEmptyPRs())
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('rise-settings')
    const savedScore = localStorage.getItem('rise-score')
    const savedStreak = localStorage.getItem('rise-streak')
    const savedNutrition = localStorage.getItem('rise-nutrition')
    const savedWorkout = localStorage.getItem('rise-workout')
    const savedQuest = localStorage.getItem('rise-quest')
    const savedPRs = localStorage.getItem('rise-body-prs')

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch {}
    }
    if (savedScore) {
      try {
        setRiseScore(JSON.parse(savedScore))
      } catch {}
    }
    if (savedStreak) {
      try {
        setStreak(JSON.parse(savedStreak))
      } catch {}
    }
    if (savedNutrition) {
      try {
        const parsed = JSON.parse(savedNutrition)
        if (parsed.date === getTodayString()) {
          setNutrition(parsed)
        }
      } catch {}
    }
    if (savedWorkout) {
      try {
        setWorkoutSplit(JSON.parse(savedWorkout))
      } catch {}
    }
    if (savedQuest) {
      try {
        const parsed = JSON.parse(savedQuest)
        if (parsed.assignedDate === getTodayString()) {
          setQuestState(parsed)
        } else {
          // New day, new quest
          const newQuest = getDailyQuest(getTodayString())
          setQuestState({
            quest: newQuest,
            progress: 0,
            completed: false,
            assignedDate: getTodayString(),
          })
        }
      } catch {}
    } else {
      // Initialize quest
      const newQuest = getDailyQuest(getTodayString())
      setQuestState({
        quest: newQuest,
        progress: 0,
        completed: false,
        assignedDate: getTodayString(),
      })
    }
    if (savedPRs) {
      try {
        setBodyPRs(JSON.parse(savedPRs))
      } catch {}
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('rise-settings', JSON.stringify(settings))
  }, [settings, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('rise-score', JSON.stringify(riseScore))
  }, [riseScore, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('rise-streak', JSON.stringify(streak))
  }, [streak, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('rise-nutrition', JSON.stringify(nutrition))
  }, [nutrition, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('rise-workout', JSON.stringify(workoutSplit))
  }, [workoutSplit, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    if (questState) {
      localStorage.setItem('rise-quest', JSON.stringify(questState))
    }
  }, [questState, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('rise-body-prs', JSON.stringify(bodyPRs))
  }, [bodyPRs, isLoaded])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const addRiseScore = (points: number) => {
    setRiseScore(prev => prev + points)
  }

  const addMealEntry = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks', entry: MealEntry) => {
    setNutrition(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [meal]: [...prev.meals[meal], entry],
      },
    }))
  }

  const removeMealEntry = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks', entryId: string) => {
    setNutrition(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [meal]: prev.meals[meal].filter(e => e.id !== entryId),
      },
    }))
  }

  const getTodayTotals = () => {
    const allMeals = [
      ...nutrition.meals.breakfast,
      ...nutrition.meals.lunch,
      ...nutrition.meals.dinner,
      ...nutrition.meals.snacks,
    ]
    return {
      calories: allMeals.reduce((sum, e) => sum + e.calories, 0),
      protein: allMeals.reduce((sum, e) => sum + e.protein, 0),
      carbs: allMeals.reduce((sum, e) => sum + e.carbs, 0),
      fats: allMeals.reduce((sum, e) => sum + e.fats, 0),
    }
  }

  const addExerciseToDay = (dayIndex: number, exercise: import('./types').Exercise) => {
    setWorkoutSplit(prev => {
      const updated = [...prev]
      updated[dayIndex] = {
        ...updated[dayIndex],
        exercises: [...updated[dayIndex].exercises, exercise],
      }
      return updated
    })
  }

  const removeExerciseFromDay = (dayIndex: number, exerciseId: string) => {
    setWorkoutSplit(prev => {
      const updated = [...prev]
      updated[dayIndex] = {
        ...updated[dayIndex],
        exercises: updated[dayIndex].exercises.filter(e => e.id !== exerciseId),
      }
      return updated
    })
  }

  const updateExercise = (dayIndex: number, exerciseId: string, updates: Partial<import('./types').Exercise>) => {
    setWorkoutSplit(prev => {
      const updated = [...prev]
      updated[dayIndex] = {
        ...updated[dayIndex],
        exercises: updated[dayIndex].exercises.map(e =>
          e.id === exerciseId ? { ...e, ...updates } : e
        ),
      }
      return updated
    })
  }

  const updateQuestProgress = (progress: number) => {
    if (questState && !questState.completed) {
      setQuestState(prev => prev ? { ...prev, progress: Math.min(progress, prev.quest.target) } : null)
    }
  }

  const completeQuest = () => {
    if (questState && !questState.completed) {
      setQuestState(prev => prev ? { ...prev, completed: true, progress: prev.quest.target } : null)
      addRiseScore(questState.quest.xpReward)
    }
  }

  const updateBodyPR = (group: keyof BodyChartPRs, exerciseId: string, value: number) => {
    setBodyPRs(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [exerciseId]: value,
      },
    }))
  }

  const resetAllPRs = () => {
    setBodyPRs(getEmptyPRs())
  }

  return (
    <AppContext.Provider
      value={{
        settings,
        riseScore,
        streak,
        nutrition,
        workoutSplit,
        questState,
        bodyPRs,
        updateSettings,
        addRiseScore,
        addMealEntry,
        removeMealEntry,
        getTodayTotals,
        addExerciseToDay,
        removeExerciseFromDay,
        updateExercise,
        updateQuestProgress,
        completeQuest,
        updateBodyPR,
        resetAllPRs,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

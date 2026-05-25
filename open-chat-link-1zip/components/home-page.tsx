'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { getRankByScore, getNextRank, getPointsToNextRank, getEstimatedDaysToNextRank, formatETA } from '@/lib/types'
import { Flame, TrendingUp, Trophy, Zap, Clock, Target, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function DailyQuestCard() {
  const { questState, updateQuestProgress, completeQuest } = useApp()
  const [timeToReset, setTimeToReset] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeToReset(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!questState) return null

  const { quest, progress, completed } = questState
  const progressPercent = Math.min((progress / quest.target) * 100, 100)
  const isRunning = quest.type === 'running'

  const handleProgressUpdate = () => {
    const value = parseFloat(inputValue)
    if (!isNaN(value) && value >= 0) {
      updateQuestProgress(value)
      setInputValue('')
    }
  }

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border bg-card p-4',
      completed ? 'border-green-500/50' : 'border-amber-500/50'
    )}>
      {/* Background glow */}
      <div className={cn(
        'absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl',
        completed ? 'bg-green-500/20' : isRunning ? 'bg-blue-500/20' : 'bg-amber-500/20'
      )} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              isRunning ? 'bg-blue-500/10' : 'bg-amber-500/10'
            )}>
              <Target className={cn('h-4 w-4', isRunning ? 'text-blue-500' : 'text-amber-500')} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Daily Quest
              </p>
              <h3 className="font-bold text-foreground">{quest.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="text-xs font-bold text-amber-500">+{quest.xpReward} XP</span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-muted-foreground">{quest.description}</p>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {progress} / {quest.target} {quest.unit}
            </span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                completed ? 'bg-green-500' : isRunning ? 'bg-blue-500' : 'bg-amber-500'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        {!completed ? (
          <div className="mt-4 flex gap-2">
            <div className="flex flex-1 gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter progress..."
                className="flex-1 rounded-xl bg-secondary px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleProgressUpdate}
                disabled={!inputValue}
                className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
              >
                Update
              </button>
            </div>
            <button
              onClick={completeQuest}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors',
                isRunning ? 'bg-blue-500 hover:bg-blue-600' : 'bg-amber-500 hover:bg-amber-600'
              )}
            >
              <Check className="h-4 w-4" />
              Complete
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-500/10 py-3">
            <Check className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-green-500">Quest Completed!</span>
          </div>
        )}

        {/* Timer */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Resets in {timeToReset}</span>
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  const { settings, riseScore, streak, getTodayTotals, workoutSplit } = useApp()
  const totals = getTodayTotals()
  const currentRank = getRankByScore(riseScore)
  const nextRank = getNextRank(riseScore)
  const pointsToNext = getPointsToNextRank(riseScore)
  const daysToNext = getEstimatedDaysToNextRank(riseScore)
  const topPercent = Math.max(1, Math.round((1 - riseScore / 30000) * 100))

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayWorkout = workoutSplit.find(d => d.day === today)

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hey, {settings.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-500">{streak} day streak</span>
        </div>
      </div>

      {/* Rank Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-border bg-card p-5',
          currentRank.glowClass
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Rise Rank
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl">{currentRank.symbol}</span>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    currentRank.name === 'Elite' && 'elite-text'
                  )}
                  style={{ color: currentRank.name !== 'Elite' ? currentRank.color : undefined }}
                >
                  {currentRank.name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {riseScore.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Rise Score</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Top {topPercent}%</span>
            </div>
          </div>

          {/* Next Rank Section */}
          {nextRank && (
            <div className="mt-4 rounded-xl bg-secondary/50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{nextRank.symbol}</span>
                  <span
                    className="font-semibold"
                    style={{ color: nextRank.color }}
                  >
                    {nextRank.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{pointsToNext.toLocaleString()} pts</span>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {formatETA(daysToNext)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Workout Status */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Workout Status</h3>
            <p className="text-sm text-muted-foreground">
              {todayWorkout?.name || 'Rest Day'}
            </p>
          </div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
            Pending
          </span>
        </div>
      </div>

      {/* Daily Quest Card */}
      <DailyQuestCard />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Zap className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-semibold text-foreground">
                {totals.calories} / {settings.calorieGoal}
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${Math.min(100, (totals.calories / settings.calorieGoal) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <span className="text-sm font-bold text-green-500">P</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-semibold text-foreground">
                {Math.round(totals.protein)}g / {settings.proteinGoal}g
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${Math.min(100, (totals.protein / settings.proteinGoal) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground">Today&apos;s Overview</h3>
        <div className="mt-3 grid grid-cols-4 gap-2">
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-lg font-bold text-foreground">{totals.calories}</p>
            <p className="text-[10px] text-muted-foreground">Calories</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-lg font-bold text-green-500">{Math.round(totals.protein)}g</p>
            <p className="text-[10px] text-muted-foreground">Protein</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-lg font-bold text-amber-500">{Math.round(totals.carbs)}g</p>
            <p className="text-[10px] text-muted-foreground">Carbs</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-lg font-bold text-rose-500">{Math.round(totals.fats)}g</p>
            <p className="text-[10px] text-muted-foreground">Fats</p>
          </div>
        </div>
      </div>
    </div>
  )
}

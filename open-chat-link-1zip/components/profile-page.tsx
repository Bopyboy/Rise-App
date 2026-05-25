'use client'

import { useApp } from '@/lib/app-context'
import { getRankByScore } from '@/lib/types'
import { Flame, Trophy, Dumbbell, Scale, Ruler, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProfilePage() {
  const { settings, riseScore, streak } = useApp()
  const currentRank = getRankByScore(riseScore)

  const stats = [
    { icon: Scale, label: 'Weight', value: `${settings.weight} kg` },
    { icon: Ruler, label: 'Height', value: `${settings.height} cm` },
    { icon: Calendar, label: 'Age', value: `${settings.age} years` },
  ]

  const achievements = [
    { name: 'First Workout', description: 'Complete your first workout', earned: true },
    { name: '7-Day Streak', description: 'Work out 7 days in a row', earned: streak >= 7 },
    { name: 'Protein Pro', description: 'Hit protein goal 10 times', earned: true },
    { name: 'Iron Rank', description: 'Reach Iron rank', earned: riseScore >= 0 },
    { name: 'Bronze Rank', description: 'Reach Bronze rank', earned: riseScore >= 500 },
    { name: 'Silver Rank', description: 'Reach Silver rank', earned: riseScore >= 1500 },
  ]

  const prs = [
    { exercise: 'Bench Press', weight: '100 kg', date: 'May 15' },
    { exercise: 'Squat', weight: '140 kg', date: 'May 10' },
    { exercise: 'Deadlift', weight: '180 kg', date: 'May 8' },
  ]

  return (
    <div className="space-y-4 pb-20">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-3xl font-bold text-primary">
          {settings.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{settings.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg">{currentRank.symbol}</span>
            <span
              className={cn(
                'font-semibold',
                currentRank.name === 'Elite' && 'elite-text'
              )}
              style={{ color: currentRank.name !== 'Elite' ? currentRank.color : undefined }}
            >
              {currentRank.name}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{riseScore.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Rise Score</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 font-semibold text-foreground">Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Records */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Personal Records</h3>
        </div>
        <div className="space-y-2">
          {prs.map(pr => (
            <div
              key={pr.exercise}
              className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
            >
              <div>
                <p className="font-medium text-foreground">{pr.exercise}</p>
                <p className="text-xs text-muted-foreground">{pr.date}</p>
              </div>
              <p className="font-bold text-primary">{pr.weight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 font-semibold text-foreground">Achievements</h3>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map(achievement => (
            <div
              key={achievement.name}
              className={cn(
                'rounded-lg p-2 text-center transition-colors',
                achievement.earned
                  ? 'bg-amber-500/10'
                  : 'bg-secondary/50 opacity-50'
              )}
            >
              <div
                className={cn(
                  'mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg',
                  achievement.earned ? 'bg-amber-500/20' : 'bg-secondary'
                )}
              >
                {achievement.earned ? '🏆' : '🔒'}
              </div>
              <p className="mt-1 text-xs font-medium text-foreground">
                {achievement.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

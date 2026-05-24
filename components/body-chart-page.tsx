'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { MUSCLE_COLORS, MuscleLevel, BodyChartPRs } from '@/lib/types'
import { RotateCcw, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// PR thresholds for a ~175lb male
const PR_EXERCISES = {
  chest: [
    { id: 'bench', name: 'Bench Press', unit: 'lbs', thresholds: [0, 135, 185, 255, 315] },
    { id: 'incline', name: 'Incline Bench', unit: 'lbs', thresholds: [0, 95, 135, 185, 225] },
    { id: 'dbfly', name: 'Dumbbell Fly', unit: 'lbs', thresholds: [0, 20, 35, 50, 70] },
    { id: 'cable', name: 'Cable Crossover', unit: 'lbs', thresholds: [0, 20, 40, 60, 80] },
  ],
  back: [
    { id: 'deadlift', name: 'Deadlift', unit: 'lbs', thresholds: [0, 185, 275, 365, 455] },
    { id: 'row', name: 'Barbell Row', unit: 'lbs', thresholds: [0, 95, 135, 185, 225] },
    { id: 'pullup', name: 'Pull-ups', unit: 'reps', thresholds: [0, 5, 10, 20, 30] },
    { id: 'latpull', name: 'Lat Pulldown', unit: 'lbs', thresholds: [0, 80, 120, 160, 200] },
  ],
  shoulders: [
    { id: 'ohp', name: 'Overhead Press', unit: 'lbs', thresholds: [0, 65, 95, 135, 185] },
    { id: 'lateral', name: 'Lateral Raise', unit: 'lbs', thresholds: [0, 15, 25, 35, 50] },
    { id: 'facepull', name: 'Face Pull', unit: 'lbs', thresholds: [0, 30, 50, 70, 100] },
    { id: 'arnold', name: 'Arnold Press', unit: 'lbs', thresholds: [0, 30, 45, 60, 80] },
  ],
  arms: [
    { id: 'curl', name: 'Barbell Curl', unit: 'lbs', thresholds: [0, 45, 65, 95, 115] },
    { id: 'hammer', name: 'Hammer Curl', unit: 'lbs', thresholds: [0, 25, 35, 50, 65] },
    { id: 'pushdown', name: 'Tricep Pushdown', unit: 'lbs', thresholds: [0, 40, 60, 90, 120] },
    { id: 'skull', name: 'Skull Crushers', unit: 'lbs', thresholds: [0, 40, 60, 80, 100] },
  ],
  legs: [
    { id: 'squat', name: 'Squat', unit: 'lbs', thresholds: [0, 135, 225, 315, 405] },
    { id: 'rdl', name: 'Romanian Deadlift', unit: 'lbs', thresholds: [0, 95, 155, 225, 295] },
    { id: 'legpress', name: 'Leg Press', unit: 'lbs', thresholds: [0, 180, 360, 540, 720] },
    { id: 'calf', name: 'Calf Raise', unit: 'lbs', thresholds: [0, 90, 180, 270, 360] },
  ],
  core: [
    { id: 'plank', name: 'Plank', unit: 'sec', thresholds: [0, 30, 60, 120, 180] },
    { id: 'hangleg', name: 'Hanging Leg Raise', unit: 'reps', thresholds: [0, 5, 10, 15, 25] },
    { id: 'abwheel', name: 'Ab Wheel', unit: 'reps', thresholds: [0, 5, 10, 20, 30] },
    { id: 'lsit', name: 'L-sit', unit: 'sec', thresholds: [0, 10, 20, 40, 60] },
  ],
}

function getTierFromValue(value: number, thresholds: number[]): MuscleLevel {
  if (value === 0 || value < thresholds[1]) return 'untrained'
  if (value < thresholds[2]) return 'beginner'
  if (value < thresholds[3]) return 'intermediate'
  if (value < thresholds[4]) return 'advanced'
  return 'elite'
}

function getGroupAverageLevel(prs: { [key: string]: number }, exercises: typeof PR_EXERCISES.chest): MuscleLevel {
  const levels: MuscleLevel[] = []
  for (const ex of exercises) {
    if (prs[ex.id] && prs[ex.id] > 0) {
      levels.push(getTierFromValue(prs[ex.id], ex.thresholds))
    }
  }
  if (levels.length === 0) return 'untrained'
  
  const tierValues = { untrained: 0, beginner: 1, intermediate: 2, advanced: 3, elite: 4 }
  const avg = levels.reduce((sum, l) => sum + tierValues[l], 0) / levels.length
  
  if (avg < 0.5) return 'untrained'
  if (avg < 1.5) return 'beginner'
  if (avg < 2.5) return 'intermediate'
  if (avg < 3.5) return 'advanced'
  return 'elite'
}

function calculateBodyScore(prs: BodyChartPRs): number {
  const groups: (keyof BodyChartPRs)[] = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core']
  const tierValues = { untrained: 0, beginner: 25, intermediate: 50, advanced: 75, elite: 100 }
  
  let total = 0
  let count = 0
  
  for (const group of groups) {
    const exercises = PR_EXERCISES[group]
    const level = getGroupAverageLevel(prs[group], exercises)
    total += tierValues[level]
    count++
  }
  
  return count > 0 ? Math.round(total / count) : 0
}

function getScoreRank(score: number): string {
  if (score <= 20) return 'Untrained'
  if (score <= 40) return 'Beginner'
  if (score <= 60) return 'Intermediate'
  if (score <= 80) return 'Advanced'
  return 'Elite'
}

// Anatomical Body SVG Component
function BodySVG({ view, muscleLevels }: { view: 'front' | 'back'; muscleLevels: Record<string, MuscleLevel> }) {
  const [tooltip, setTooltip] = useState<{ name: string; level: MuscleLevel; cx: number; cy: number } | null>(null)

  const handleMuscleHover = (name: string, level: MuscleLevel, e: React.MouseEvent) => {
    const svgEl = (e.currentTarget as SVGElement).closest('svg')
    const containerEl = svgEl?.parentElement
    if (!containerEl || !svgEl) return
    const pathRect = e.currentTarget.getBoundingClientRect()
    const containerRect = containerEl.getBoundingClientRect()
    const cx = pathRect.left + pathRect.width / 2 - containerRect.left
    const cy = pathRect.top - containerRect.top
    setTooltip({ name, level, cx, cy })
  }

  const frontMuscles = [
    // Chest (pectorals)
    { id: 'chest-left', name: 'Chest', level: muscleLevels.chest, d: 'M85 95 Q75 100 72 115 Q70 130 78 140 L95 135 Q100 120 100 105 Q100 95 85 95Z' },
    { id: 'chest-right', name: 'Chest', level: muscleLevels.chest, d: 'M115 95 Q125 100 128 115 Q130 130 122 140 L105 135 Q100 120 100 105 Q100 95 115 95Z' },
    // Shoulders
    { id: 'shoulder-left', name: 'Shoulders', level: muscleLevels.shoulders, d: 'M65 90 Q58 95 55 105 Q55 115 60 120 L72 115 Q75 105 72 95 Q70 90 65 90Z' },
    { id: 'shoulder-right', name: 'Shoulders', level: muscleLevels.shoulders, d: 'M135 90 Q142 95 145 105 Q145 115 140 120 L128 115 Q125 105 128 95 Q130 90 135 90Z' },
    // Biceps
    { id: 'bicep-left', name: 'Arms', level: muscleLevels.arms, d: 'M55 120 Q50 135 50 155 Q52 165 58 170 L65 165 Q68 150 65 130 L60 120Z' },
    { id: 'bicep-right', name: 'Arms', level: muscleLevels.arms, d: 'M145 120 Q150 135 150 155 Q148 165 142 170 L135 165 Q132 150 135 130 L140 120Z' },
    // Forearms
    { id: 'forearm-left', name: 'Arms', level: muscleLevels.arms, d: 'M50 170 Q45 190 45 210 Q47 218 52 220 L60 215 Q62 195 58 175Z' },
    { id: 'forearm-right', name: 'Arms', level: muscleLevels.arms, d: 'M150 170 Q155 190 155 210 Q153 218 148 220 L140 215 Q138 195 142 175Z' },
    // Abs (6 sections)
    { id: 'abs-1', name: 'Core', level: muscleLevels.core, d: 'M92 140 L108 140 L108 155 L92 155Z' },
    { id: 'abs-2', name: 'Core', level: muscleLevels.core, d: 'M92 157 L108 157 L108 172 L92 172Z' },
    { id: 'abs-3', name: 'Core', level: muscleLevels.core, d: 'M92 174 L108 174 L108 189 L92 189Z' },
    // Obliques
    { id: 'oblique-left', name: 'Core', level: muscleLevels.core, d: 'M78 145 L90 145 L90 190 L75 195 Q73 170 78 145Z' },
    { id: 'oblique-right', name: 'Core', level: muscleLevels.core, d: 'M122 145 L110 145 L110 190 L125 195 Q127 170 122 145Z' },
    // Quads
    { id: 'quad-left', name: 'Legs', level: muscleLevels.legs, d: 'M78 200 Q72 230 70 270 Q72 285 80 290 L95 285 Q98 250 95 210 L88 200Z' },
    { id: 'quad-right', name: 'Legs', level: muscleLevels.legs, d: 'M122 200 Q128 230 130 270 Q128 285 120 290 L105 285 Q102 250 105 210 L112 200Z' },
    // Calves (front)
    { id: 'calf-front-left', name: 'Legs', level: muscleLevels.legs, d: 'M75 295 Q70 320 70 350 Q72 360 78 365 L88 360 Q90 330 88 300Z' },
    { id: 'calf-front-right', name: 'Legs', level: muscleLevels.legs, d: 'M125 295 Q130 320 130 350 Q128 360 122 365 L112 360 Q110 330 112 300Z' },
  ]

  const backMuscles = [
    // Traps
    { id: 'trap-left', name: 'Back', level: muscleLevels.back, d: 'M85 75 Q78 80 75 90 L88 95 Q92 85 90 77Z' },
    { id: 'trap-right', name: 'Back', level: muscleLevels.back, d: 'M115 75 Q122 80 125 90 L112 95 Q108 85 110 77Z' },
    // Rear Delts
    { id: 'rear-delt-left', name: 'Shoulders', level: muscleLevels.shoulders, d: 'M62 90 Q55 95 55 110 L68 115 Q72 100 68 92Z' },
    { id: 'rear-delt-right', name: 'Shoulders', level: muscleLevels.shoulders, d: 'M138 90 Q145 95 145 110 L132 115 Q128 100 132 92Z' },
    // Lats
    { id: 'lat-left', name: 'Back', level: muscleLevels.back, d: 'M70 115 Q65 130 68 160 Q72 180 78 190 L92 185 Q95 150 92 120 L78 115Z' },
    { id: 'lat-right', name: 'Back', level: muscleLevels.back, d: 'M130 115 Q135 130 132 160 Q128 180 122 190 L108 185 Q105 150 108 120 L122 115Z' },
    // Rhomboids / Mid Back
    { id: 'mid-back', name: 'Back', level: muscleLevels.back, d: 'M88 95 L112 95 L115 140 L85 140Z' },
    // Lower Back (erectors)
    { id: 'lower-back', name: 'Back', level: muscleLevels.back, d: 'M88 145 L112 145 L115 190 L85 190Z' },
    // Triceps
    { id: 'tricep-left', name: 'Arms', level: muscleLevels.arms, d: 'M55 115 Q48 130 48 155 Q50 168 56 172 L65 168 Q70 145 68 125 L60 115Z' },
    { id: 'tricep-right', name: 'Arms', level: muscleLevels.arms, d: 'M145 115 Q152 130 152 155 Q150 168 144 172 L135 168 Q130 145 132 125 L140 115Z' },
    // Glutes
    { id: 'glute-left', name: 'Legs', level: muscleLevels.legs, d: 'M78 195 Q70 205 70 225 L100 225 L100 195 Q90 192 78 195Z' },
    { id: 'glute-right', name: 'Legs', level: muscleLevels.legs, d: 'M122 195 Q130 205 130 225 L100 225 L100 195 Q110 192 122 195Z' },
    // Hamstrings
    { id: 'ham-left', name: 'Legs', level: muscleLevels.legs, d: 'M72 230 Q68 260 70 290 L90 290 Q92 260 88 230Z' },
    { id: 'ham-right', name: 'Legs', level: muscleLevels.legs, d: 'M128 230 Q132 260 130 290 L110 290 Q108 260 112 230Z' },
    // Calves (back)
    { id: 'calf-back-left', name: 'Legs', level: muscleLevels.legs, d: 'M72 295 Q68 320 68 350 Q70 362 78 368 L90 362 Q92 330 88 300Z' },
    { id: 'calf-back-right', name: 'Legs', level: muscleLevels.legs, d: 'M128 295 Q132 320 132 350 Q130 362 122 368 L110 362 Q108 330 112 300Z' },
  ]

  const muscles = view === 'front' ? frontMuscles : backMuscles

  return (
    <div className="relative">
      <svg viewBox="0 0 200 400" className="h-[320px] w-auto mx-auto">
        {/* Body outline */}
        <g fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
          {/* Head */}
          <ellipse cx="100" cy="40" rx="25" ry="30" fill="rgba(200,200,200,0.15)" />
          {/* Neck */}
          <rect x="90" y="65" width="20" height="15" fill="rgba(200,200,200,0.15)" />
          {/* Torso outline */}
          <path d="M65 80 Q55 85 55 105 Q55 120 50 170 Q45 210 48 220 L52 225 L60 220 Q62 200 65 170 L75 200 Q70 260 70 290 Q68 350 70 370 L90 375 L90 290 L100 280 L110 290 L110 375 L130 370 Q132 350 130 290 Q130 260 125 200 L135 170 Q138 200 140 220 L148 225 L152 220 Q155 210 150 170 Q145 120 145 105 Q145 85 135 80 Q115 75 100 75 Q85 75 65 80Z" fill="rgba(200,200,200,0.15)" />
        </g>

        {/* Muscle groups */}
        {muscles.map(muscle => (
          <path
            key={muscle.id}
            d={muscle.d}
            fill={MUSCLE_COLORS[muscle.level]}
            className={cn(
              'cursor-pointer transition-all duration-300',
              muscle.level === 'elite' && 'animate-pulse'
            )}
            style={{
              filter: muscle.level !== 'untrained' ? `drop-shadow(0 0 ${muscle.level === 'elite' ? '8px' : '4px'} ${MUSCLE_COLORS[muscle.level]}50)` : undefined,
            }}
            onMouseEnter={(e) => handleMuscleHover(muscle.name, muscle.level, e)}
            onMouseLeave={() => setTooltip(null)}
            onTouchStart={(e) => handleMuscleHover(muscle.name, muscle.level, e as unknown as React.MouseEvent)}
            onTouchEnd={() => setTooltip(null)}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.cx, top: tooltip.cy - 6 }}
        >
          <div className="rounded-lg bg-card border border-border px-3 py-2 shadow-lg">
            <p className="text-sm font-medium text-foreground">{tooltip.name}</p>
            <p className="text-xs capitalize" style={{ color: MUSCLE_COLORS[tooltip.level] }}>
              {tooltip.level}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function BodyChartPage() {
  const { bodyPRs, updateBodyPR, resetAllPRs } = useApp()
  const [view, setView] = useState<'front' | 'back'>('front')
  const [activeTab, setActiveTab] = useState<keyof typeof PR_EXERCISES>('chest')

  const bodyScore = calculateBodyScore(bodyPRs)
  const scoreRank = getScoreRank(bodyScore)

  const muscleLevels = {
    chest: getGroupAverageLevel(bodyPRs.chest, PR_EXERCISES.chest),
    back: getGroupAverageLevel(bodyPRs.back, PR_EXERCISES.back),
    shoulders: getGroupAverageLevel(bodyPRs.shoulders, PR_EXERCISES.shoulders),
    arms: getGroupAverageLevel(bodyPRs.arms, PR_EXERCISES.arms),
    legs: getGroupAverageLevel(bodyPRs.legs, PR_EXERCISES.legs),
    core: getGroupAverageLevel(bodyPRs.core, PR_EXERCISES.core),
  }

  const tabs: { id: keyof typeof PR_EXERCISES; label: string }[] = [
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'arms', label: 'Arms' },
    { id: 'legs', label: 'Legs' },
    { id: 'core', label: 'Core' },
  ]

  return (
    <div className="space-y-4 pb-20">
      {/* Header with Score */}
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Body Strength Score
        </p>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span
            className="text-5xl font-bold"
            style={{
              color: bodyScore > 80 ? '#22c55e' : bodyScore > 60 ? '#3b82f6' : bodyScore > 40 ? '#f97316' : bodyScore > 20 ? '#ef4444' : '#6b7280',
              textShadow: bodyScore > 60 ? `0 0 20px ${bodyScore > 80 ? '#22c55e' : '#3b82f6'}50` : undefined,
            }}
          >
            {bodyScore}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">
            {scoreRank}
          </span>
        </div>
      </div>

      {/* Body Visualization */}
      <div className="rounded-2xl border border-border bg-[#0a0a0f] p-4">
        <h2 className="mb-2 text-center text-lg font-semibold text-white">Ranked Bodygraph</h2>
        
        {/* Front/Back Toggle */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-xl bg-white/10 p-1">
            <button
              onClick={() => setView('front')}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                view === 'front' ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:text-white'
              )}
            >
              Front
            </button>
            <button
              onClick={() => setView('back')}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                view === 'back' ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:text-white'
              )}
            >
              Back
            </button>
          </div>
        </div>

        {/* Body SVG */}
        <BodySVG view={view} muscleLevels={muscleLevels} />

        {/* Color Legend */}
        <div className="mt-4 flex items-center justify-center gap-1 text-[10px]">
          <span className="text-white/50">Untrained</span>
          {(['untrained', 'beginner', 'intermediate', 'advanced', 'elite'] as MuscleLevel[]).map(level => (
            <div
              key={level}
              className="h-3 w-6 rounded"
              style={{ backgroundColor: MUSCLE_COLORS[level] }}
            />
          ))}
          <span className="text-white/50">Elite</span>
        </div>
      </div>

      {/* PR Input Tabs */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PR Inputs */}
      <div className="space-y-3">
        {PR_EXERCISES[activeTab].map(exercise => {
          const value = bodyPRs[activeTab][exercise.id] || 0
          const tier = getTierFromValue(value, exercise.thresholds)

          return (
            <div key={exercise.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">1RM in {exercise.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={value || ''}
                    onChange={e => updateBodyPR(activeTab, exercise.id, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-20 rounded-lg bg-secondary px-3 py-2 text-right text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                    style={{
                      backgroundColor: `${MUSCLE_COLORS[tier]}20`,
                      color: MUSCLE_COLORS[tier],
                    }}
                  >
                    {tier}
                  </span>
                </div>
              </div>
              
              {/* Threshold bar */}
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-secondary">
                {(['beginner', 'intermediate', 'advanced', 'elite'] as MuscleLevel[]).map((level, i) => (
                  <div
                    key={level}
                    className="h-full flex-1 border-r border-background/50 last:border-r-0"
                    style={{ backgroundColor: value >= exercise.thresholds[i + 1] ? MUSCLE_COLORS[level] : 'transparent' }}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                <span>{exercise.thresholds[1]}</span>
                <span>{exercise.thresholds[2]}</span>
                <span>{exercise.thresholds[3]}</span>
                <span>{exercise.thresholds[4]}+</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reset Button */}
      <button
        onClick={resetAllPRs}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/50 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        <RotateCcw className="h-4 w-4" />
        Reset All PRs
      </button>
    </div>
  )
}

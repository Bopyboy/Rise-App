'use client'

import { Home, Utensils, Dumbbell, Settings, User, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'workout', icon: Dumbbell, label: 'Workout' },
  { id: 'body', icon: Activity, label: 'Body' },
  { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  )
}

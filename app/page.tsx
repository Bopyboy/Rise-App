'use client'

import { useState, useEffect } from 'react'
import { AppProvider } from '@/lib/app-context'
import { BottomNav } from '@/components/bottom-nav'
import { HomePage } from '@/components/home-page'
import { NutritionPage } from '@/components/nutrition-page'
import { WorkoutPage } from '@/components/workout-page'
import { BodyChartPage } from '@/components/body-chart-page'
import { SettingsPage } from '@/components/settings-page'
import { ChatPage } from '@/components/chat-page'
import { FriendsPage } from '@/components/friends-page'
import { ShopPage } from '@/components/shop-page'

function AppContent() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-md px-4 pb-20 pt-6">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'nutrition' && <NutritionPage />}
        {activeTab === 'workout' && <WorkoutPage />}
        {activeTab === 'body' && <BodyChartPage />}
        {activeTab === 'settings' && <SettingsPage />}
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'friends' && <FriendsPage />}
        {activeTab === 'shop' && <ShopPage />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
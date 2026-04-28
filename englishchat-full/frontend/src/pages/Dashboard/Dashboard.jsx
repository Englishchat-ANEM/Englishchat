import React, { useEffect } from 'react'
import { useAuthStore, useUserStatsStore, useCallStore } from '../../store'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { stats, fetchUserStats } = useUserStatsStore()
  const { callHistory, fetchCallHistory } = useCallStore()

  useEffect(() => {
    fetchUserStats()
    fetchCallHistory()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container-main flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-primary-700">Mon Dashboard</h1>
          <Link to="/lessons" className="text-primary-600 font-semibold">Mes Leçons</Link>
        </div>
      </header>

      <div className="container-main">
        <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-3xl font-bold mb-2">Bienvenue, {user?.firstName}!</h2>
          <p className="opacity-90">Vous progressez bien dans votre apprentissage</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.xpTotal}</div>
            <p className="text-gray-600">XP Total</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.lessonsCompleted}</div>
            <p className="text-gray-600">Leçons</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.callsTotal}</div>
            <p className="text-gray-600">Appels</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.streak}</div>
            <p className="text-gray-600">Streak</p>
          </div>
        </div>

        <div className="mt-8 card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="flex gap-4">
            <Link to="/lessons" className="btn-primary">Continuer les Leçons</Link>
            <button className="btn-secondary">Chercher un Partenaire</button>
          </div>
        </div>
      </div>
    </div>
  )
}

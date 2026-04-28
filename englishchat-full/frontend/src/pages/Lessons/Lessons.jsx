import React, { useEffect } from 'react'
import { useLessonStore, useUserStatsStore } from '../../store'
import { Link } from 'react-router-dom'

export default function LessonsPage() {
  const { lessons, selectedLevel, fetchLessons, isLoading } = useLessonStore()
  const { stats } = useUserStatsStore()
  const levels = ['A1', 'A2', 'B1', 'B2']

  useEffect(() => {
    fetchLessons(selectedLevel)
    useUserStatsStore.getState().fetchUserStats()
  }, [selectedLevel])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container-main flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-primary-700">Mes Leçons</h1>
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-semibold">Dashboard</Link>
        </div>
      </header>

      <div className="container-main">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.xpTotal}</div>
            <p className="text-gray-600 text-sm">XP Total</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.lessonsCompleted}</div>
            <p className="text-gray-600 text-sm">Leçons</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.callsTotal}</div>
            <p className="text-gray-600 text-sm">Appels</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.streak}</div>
            <p className="text-gray-600 text-sm">Streak</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Votre niveau</h2>
          <div className="flex gap-3">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => useLessonStore.getState().setSelectedLevel(level)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedLevel === level
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner border-primary-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {lessons.map(lesson => (
              <div key={lesson.id} className="card hover:shadow-xl transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{lesson.lessonType}</p>
                <button className="w-full btn-primary text-sm py-2">Commencer</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

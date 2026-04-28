import React, { useState } from 'react'
import { useAuthStore } from '../../store'
import { Link } from 'react-router-dom'

export default function AdminPage() {
  const { user, logout } = useAuthStore()
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    level: 'A1',
    lessonType: 'text',
    xpReward: 100
  })

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">Vous n'avez pas les permissions pour accéder à cette page.</p>
          <Link to="/lessons" className="btn-primary">Retour aux Leçons</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Creating lesson:', newLesson)
    setNewLesson({ title: '', content: '', level: 'A1', lessonType: 'text', xpReward: 100 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container-main flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-primary-700">Panel Admin</h1>
          <button onClick={logout} className="text-red-600 hover:text-red-700 font-semibold">Déconnexion</button>
        </div>
      </header>

      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Créer une Leçon</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Titre de la leçon"
                value={newLesson.title}
                onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                className="input-field"
              />
              <textarea
                placeholder="Contenu"
                value={newLesson.content}
                onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                className="input-field h-32"
              />
              <select
                value={newLesson.level}
                onChange={(e) => setNewLesson({...newLesson, level: e.target.value})}
                className="input-field"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
              <button type="submit" className="w-full btn-primary">Créer Leçon</button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-primary-600">1,234</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">Appels Complétés</p>
                <p className="text-3xl font-bold text-primary-600">5,678</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">Leçons Créées</p>
                <p className="text-3xl font-bold text-primary-600">42</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <p className="text-2xl font-bold text-gray-900 mb-2">Page Non Trouvée</p>
        <p className="text-gray-600 mb-8">La page que vous recherchez n'existe pas.</p>
        <Link to="/" className="btn-primary">Retour à l'Accueil</Link>
      </div>
    </div>
  )
}

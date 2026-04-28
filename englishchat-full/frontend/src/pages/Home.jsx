import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store'

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-sm shadow-sm z-50">
        <div className="container-main flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EC</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-700">EnglishChat</h1>
          </div>

          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Bienvenue, {user?.firstName}!</span>
                <Link to="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Se connecter
                </Link>
                <Link to="/signup" className="btn-primary">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 container-main text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Apprenez l'anglais en parlant
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          EnglishChat combine des leçons interactives avec des appels en direct pour
          améliorer votre anglais rapidement. Connectez-vous avec d'autres apprenants
          et pratiquez ensemble en temps réel.
        </p>

        {!isAuthenticated && (
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Commencer maintenant
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Se connecter
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <h3 className="text-4xl font-bold text-center mb-16">Nos fonctionnalités</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Leçons Interactives</h4>
              <p className="text-gray-600">
                Apprenez avec des leçons courtes et engageantes couvrant tous les niveaux
                de A1 à B2.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎤</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Appels en Direct</h4>
              <p className="text-gray-600">
                Pratiquez votre anglais en appelant d'autres apprenants de manière anonyme
                et sécurisée.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Suivi des Progrès</h4>
              <p className="text-gray-600">
                Suivez votre progression avec des statistiques détaillées et des badges
                de réussite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="container-main text-center">
          <h3 className="text-4xl font-bold mb-6">Prêt à commencer?</h3>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'apprenants et améliorez votre anglais dès aujourd'hui.
          </p>
          {!isAuthenticated && (
            <Link to="/signup" className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg">
              S'inscrire gratuitement
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-main text-center">
          <p>&copy; 2025 EnglishChat. Tous droits réservés.</p>
          <p className="text-gray-400 mt-2">Pour l'Association des Nigériens Étudiants au Maroc</p>
        </div>
      </footer>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp, isLoading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    agreeTerms: false
  })
  const [formError, setFormError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.email || !formData.password || !formData.firstName) {
      setFormError('Veuillez remplir tous les champs')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (!formData.agreeTerms) {
      setFormError('Vous devez accepter les conditions d\'utilisation')
      return
    }

    const result = await signUp(formData.email, formData.password, formData.firstName)
    if (result.success) {
      navigate('/lessons')
    } else {
      setFormError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-3xl">EC</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">EnglishChat</h1>
            <p className="text-gray-600">Créez votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Votre prénom" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vous@email.com" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer mot de passe</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input-field" />
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="agreeTerms" className="text-sm text-gray-600">J'accepte les <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">conditions d'utilisation</a></label>
            </div>

            {(formError || error) && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm font-semibold">{formError || error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
              {isLoading ? 'Création...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <p className="text-center text-gray-600">Vous avez déjà un compte? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700">Se connecter</Link></p>
        </div>
      </div>
    </div>
  )
}

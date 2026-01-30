'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { Edit, Save, X, User as UserIcon, Mail, Phone, Lock } from 'lucide-react'
import { accountsAPI } from '@/lib/api'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

const profilSchema = z.object({
  first_name: z.string().min(2, 'Minimum 2 caractères'),
  last_name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
})

type ProfilFormValues = z.infer<typeof profilSchema>

export default function ProfilPage() {
  const { user, setUser, isLoading } = useUser()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isLoading) return
    
    if (!user) {
      router.replace('/signin')
    }
  }, [user, isLoading, router])

  const form = useForm<ProfilFormValues>({
    resolver: zodResolver(profilSchema),
    defaultValues: {
      first_name: user?.name?.split(' ')[0] || '',
      last_name: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
    }
  })

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.name?.split(' ')[0] || '',
        last_name: user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: '',
      })
    }
  }, [user, form])

  const onSubmit = async (data: ProfilFormValues) => {
    if (!user) return

    setIsSaving(true)
    try {
      const res = await accountsAPI.update(user.id.toString(), data)

      if (!res.ok) {
        toast.error('Erreur lors de la mise à jour')
        return
      }

      const result = await res.json()
      
      // Mettre à jour le contexte utilisateur
      setUser({
        ...user,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
      })

      toast.success('Profil mis à jour avec succès !')
      setIsEditing(false)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur réseau')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isAdmin = user.role === 'admin'
  const avatarColor = isAdmin ? 'bg-purple-600' : 'bg-green-500'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <HeroSection 
        title="Mon profil"
        subtitle="Gérez vos informations personnelles et vos paramètres"
        breadcrumbs={[
          { label: 'Accueil', href: isAdmin ? '/admin' : '/candidat' },
          { label: 'Mon profil' }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12 flex-1">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className={`w-24 h-24 rounded-full ${avatarColor} flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4`}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="text-xl font-bold mb-1">{user.name}</h3>
              <p className="text-gray-600 text-sm mb-1">{user.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
              }`}>
                {isAdmin ? 'Administrateur' : 'Candidat'}
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Sécurité
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Protégez votre compte en utilisant un mot de passe fort
              </p>
              <Button variant="outline" className="w-full">
                Changer le mot de passe
              </Button>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
                  Informations personnelles
                </h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      form.reset()
                    }}
                    variant="outline"
                    className="flex items-center gap-2 text-red-600"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                )}
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Prénom Nom */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Prénom *
                    </label>
                    <Input
                      {...form.register('first_name')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                    {form.formState.errors.first_name && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.first_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Nom *
                    </label>
                    <Input
                      {...form.register('last_name')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                    {form.formState.errors.last_name && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </label>
                  <Input
                    type="email"
                    {...form.register('email')}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <Input
                    {...form.register('phone')}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                    placeholder="+225 XX XX XX XX"
                  />
                </div>

                {/* Bouton Sauvegarder */}
                {isEditing && (
                  <Button
                    type="submit"
                    className="w-full text-white font-semibold py-3 hover:opacity-90"
                    style={{ backgroundColor: '#0F5D8C' }}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                )}
              </form>
            </div>

            {/* Statistiques candidat */}
            {!isAdmin && (
              <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0F5D8C' }}>
                  Mes candidatures
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600">En cours</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">Acceptées</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-gray-600">0</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
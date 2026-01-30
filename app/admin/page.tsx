'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { Users, Send, Briefcase, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applicationsAPI } from '@/lib/api'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

interface Application {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  contract_type_sought: string
  created_at: string
  is_spontaneous: boolean
  job?: {
    id: number
    title: string
  }
}

export default function AdminDashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApps, setFilteredApps] = useState<Application[]>([])
  const [nameFilter, setNameFilter] = useState('')
  const [emailFilter, setEmailFilter] = useState('')
  const [isLoadingApps, setIsLoadingApps] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace('/signin')
      return
    }

    if (user.role === 'candidat') {
      router.replace('/candidat')
      return
    }

    if (user.role === 'admin') {
      fetchApplications()
    }
  }, [user, isLoading, router])

  useEffect(() => {
    let filtered = applications
    if (nameFilter) {
      filtered = filtered.filter(app =>
        `${app.first_name} ${app.last_name}`.toLowerCase().includes(nameFilter.toLowerCase())
      )
    }
    if (emailFilter) {
      filtered = filtered.filter(app =>
        app.email.toLowerCase().includes(emailFilter.toLowerCase())
      )
    }
    setFilteredApps(filtered)
  }, [nameFilter, emailFilter, applications])

  const fetchApplications = async () => {
    try {
      const res = await applicationsAPI.getAll()
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
        setFilteredApps(data)
      }
    } catch (error) {
      console.error('Erreur fetch applications:', error)
    } finally {
      setIsLoadingApps(false)
    }
  }

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = {
    total: applications.length,
    spontanees: applications.filter(a => a.is_spontaneous).length,
    surOffres: applications.filter(a => !a.is_spontaneous).length,
    interim: 0,
    evaluations: 0
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        showActionButton 
        actionButtonText="+ Publier une offre" 
        actionButtonHref="/admin/offres/creer"
      />
      
      <HeroSection 
        title="Bienvenue Administrateur"
        subtitle="Gérez efficacement vos candidatures et votre équipe"
        breadcrumbs={[
          { label: 'Accueil' },
          { label: 'Administration' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <Send className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-gray-600 text-sm">Spontanées</p>
            <p className="text-3xl font-bold">{stats.spontanees}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <Briefcase className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-gray-600 text-sm">Sur offres</p>
            <p className="text-3xl font-bold">{stats.surOffres}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
            <Clock className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-gray-600 text-sm">Intérim</p>
            <p className="text-3xl font-bold">{stats.interim}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <CheckCircle className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-gray-600 text-sm">Évaluations</p>
            <p className="text-3xl font-bold">{stats.evaluations}</p>
            <p className="text-xs text-gray-500">complétées</p>
          </div>
        </div>

        {/* Liste candidatures */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
              Liste des candidatures
            </h2>
            <Button onClick={fetchApplications} variant="outline" size="sm">
              🔄 Actualiser
            </Button>
          </div>

          {/* Filtres */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Filtrer par nom..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <Input
              placeholder="Filtrer par email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="pb-3 font-semibold">Nom</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Poste</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingApps ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>Aucune candidature trouvée</p>
                      <p className="text-sm">Les nouvelles candidatures apparaîtront ici</p>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium">{app.first_name} {app.last_name}</td>
                      <td className="py-4 text-gray-600">{app.email}</td>
                      <td className="py-4 text-gray-600">{app.job?.title || '-'}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.is_spontaneous ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {app.is_spontaneous ? 'Spontanée' : 'Sur offre'}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">
                        {new Date(app.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredApps.length} candidature(s) affichée(s) sur {applications.length} total(es)
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
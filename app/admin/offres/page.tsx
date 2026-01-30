'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { jobsAPI } from '@/lib/api'
import Link from 'next/link'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

interface JobOffer {
  id: number
  title: string
  company: string
  location: string
  contract_type: string
  salary: string
  application_deadline: string
  description: string
  skills: string[]
  status?: string
}

export default function AdminOffresPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [isLoadingOffers, setIsLoadingOffers] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace('/signin')
      return
    }

    if (user.role !== 'admin') {
      router.replace('/candidat')
      return
    }

    fetchOffers()
  }, [user, isLoading, router])

  const fetchOffers = async () => {
    try {
      const res = await jobsAPI.getAll()
      if (res.ok) {
        const data = await res.json()
        setOffers(data)
      }
    } catch (error) {
      console.error('Erreur fetch offres:', error)
      toast.error('Impossible de charger les offres')
    } finally {
      setIsLoadingOffers(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return

    try {
      const res = await jobsAPI.delete(id)
      if (res.ok) {
        toast.success('Offre supprimée avec succès')
        setOffers(offers.filter(o => o.id !== id))
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur réseau')
    }
  }

  const contractTypeLabels: Record<string, string> = {
    cdi: 'CDI',
    cdd: 'CDD',
    stage: 'Stage',
    freelance: 'Freelance'
  }

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <HeroSection 
        title="Gestion des offres d'emploi"
        subtitle="Créez, modifiez et gérez vos offres d'emploi"
        breadcrumbs={[
          { label: 'Accueil', href: '/admin' },
          { label: 'Gestion des offres' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-12 flex-1">
        {/* Header avec bouton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
              Toutes les offres
            </h2>
            <p className="text-gray-600 mt-1">
              {offers.length} offre(s) publiée(s)
            </p>
          </div>
          <Link href="/admin/offres/creer">
            <Button
              className="flex items-center gap-2 text-white font-semibold hover:opacity-90"
              style={{ backgroundColor: '#0F5D8C' }}
            >
              <Plus className="w-5 h-5" />
              Publier une offre
            </Button>
          </Link>
        </div>

        {/* Liste des offres */}
        {isLoadingOffers ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune offre publiée
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre première offre d'emploi
            </p>
            <Link href="/admin/offres/creer">
              <Button
                className="text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: '#0F5D8C' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une offre
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold" style={{ color: '#0F5D8C' }}>
                        {offer.title}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {contractTypeLabels[offer.contract_type] || offer.contract_type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{offer.company} • {offer.location}</p>
                    <p className="text-gray-500 text-sm mb-3">{offer.salary}</p>
                    <p className="text-gray-600 text-sm line-clamp-2">{offer.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Link href={`/offres`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        title="Voir l'offre"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(offer.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Compétences */}
                {offer.skills && offer.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {offer.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date limite */}
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  📅 Date limite : {new Date(offer.application_deadline).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
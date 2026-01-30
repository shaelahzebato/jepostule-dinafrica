'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Briefcase, Calendar, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { jobsAPI } from '@/lib/api'
import { useUser } from '@/context/UserContext'
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
}

export default function OffresPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<JobOffer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingOffers, setIsLoadingOffers] = useState(true)

  useEffect(() => {
    if (isLoading) return
    
    if (!user) {
      router.replace('/signin')
      return
    }
    
    fetchOffers()
  }, [user, isLoading, router])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = offers.filter(offer =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOffers(filtered)
    } else {
      setFilteredOffers(offers)
    }
  }, [searchQuery, offers])

  const fetchOffers = async () => {
    try {
      const res = await jobsAPI.getAll()
      if (res.ok) {
        const data = await res.json()
        setOffers(data)
        setFilteredOffers(data)
      }
    } catch (error) {
      console.error('Erreur fetch offres:', error)
      toast.error('Impossible de charger les offres')
    } finally {
      setIsLoadingOffers(false)
    }
  }

  const contractTypeLabels: Record<string, string> = {
    cdi: 'CDI',
    cdd: 'CDD',
    stage: 'Stage',
    freelance: 'Freelance'
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showActionButton actionButtonText="Candidature spontanée" actionButtonHref="/candidature-spontanee" />
      
      <HeroSection 
        title="Nos offres d'emploi"
        subtitle="Découvrez les opportunités de carrière qui vous attendent"
        breadcrumbs={[
          { label: 'Accueil', href: '/candidat' },
          { label: 'Offres d\'emploi' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-12 flex-1">
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, entreprise ou lieu..."
              className="pl-12 py-6 text-lg rounded-xl"
            />
          </div>
        </div>

        {/* Liste des offres */}
        {isLoadingOffers ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune offre disponible</h3>
            <p className="text-gray-500 mb-6">
              Nous n'avons pas d'offres d'emploi actuellement, mais vous pouvez toujours envoyer votre candidature spontanée.
            </p>
            <Link href="/candidature-spontanee">
              <Button style={{ backgroundColor: '#0F5D8C' }} className="text-white hover:opacity-90">
                Candidature spontanée
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2" style={{ color: '#0F5D8C' }}>
                      {offer.title}
                    </h3>
                    <p className="text-lg text-gray-700 font-medium">{offer.company}</p>
                  </div>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {contractTypeLabels[offer.contract_type] || offer.contract_type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{offer.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{offer.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Jusqu'au {new Date(offer.application_deadline).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{offer.description}</p>

                {offer.skills && offer.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {offer.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <Link href={`/postuler/${offer.id}`}>
                  <Button className="w-full sm:w-auto text-white hover:opacity-90" style={{ backgroundColor: '#0F5D8C' }}>
                    Postuler →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
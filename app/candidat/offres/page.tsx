'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { jobsAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import type { JobOffer } from '@/types'
import { CONTRACT_TYPE_LABELS } from '@/types'

export default function OffresPage() {
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<JobOffer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

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
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      
      <HeroSection
        title="Nos offres d'emploi"
        subtitle="Découvrez les opportunités de carrière qui vous attendent"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Espace candidat', href: '/candidat' },
          { label: 'Offres d\'emploi' }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Recherche */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, entreprise ou lieu..."
              className="pl-12 py-6 text-base"
            />
          </div>
        </div>

        {/* Liste des offres */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#0F5D8C' }}></div>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Aucune offre disponible
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Aucune offre ne correspond à votre recherche'
                : 'Nous n\'avons pas d\'offres d\'emploi actuellement'}
            </p>
            <Link href="/candidat/candidature-spontanee">
              <Button
                className="text-white"
                style={{ backgroundColor: '#0F5D8C' }}
              >
                Candidature spontanée
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOffers.map((offer) => (
              <Card 
                key={offer.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: '#0F5D8C' }}>
                        {offer.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{offer.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{offer.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{CONTRACT_TYPE_LABELS[offer.contract_type]}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {offer.description}
                      </p>

                      {offer.skills && offer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {offer.skills.slice(0, 5).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {offer.skills.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              +{offer.skills.length - 5} autres
                            </span>
                          )}
                        </div>
                      )}

                      {offer.salary && (
                        <p className="text-green-600 font-medium mb-2">
                          💰 {offer.salary}
                        </p>
                      )}

                      {offer.application_deadline && (
                        <p className="text-sm text-orange-600">
                          📅 Date limite: {new Date(offer.application_deadline).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>

                    <Link href={`/candidat/offres/${offer.id}/postuler`}>
                      <Button
                        className="text-white ml-4"
                        style={{ backgroundColor: '#0F5D8C' }}
                      >
                        Postuler
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredOffers.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            {filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''} disponible{filteredOffers.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
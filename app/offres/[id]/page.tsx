'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Briefcase, MapPin, Calendar, DollarSign, Building, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { jobsAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { toast } from 'react-toastify'
import { CONTRACT_TYPE_LABELS } from '@/types'

interface JobOffer {
  id: number
  title: string
  company: string
  location: string
  contract_type: string
  salary: string
  image?: string | null
  application_deadline: string
  description: string
  skills: string[]
  status: string
  created_at: string
}

export default function OffreDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [offer, setOffer] = useState<JobOffer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOffer()
    }
  }, [params.id])

  const fetchOffer = async () => {
    try {
      const res = await jobsAPI.getOne(parseInt(params.id as string))
      if (res.ok) {
        const data = await res.json()
        setOffer(data)
      } else {
        toast.error('Offre non trouvée')
        router.push('/candidat/offres')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement de l\'offre')
      router.push('/candidat/offres')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0F5D8C' }}></div>
      </div>
    )
  }

  if (!offer) {
    return null
  }

  return (
    <div>
      <Navbar />

      <HeroSection
        title={offer.title}
        subtitle={`${offer.company} • ${offer.location}`}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Offres d\'emploi', href: '/candidat/offres' },
          { label: offer.title }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Button
          variant="outline"
          onClick={() => router.push('/candidat/offres')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux offres
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {offer.image && (
              <Card>
                <CardContent className="p-0">
                  <img src={offer.image} alt={offer.title} className="w-full h-64 object-cover rounded-t-lg" />
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0F5D8C' }}>
                  Description du poste
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{offer.description}</p>
              </CardContent>
            </Card>

            {/* Compétences requises */}
            {offer.skills && offer.skills.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: '#0F5D8C' }}>
                    Compétences et exigences
                  </h2>
                  <ul className="space-y-2">
                    {offer.skills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations clés */}
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0F5D8C' }}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: '#0F5D8C' }}>
                      Détails de l'offre
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Entreprise</p>
                      <p className="font-medium">{offer.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Localisation</p>
                      <p className="font-medium">{offer.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Type de contrat</p>
                      <p className="font-medium uppercase">
                        {CONTRACT_TYPE_LABELS[offer.contract_type as keyof typeof CONTRACT_TYPE_LABELS]}
                      </p>
                    </div>
                  </div>

                  {offer.salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Salaire</p>
                        <p className="font-medium text-green-600">{offer.salary}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Date limite</p>
                      <p className="font-medium">{formatDate(offer.application_deadline)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => router.push(`/candidat/offres/${offer.id}/postuler`)}
                    className="w-full text-white"
                    style={{ backgroundColor: '#0F5D8C' }}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Postuler à cette offre
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info box */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">💡 Conseil</h4>
                  <p className="text-sm text-blue-800">
                    Complétez votre auto-évaluation pour augmenter vos chances d'être contacté !
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
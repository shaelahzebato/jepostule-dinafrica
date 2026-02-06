'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Briefcase, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { jobsAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
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

export default function HomePage() {
  const router = useRouter()
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

  const handleCandidatureSpontanee = () => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      router.push('/candidature-spontanee')
    } else {
      router.push('/signin')
    }
  }

  const scrollToOffers = () => {
    const offersSection = document.getElementById('job-offers')
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="antialiased">
      <Navbar />

      <div className="min-h-screen bg-gray-50" style={{ fontFamily: '"Open Sans", sans-serif' }}>
        <HeroSection
          title="Trouvez votre prochain emploi<br />"
          subtitle="Découvrez nos offres d'emploi ou envoyez-nous votre candidature spontanée"
          breadcrumbs={[
            { label: 'Accueil', href: '/' },
            { label: 'Accueil' }
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* SECTION COMMENT SOUHAITEZ-VOUS POSTULER */}
          <div className="text-center mb-16">
            <h2 
              className="text-3xl font-bold mb-8" 
              style={{ color: '#0F5D8C', fontFamily: 'Poppins, sans-serif' }}
            >
              Comment souhaitez-vous postuler ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* CANDIDATURE SPONTANÉE */}
              <Card 
                onClick={handleCandidatureSpontanee}
                className="cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-blue-200"
              >
                <CardContent className="p-8">
                  <div className="text-center">
                    <div 
                      className="p-4 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center" 
                      style={{ backgroundColor: '#0F5D8C' }}
                    >
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F5D8C' }}>
                      Candidature spontanée
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Envoyez-nous votre CV et laissez-nous découvrir votre potentiel. Nous vous contacterons si un poste correspond à votre profil.
                    </p>
                    <div className="flex items-center justify-center text-blue-600 font-medium">
                      Postuler spontanément
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* POSTULER À UNE OFFRE */}
              <Card 
                onClick={scrollToOffers}
                className="cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-blue-200"
              >
                <CardContent className="p-8">
                  <div className="text-center">
                    <div 
                      className="p-4 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center" 
                      style={{ backgroundColor: '#0F5D8C' }}
                    >
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F5D8C' }}>
                      Postuler à une offre
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Consultez nos offres d&apos;emploi actuelles et postulez directement pour les postes qui vous intéressent.
                    </p>
                    <div className="flex items-center justify-center text-blue-600 font-medium">
                      Voir les offres
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SECTION NOS OFFRES D'EMPLOI */}
          <div id="job-offers" className="scroll-mt-24">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl font-bold mb-4" 
                style={{ color: '#0F5D8C', fontFamily: 'Poppins, sans-serif' }}
              >
                Nos offres d&apos;emploi
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Découvrez les opportunités de carrière qui vous attendent
              </p>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, entreprise ou lieu..."
                  className="pl-10 py-6 text-base"
                />
              </div>
            </div>

            {/* LISTE DES OFFRES */}
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
                  Nous n&apos;avons pas d&apos;offres d&apos;emploi actuellement, mais vous pouvez toujours envoyer votre candidature spontanée.
                </p>
                <Button
                  onClick={handleCandidatureSpontanee}
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: '#0F5D8C' }}
                >
                  Candidature spontanée
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {filteredOffers.map((offer) => (
                  <Link key={offer.id} href={`/postuler/${offer.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#0F5D8C' }}>
                          {offer.title}
                        </h3>
                        <p className="text-gray-700 mb-2">{offer.company} • {offer.location}</p>
                        <p className="text-gray-600 line-clamp-2">{offer.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}



// import Link from "next/link";


// export default function Home() {
//   return (
//     <div className="min-h-screen flex items-center justify-center s-gray-50">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold mb-4" style={{ color: '#0F5D8C' }}>
//           JePostule - DiNAfrica
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Plateforme de recrutement
//         </p>
//         <div className="flex gap-4 justify-center">
//           <Link 
//             href="/signin"
//             className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90"
//             style={{ backgroundColor: '#0F5D8C' }}
//           >
//             Connexion
//           </Link>
//           <Link 
//             href="/signup"
//             className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
//           >
//             Inscription
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }
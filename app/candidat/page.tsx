'use client'

import { useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { Briefcase, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function CandidatDashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace('/signin')
      return
    }

    if (user.role === 'admin') {
      router.replace('/admin')
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== 'candidat') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showActionButton actionButtonText="Postuler" actionButtonHref="/offres" />
      
      <HeroSection 
        title="Trouvez votre prochain emploi"
        subtitle="Découvrez nos offres d'emploi ou envoyez-nous votre candidature spontanée"
        breadcrumbs={[
          { label: 'Accueil', href: '/candidat' },
          { label: 'Espace candidat' }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12 flex-1">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0F5D8C' }}>
          Comment souhaitez-vous postuler ?
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidature spontanée */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#0F5D8C' }}>
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-center mb-4" style={{ color: '#0F5D8C' }}>
              Candidature spontanée
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Envoyez-nous votre CV et laissez-nous découvrir votre potentiel. Nous vous contacterons si un poste correspond à votre profil.
            </p>
            <Link href="/candidature-spontanee">
              <Button className="w-full text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0F5D8C' }}>
                Postuler spontanément →
              </Button>
            </Link>
          </div>

          {/* Postuler à une offre */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 rounded-full bg-green-600 mx-auto mb-6 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-center mb-4" style={{ color: '#0F5D8C' }}>
              Postuler à une offre
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Consultez nos offres d'emploi actuelles et postulez directement pour les postes qui vous intéressent.
            </p>
            <Link href="/offres">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors">
                Voir les offres →
              </Button>
            </Link>
          </div>
        </div>

        {/* Section Auto-évaluation */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#0F5D8C' }}>
                💡 Complétez votre auto-évaluation
              </h3>
              <p className="text-gray-600">
                Augmentez vos chances d'être recruté en complétant votre profil professionnel
              </p>
            </div>
            <Link href="/auto-evaluation">
              <Button variant="outline" className="whitespace-nowrap">
                Commencer →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
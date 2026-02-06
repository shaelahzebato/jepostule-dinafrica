// app/candidat/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Briefcase, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useUser } from '@/context/UserContext'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function CandidatHomePage() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (!user || user.role !== 'candidat') {
      router.push('/signin')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <HeroSection
        title="Bienvenue<br />Candidat"
        subtitle="Explorez les opportunités et postulez pour votre prochain défi."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Espace candidat' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section "Comment souhaitez-vous postuler ?" */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl font-bold mb-8" 
            style={{ color: '#0F5D8C', fontFamily: 'Poppins, sans-serif' }}
          >
            Comment souhaitez-vous postuler ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CANDIDATURE SPONTANÉE */}
            <Link href="/candidat/candidature-spontanee">
              <Card className="cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-blue-200 h-full">
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
            </Link>

            {/* POSTULER À UNE OFFRE */}
            <Link href="/candidat/offres">
              <Card className="cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-blue-200 h-full">
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
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
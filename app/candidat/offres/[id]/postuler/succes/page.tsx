'use client'

import { CheckCircle, Home, User, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function PostulerSuccessPage() {
  const router = useRouter()

  return (
    <div>
      <Navbar />
      
      <HeroSection
        title="Candidature envoyée"
        subtitle="Votre candidature a été transmise avec succès"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Espace candidat' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4" style={{ color: '#0F5D8C' }}>
            Candidature envoyée ! 🎉
          </h1>
          
          <p className="text-xl text-gray-700 mb-2">
            Votre candidature a été transmise avec succès
          </p>
          <p className="text-gray-600 mb-8">
            Nous avons bien reçu votre CV et vos informations
          </p>

          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h2 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Dossier candidat complet ! ☀️
            </h2>
            <p className="text-green-800 mb-4">Votre auto-évaluation est terminée</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-xs text-gray-600 mt-1">CV ✓</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-xs text-gray-600 mt-1">Auto-évaluation ✓</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-xs text-gray-600 mt-1">Candidature ✓</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-900">
                🎯 Votre dossier est maintenant optimisé pour nos recruteurs
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Profil complet • Évaluation détaillée • Candidature professionnelle
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: '#0F5D8C' }}>
              Que se passe-t-il maintenant ?
            </h3>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Réception confirmée ✅</h4>
                  <p className="text-sm text-gray-600">
                    Votre candidature est enregistrée dans notre système et sera traitée par nos équipes RH.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Analyse du profil 🔍</h4>
                  <p className="text-sm text-gray-600">
                    Nos recruteurs examineront votre CV et votre auto-évaluation complète pour mieux comprendre votre profil.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Contact si correspondance 📞</h4>
                  <p className="text-sm text-gray-600">
                    Si votre profil correspond à nos besoins actuels ou futurs, nous vous contacterons par email ou téléphone dans les plus brefs délais.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-6">
              <p className="text-sm font-medium text-orange-900">
                ⏱️ Délai estimé de traitement :
              </p>
              <p className="text-sm text-orange-800">
                2-5 jours ouvrés (dossier complet prioritaire)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/candidat')}
              variant="outline"
              className="border-blue-600 text-blue-600"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
            <Button
              onClick={() => router.push('/candidat/profil')}
              variant="outline"
              className="border-blue-600 text-blue-600"
            >
              <User className="w-4 h-4 mr-2" />
              Voir mon profil complet
            </Button>
            <Button
              onClick={() => router.push('/candidat/auto-evaluation')}
              className="text-white"
              style={{ backgroundColor: '#79B749' }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Voir mon évaluation
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Merci pour votre candidature complète !</strong> 🙏
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Votre dossier complet sera traité en priorité par notre équipe RH.
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            📊 Les candidats avec auto-évaluation complète ont 3x plus de chances d'être contactés !
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
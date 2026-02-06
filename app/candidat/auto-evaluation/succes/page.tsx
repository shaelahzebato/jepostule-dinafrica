'use client'

import { CheckCircle, Download, Home, User, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function AutoEvaluationSuccessPage() {
  const router = useRouter()

  return (
    <div>
      <Navbar />
      
      <HeroSection
        title="Évaluation terminée"
        subtitle="Votre auto-évaluation a été complétée avec succès"
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
            Félicitations !
          </h1>
          
          <p className="text-xl text-gray-700 mb-2">
            Votre auto-évaluation a été complétée avec succès
          </p>
          <p className="text-gray-600 mb-8">
            Terminée le 5 février 2026 à 21:46
          </p>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h2 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Résumé de votre évaluation
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-blue-800">Candidat :</span>
                <span className="font-medium text-blue-900">Candidat test</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Email :</span>
                <span className="font-medium text-blue-900">test@test.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Poste visé :</span>
                <span className="font-medium text-blue-900">Dev</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Statut :</span>
                <span className="text-green-600 font-medium">✓ Complétée</span>
              </div>
            </div>

            <p className="text-sm text-blue-800 mb-4">
              Le dossier d'auto-évaluation vous permet de présenter votre profil professionnel de manière détaillée.
              Il couvre 3 thèmes principaux :
            </p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded p-2 text-center">
                <span className="text-blue-600 font-bold">✓</span>
                <p className="text-xs text-gray-700 mt-1">Adéquation au poste</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="text-blue-600 font-bold">✓</span>
                <p className="text-xs text-gray-700 mt-1">Travail en équipe</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <span className="text-blue-600 font-bold">✓</span>
                <p className="text-xs text-gray-700 mt-1">Culture d'entreprise</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm text-green-900 flex items-center gap-2">
                <span>🎯</span>
                <span>Votre dossier est maintenant optimisé pour nos recruteurs</span>
              </p>
              <p className="text-xs text-green-700 mt-1">
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
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Évaluation sauvegardée</h4>
                  <p className="text-sm text-gray-600">
                    Votre auto-évaluation est automatiquement enregistrée et associée à votre profil candidat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Analyse par les recruteurs</h4>
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
                  <h4 className="font-semibold text-gray-900">Contact si correspondance</h4>
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
              variant="outline"
              className="border-blue-600 text-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger mon évaluation PDF
            </Button>
            <Button
              onClick={() => router.push('/candidat/profil')}
              variant="outline"
              className="border-green-600 text-green-600"
            >
              <User className="w-4 h-4 mr-2" />
              Voir mon profil complet
            </Button>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-2">
              <strong>Merci pour votre évaluation complète !</strong> 🙏
            </p>
            <p className="text-xs text-blue-700">
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
'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { CheckCircle, Download, Home, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function EvaluationCompletePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [evaluationData, setEvaluationData] = useState<any>(null)

  useEffect(() => {
    if (isLoading) return
    
    if (!user) {
      router.replace('/signin')
      return
    }

    if (user.role !== 'candidat') {
      router.replace('/admin')
      return
    }

    // Charger l'évaluation complétée
    const data = localStorage.getItem(`evaluation_final_${user.email}`)
    if (data) {
      setEvaluationData(JSON.parse(data))
    } else {
      // Pas d'évaluation → rediriger
      router.replace('/auto-evaluation')
    }
  }, [user, isLoading, router])

  const downloadEvaluation = () => {
    if (evaluationData) {
      const content = generateEvaluationDocument(evaluationData)
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `auto-evaluation-${user?.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Auto-évaluation téléchargée !')
    }
  }

  const generateEvaluationDocument = (data: any): string => {
    const currentDate = new Date().toLocaleDateString('fr-FR')
    
    return `
# AUTO-ÉVALUATION CANDIDAT

**Nom :** ${user?.name || ''}
**Email :** ${user?.email || ''}
**Date de completion :** ${new Date(data.completed_date).toLocaleDateString('fr-FR')}
**Intitulé du poste visé :** ${data.intitule_poste || ''}

---

## THÈME : ADÉQUATION AU POSTE

### ÉTUDES
**Parcours d'études :**
${data.parcours_etudes || ''}

### EXPÉRIENCES
**Parcours professionnel :**
${data.parcours_experience || ''}

**Mission préférée :**
${data.mission_preferee || ''}

**Tâche réalisée :**
${data.tache_realisee || ''}

**Difficultés/Succès :**
${data.difficultes_succes || ''}

**Reporting :**
${data.reporting || ''}

**Compétences acquises :**
${data.competences_acquises || ''}

**Qualités reconnues :**
${data.qualites_reconnues || ''}

**Travail dans l'urgence :**
${data.travail_urgence || ''}

**Retenu de l'expérience :**
${data.retenu_experience || ''}

---

## THÈME : ADÉQUATION À L'ÉQUIPE / AU MANAGER

### CONTEXTE DE TRAVAIL
**Préférence de travail :**
${data.preference_travail || ''}

**Expérience en équipe :**
${data.experience_equipe || ''}

**Objectifs personnels :**
${data.objectifs_personnels || ''}

### STYLE DE MANAGEMENT
**Gestion du stress :**
${data.gestion_stress || ''}

**Contexte difficile :**
${data.contexte_difficile || ''}

**Qualités des supérieurs :**
${data.qualites_superieurs || ''}

**Expérience d'encadrement :**
${data.experience_encadrement || 'Aucune expérience d\'encadrement mentionnée'}

**Formes de reconnaissance :**
${data.formes_reconnaissance || ''}

**Réaction aux remontrances :**
${data.reaction_remontrance || ''}

**Manque d'informations :**
${data.manque_informations || ''}

---

## THÈME : ADÉQUATION À LA CULTURE D'ENTREPRISE

### ORGANISATION DE L'ENTREPRISE
**Type d'organisation :**
${data.type_organisation || ''}

### PROJET PROFESSIONNEL
**Projet professionnel :**
${data.projet_professionnel || ''}

### CULTURE D'ENTREPRISE
**Valeurs de l'entreprise :**
${data.valeurs_entreprise || ''}

**Codes d'accueil :**
${data.codes_accueil || ''}

**Implication dans l'entreprise :**
${data.implication_entreprise || ''}

**Environnement préféré :**
${data.environnement_prefere || ''}

**Réaction aux règles :**
${data.reaction_regles || ''}

**Apport à l'équipe :**
${data.apport_equipe || ''}

---

Document généré automatiquement le ${currentDate}
Évaluation complétée par ${user?.name} (${user?.email})
`.trim()
  }

  if (isLoading || !user || user.role !== 'candidat') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!evaluationData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Hero simplifié */}
      <div className="relative" style={{ backgroundColor: '#0F5D8C' }}>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Évaluation terminée</h1>
          <p className="text-blue-100 text-lg">Votre auto-évaluation a été complétée avec succès</p>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-12 fill-gray-50">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Icône de succès */}
          <div className="mb-8">
            <div 
              className="p-6 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center"
              style={{ backgroundColor: '#0F5D8C' }}
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: '#0F5D8C' }}
            >
              Félicitations !
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Votre auto-évaluation a été complétée avec succès
            </p>
            {evaluationData && (
              <p className="text-sm text-gray-500">
                Terminée le {new Date(evaluationData.completed_date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>

          {/* Résumé */}
          {evaluationData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Résumé de votre évaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Candidat :</span>
                  <p className="text-blue-700">{user?.name}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Email :</span>
                  <p className="text-blue-700">{user?.email}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Poste visé :</span>
                  <p className="text-blue-700">{evaluationData.intitule_poste}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Statut :</span>
                  <p className="text-green-600 font-medium">✓ Complétée</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={downloadEvaluation}
                className="flex items-center justify-center text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: '#0F5D8C' }}
              >
                <Download className="h-5 w-5 mr-2" />
                Télécharger mon évaluation
              </Button>
              
              <Link href="/candidat">
                <Button
                  variant="outline"
                  className="flex items-center justify-center w-full"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Que se passe-t-il maintenant ?
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Évaluation sauvegardée</p>
                  <p className="text-sm text-gray-600">Votre auto-évaluation est automatiquement enregistrée et associée à votre profil candidat.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Analyse par les recruteurs</p>
                  <p className="text-sm text-gray-600">Nos équipes RH examineront votre évaluation pour mieux comprendre votre profil.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Contact si correspondance</p>
                  <p className="text-sm text-gray-600">Si votre profil correspond à nos besoins, nous vous contacterons pour un entretien.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions secondaires */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Vous pouvez continuer à explorer nos opportunités
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/candidature-spontanee">
                <Button variant="outline" className="w-full sm:w-auto">
                  Candidature spontanée
                </Button>
              </Link>
              <Link href="/offres">
                <Button variant="outline" className="w-full sm:w-auto">
                  Voir les offres d'emploi
                </Button>
              </Link>
              <Link href="/profil">
                <Button variant="outline" className="w-full sm:w-auto">
                  Modifier mon profil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
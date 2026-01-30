'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { ArrowLeft, ArrowRight, Save, CheckCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

const evaluationSchema = z.object({
  intitule_poste: z.string().min(1, 'Intitulé du poste requis'),
  parcours_etudes: z.string().min(10, 'Minimum 10 caractères'),
  parcours_experience: z.string().min(10, 'Minimum 10 caractères'),
  mission_preferee: z.string().min(10, 'Minimum 10 caractères'),
  tache_realisee: z.string().min(10, 'Minimum 10 caractères'),
  difficultes_succes: z.string().min(10, 'Minimum 10 caractères'),
  reporting: z.string().min(10, 'Minimum 10 caractères'),
  competences_acquises: z.string().min(10, 'Minimum 10 caractères'),
  qualites_reconnues: z.string().min(10, 'Minimum 10 caractères'),
  travail_urgence: z.string().min(10, 'Minimum 10 caractères'),
  retenu_experience: z.string().min(10, 'Minimum 10 caractères'),
  preference_travail: z.string().min(10, 'Minimum 10 caractères'),
  experience_equipe: z.string().min(10, 'Minimum 10 caractères'),
  objectifs_personnels: z.string().min(10, 'Minimum 10 caractères'),
  gestion_stress: z.string().min(10, 'Minimum 10 caractères'),
  contexte_difficile: z.string().min(10, 'Minimum 10 caractères'),
  qualites_superieurs: z.string().min(10, 'Minimum 10 caractères'),
  experience_encadrement: z.string().optional(),
  formes_reconnaissance: z.string().min(10, 'Minimum 10 caractères'),
  reaction_remontrance: z.string().min(10, 'Minimum 10 caractères'),
  manque_informations: z.string().min(10, 'Minimum 10 caractères'),
  type_organisation: z.string().min(10, 'Minimum 10 caractères'),
  projet_professionnel: z.string().min(10, 'Minimum 10 caractères'),
  valeurs_entreprise: z.string().min(10, 'Minimum 10 caractères'),
  codes_accueil: z.string().min(10, 'Minimum 10 caractères'),
  implication_entreprise: z.string().min(10, 'Minimum 10 caractères'),
  environnement_prefere: z.string().min(10, 'Minimum 10 caractères'),
  reaction_regles: z.string().min(10, 'Minimum 10 caractères'),
  apport_equipe: z.string().min(10, 'Minimum 10 caractères'),
})

type EvaluationFormValues = z.infer<typeof evaluationSchema>

interface StepConfig {
  title: string
  subtitle: string
  fields: (keyof EvaluationFormValues)[]
}

const steps: StepConfig[] = [
  {
    title: "Informations générales",
    subtitle: "Commençons par quelques informations de base",
    fields: ["intitule_poste"]
  },
  {
    title: "Études et formation",
    subtitle: "Parlez-nous de votre parcours académique",
    fields: ["parcours_etudes"]
  },
  {
    title: "Expérience professionnelle",
    subtitle: "Détaillez votre parcours professionnel",
    fields: ["parcours_experience", "mission_preferee", "tache_realisee"]
  },
  {
    title: "Performance et compétences",
    subtitle: "Évaluez vos performances et compétences",
    fields: ["difficultes_succes", "reporting", "competences_acquises", "qualites_reconnues"]
  },
  {
    title: "Gestion du travail",
    subtitle: "Comment gérez-vous votre travail au quotidien",
    fields: ["travail_urgence", "retenu_experience"]
  },
  {
    title: "Travail en équipe",
    subtitle: "Votre approche du travail collaboratif",
    fields: ["preference_travail", "experience_equipe", "objectifs_personnels"]
  },
  {
    title: "Gestion du stress et conflits",
    subtitle: "Comment gérez-vous les situations difficiles",
    fields: ["gestion_stress", "contexte_difficile", "qualites_superieurs"]
  },
  {
    title: "Management et reconnaissance",
    subtitle: "Votre relation au management",
    fields: ["experience_encadrement", "formes_reconnaissance", "reaction_remontrance", "manque_informations"]
  },
  {
    title: "Culture d'entreprise",
    subtitle: "Vos attentes vis-à-vis de l'entreprise",
    fields: ["type_organisation", "projet_professionnel", "valeurs_entreprise"]
  },
  {
    title: "Intégration et adaptation",
    subtitle: "Comment vous intégrez-vous dans un environnement",
    fields: ["codes_accueil", "implication_entreprise", "environnement_prefere"]
  },
  {
    title: "Vision et contribution",
    subtitle: "Votre vision de votre contribution",
    fields: ["reaction_regles", "apport_equipe"]
  }
]

const questionLabels: Record<keyof EvaluationFormValues, { label: string; placeholder: string; type?: 'input' | 'textarea' }> = {
  intitule_poste: {
    label: "Intitulé du poste visé",
    placeholder: "Ex: Développeur Full Stack, Chef de projet...",
    type: 'input'
  },
  parcours_etudes: {
    label: "Décrivez votre parcours d'études en expliquant vos différents choix",
    placeholder: "Décrivez votre formation, vos choix d'orientation..."
  },
  parcours_experience: {
    label: "Décrivez votre parcours professionnel et les transitions entre vos différents postes",
    placeholder: "Expliquez votre évolution professionnelle..."
  },
  mission_preferee: {
    label: "Quelle mission avez-vous préférée et pour quelles raisons ?",
    placeholder: "Décrivez la mission qui vous a le plus plu..."
  },
  tache_realisee: {
    label: "Racontez une tâche concrète que vous avez réalisée",
    placeholder: "Décrivez une tâche spécifique, les étapes..."
  },
  difficultes_succes: {
    label: "Quelles difficultés/succès avez-vous rencontrés ?",
    placeholder: "Partagez vos expériences positives et négatives..."
  },
  reporting: {
    label: "Quel reporting faisiez-vous ? À qui ? Comment ? À quelle fréquence ?",
    placeholder: "Décrivez vos habitudes de reporting..."
  },
  competences_acquises: {
    label: "Quelles compétences avez-vous acquises ? Points à améliorer ?",
    placeholder: "Listez les compétences développées..."
  },
  qualites_reconnues: {
    label: "Quelles qualités vous reconnaissent vos collègues/responsables ?",
    placeholder: "Citez des exemples concrets de feedback..."
  },
  travail_urgence: {
    label: "Comment gérez-vous les situations urgentes ?",
    placeholder: "Donnez un exemple de situation urgente..."
  },
  retenu_experience: {
    label: "Que retenez-vous de votre dernière expérience ?",
    placeholder: "Quels sont les principaux enseignements..."
  },
  preference_travail: {
    label: "Préférez-vous travailler seul(e), en binôme ou en équipe ?",
    placeholder: "Expliquez votre mode de travail préféré..."
  },
  experience_equipe: {
    label: "Décrivez votre expérience de travail en équipe",
    placeholder: "Parlez de vos expériences de collaboration..."
  },
  objectifs_personnels: {
    label: "Aimez-vous avoir des objectifs personnels à atteindre ?",
    placeholder: "Parlez de votre rapport aux objectifs..."
  },
  gestion_stress: {
    label: "Comment gérez-vous le stress ?",
    placeholder: "Décrivez des situations stressantes vécues..."
  },
  contexte_difficile: {
    label: "Comment réagissez-vous dans un contexte difficile ou conflictuel ?",
    placeholder: "Expliquez votre approche face aux conflits..."
  },
  qualites_superieurs: {
    label: "Quelles qualités attendez-vous de vos supérieurs ?",
    placeholder: "Décrivez le management idéal pour vous..."
  },
  experience_encadrement: {
    label: "Avez-vous eu une expérience d'encadrement ?",
    placeholder: "Si oui : nombre de personnes, responsabilités..."
  },
  formes_reconnaissance: {
    label: "Quelles formes de reconnaissance vous motivent ?",
    placeholder: "Salaire, confiance, responsabilités, feedback..."
  },
  reaction_remontrance: {
    label: "Comment réagissez-vous face à une remontrance ?",
    placeholder: "Donnez un exemple de situation..."
  },
  manque_informations: {
    label: "Que faites-vous quand vous manquez d'informations ?",
    placeholder: "Décrivez votre approche..."
  },
  type_organisation: {
    label: "Dans quel type d'organisation souhaitez-vous travailler ?",
    placeholder: "TPE/PME/GROUPE/FAMILIALE..."
  },
  projet_professionnel: {
    label: "Quel est votre projet professionnel ?",
    placeholder: "Décrivez vos objectifs de carrière..."
  },
  valeurs_entreprise: {
    label: "Quelles valeurs l'entreprise doit-elle défendre ?",
    placeholder: "Listez les valeurs importantes pour vous..."
  },
  codes_accueil: {
    label: "Comment vous adaptez-vous aux codes d'accueil ?",
    placeholder: "Décrivez votre capacité d'adaptation..."
  },
  implication_entreprise: {
    label: "Que voulez-vous trouver dans l'entreprise pour vous sentir impliqué(e) ?",
    placeholder: "Reconnaissance, évolution, métier..."
  },
  environnement_prefere: {
    label: "Quel environnement professionnel avez-vous préféré ?",
    placeholder: "Décrivez l'environnement idéal..."
  },
  reaction_regles: {
    label: "Comment réagissez-vous face à des règles qui ne vous conviennent pas ?",
    placeholder: "Donnez un exemple de situation..."
  },
  apport_equipe: {
    label: "Que pouvez-vous apporter à une équipe/entreprise ?",
    placeholder: "Décrivez vos forces et votre valeur ajoutée..."
  },
}

export default function AutoEvaluationPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    mode: 'onChange'
  })

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

    // Charger les données sauvegardées
    const savedData = localStorage.getItem(`evaluation_${user.email}`)
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        form.reset(data)
        
        // Marquer les étapes complétées
        const completed = new Set<number>()
        steps.forEach((step, index) => {
          const isComplete = step.fields.every(field => {
            const value = data[field]
            return value && value.toString().trim().length >= 10
          })
          if (isComplete) completed.add(index)
        })
        setCompletedSteps(completed)
      } catch (error) {
        console.error('Erreur chargement:', error)
      }
    }
  }, [user, isLoading, router, form])

  // Sauvegarde automatique
  useEffect(() => {
    const subscription = form.watch(() => {
      if (user?.email) {
        const currentData = form.getValues()
        localStorage.setItem(`evaluation_${user.email}`, JSON.stringify(currentData))
        
        // Mettre à jour les étapes complétées
        const completed = new Set<number>()
        steps.forEach((step, index) => {
          const isComplete = step.fields.every(field => {
            const value = currentData[field]
            return value && value.toString().trim().length >= 10
          })
          if (isComplete) completed.add(index)
        })
        setCompletedSteps(completed)
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch, user])

  const onSubmit = async (data: EvaluationFormValues) => {
    setIsSubmitting(true)
    try {
      const evaluationData = {
        ...data,
        candidat_email: user?.email,
        candidat_name: user?.name,
        completed_date: new Date().toISOString(),
        status: 'completed'
      }

      localStorage.setItem(`evaluation_final_${user?.email}`, JSON.stringify(evaluationData))
      
      const completedEvals = JSON.parse(localStorage.getItem('completed_evaluations') || '[]')
      completedEvals.push(evaluationData)
      localStorage.setItem('completed_evaluations', JSON.stringify(completedEvals))

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Auto-évaluation complétée avec succès !')
      router.push('/evaluation-complete')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateProgress = () => {
    const totalFields = steps.reduce((total, step) => total + step.fields.length, 0)
    const completedFields = steps.reduce((completed, step) => {
      const stepCompleted = step.fields.filter(field => {
        const value = form.watch(field)
        return value && value.toString().trim().length >= 10
      }).length
      return completed + stepCompleted
    }, 0)
    return Math.round((completedFields / totalFields) * 100)
  }

  const progress = calculateProgress()
  const currentStepConfig = steps[currentStep]

  if (isLoading || !user || user.role !== 'candidat') {
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
        title="Auto-évaluation candidat"
        subtitle="Évaluez votre profil professionnel - Vos réponses sont sauvegardées automatiquement"
        breadcrumbs={[
          { label: 'Accueil', href: '/candidat' },
          { label: 'Auto-évaluation' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12 flex-1">
        {/* En-tête progression */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
                Auto-évaluation
              </h2>
              <p className="text-gray-600 mt-1">
                Étape {currentStep + 1} sur {steps.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progression</div>
              <div className="text-lg font-semibold text-blue-600">{progress}%</div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: '#0F5D8C',
                width: `${progress}%`
              }}
            />
          </div>

          {/* Indicateurs d'étapes */}
          <div className="flex flex-wrap gap-2 justify-center">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center justify-center ${
                  index === currentStep
                    ? 'bg-blue-600 text-white scale-110'
                    : completedSteps.has(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                }`}
              >
                {completedSteps.has(index) ? <CheckCircle className="h-5 w-5" /> : index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#0F5D8C' }}>
              {currentStepConfig.title}
            </h3>
            <p className="text-gray-600">{currentStepConfig.subtitle}</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStepConfig.fields.map((fieldName) => {
              const config = questionLabels[fieldName]
              const error = form.formState.errors[fieldName]
              
              return (
                <div key={fieldName}>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {config.label}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  {config.type === 'input' ? (
                    <Input
                      {...form.register(fieldName)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder={config.placeholder}
                    />
                  ) : (
                    <textarea
                      {...form.register(fieldName)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      placeholder={config.placeholder}
                    />
                  )}
                  
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error.message}</p>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {form.watch(fieldName)?.length || 0} caractères
                  </div>
                </div>
              )
            })}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex items-center gap-3">
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-white font-semibold hover:opacity-90"
                    style={{ backgroundColor: '#0F5D8C' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Finalisation...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Terminer l'évaluation
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 text-white font-semibold hover:opacity-90"
                    style={{ backgroundColor: '#0F5D8C' }}
                  >
                    Suivant
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Conseils */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <FileText className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-medium text-blue-900 mb-2">
                Conseils pour bien répondre
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Soyez spécifique et donnez des exemples concrets</li>
                <li>• Restez authentique dans vos réponses</li>
                <li>• N'hésitez pas à détailler vos expériences</li>
                <li>• Vos réponses sont sauvegardées automatiquement</li>
                <li>• Vous pouvez revenir sur les étapes précédentes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
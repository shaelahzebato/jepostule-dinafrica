'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { toast } from 'react-toastify'
import { ChevronLeft, ChevronRight, Download, Save } from 'lucide-react'

export default function AutoEvaluationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const totalSteps = 11

  const steps = [
    {
      id: 1,
      title: 'Informations générales',
      subtitle: 'Commençons par quelques informations de base',
      question: 'Intitulé du poste visé',
      placeholder: 'Ex: Développeur Full Stack, Chef de projet...'
    },
    // Les 10 autres étapes...
    {
      id: 2,
      title: 'Compétences techniques',
      subtitle: 'Décrivez vos compétences principales',
      question: 'Quelles sont vos compétences techniques principales ?',
      placeholder: 'Ex: React, TypeScript, Node.js, Python...',
      isTextarea: true
    },
    {
      id: 3,
      title: 'Expérience professionnelle',
      subtitle: 'Parlez-nous de votre parcours',
      question: 'Décrivez brièvement votre expérience professionnelle',
      placeholder: 'Vos expériences les plus significatives...',
      isTextarea: true
    },
    {
      id: 4,
      title: 'Formation académique',
      subtitle: 'Votre parcours éducatif',
      question: 'Quel est votre niveau d\'études et vos diplômes ?',
      placeholder: 'Ex: Master en Informatique, Licence...',
      isTextarea: true
    },
    {
      id: 5,
      title: 'Projets réalisés',
      subtitle: 'Vos réalisations concrètes',
      question: 'Décrivez vos projets les plus significatifs',
      placeholder: 'Projets professionnels ou personnels...',
      isTextarea: true
    },
    {
      id: 6,
      title: 'Objectifs professionnels',
      subtitle: 'Où vous voyez-vous dans le futur ?',
      question: 'Quels sont vos objectifs de carrière à court et moyen terme ?',
      placeholder: 'Vos aspirations professionnelles...',
      isTextarea: true
    },
    {
      id: 7,
      title: 'Soft skills',
      subtitle: 'Vos compétences comportementales',
      question: 'Quelles sont vos principales qualités humaines et relationnelles ?',
      placeholder: 'Ex: Leadership, communication, adaptabilité...',
      isTextarea: true
    },
    {
      id: 8,
      title: 'Motivations',
      subtitle: 'Ce qui vous anime',
      question: 'Qu\'est-ce qui vous motive dans votre travail ?',
      placeholder: 'Vos sources de motivation...',
      isTextarea: true
    },
    {
      id: 9,
      title: 'Valeurs professionnelles',
      subtitle: 'Ce qui est important pour vous',
      question: 'Quelles sont les valeurs qui guident votre travail ?',
      placeholder: 'Ex: Innovation, collaboration, excellence...',
      isTextarea: true
    },
    {
      id: 10,
      title: 'Adaptabilité',
      subtitle: 'Votre flexibilité professionnelle',
      question: 'Comment réagissez-vous face aux changements et aux défis ?',
      placeholder: 'Votre capacité d\'adaptation...',
      isTextarea: true
    },
    {
      id: 11,
      title: 'Vision long terme',
      subtitle: 'Votre perspective d\'avenir',
      question: 'Où vous voyez-vous dans 5 ans ?',
      placeholder: 'Votre vision à long terme...',
      isTextarea: true
    }
  ]

  const progress = Math.round((currentStep / totalSteps) * 100)
  const currentStepData = steps.find(s => s.id === currentStep)

  const handleNext = () => {
    if (!responses[currentStep]?.trim()) {
      toast.error('Veuillez répondre à la question avant de continuer')
      return
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    toast.success('Progression sauvegardée automatiquement')
  }

  const handleSubmit = () => {
    toast.success('Évaluation terminée !')
    router.push('/candidat/auto-evaluation/succes')
  }

  return (
    <div>
      <Navbar />
      
      <HeroSection
        title="Auto-évaluation candidat"
        subtitle="Dossier parcours candidat - Évaluez votre profil professionnel"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Espace candidat' }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Card className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
                Auto-évaluation candidat
              </h2>
              <p className="text-gray-600">Étape {currentStep} sur {totalSteps}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="hidden sm:flex"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progression</p>
                <p className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>{progress}%</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: '#0F5D8C' }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step.id < currentStep
                      ? 'bg-green-500 text-white'
                      : step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </div>
              ))}
            </div>
          </div>

          {/* Current step */}
          {currentStepData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0F5D8C' }}>
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600">{currentStepData.subtitle}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {currentStepData.question} <span className="text-red-500">*</span>
                </label>
                {currentStepData.isTextarea ? (
                  <textarea
                    value={responses[currentStep] || ''}
                    onChange={(e) => setResponses({ ...responses, [currentStep]: e.target.value })}
                    placeholder={currentStepData.placeholder}
                    className="w-full border rounded-lg px-4 py-3 min-h-[150px] resize-y"
                    maxLength={500}
                  />
                ) : (
                  <Input
                    value={responses[currentStep] || ''}
                    onChange={(e) => setResponses({ ...responses, [currentStep]: e.target.value })}
                    placeholder={currentStepData.placeholder}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {responses[currentStep]?.length || 0} caractères
                </p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  📝 Conseils pour bien répondre
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Soyez spécifique et donnez des exemples concrets</li>
                  <li>• Restez authentique dans vos réponses</li>
                  <li>• N'hésitez pas à détailler vos expériences</li>
                  <li>• Vos réponses sont sauvegardées automatiquement</li>
                  <li>• Vous pouvez revenir sur les étapes précédentes</li>
                  <li>• Téléchargez votre évaluation en PDF à tout moment</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            <Button
              onClick={handleNext}
              className="text-white"
              style={{ backgroundColor: '#0F5D8C' }}
            >
              {currentStep === totalSteps ? (
                <>
                  <span>Terminer l'évaluation</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
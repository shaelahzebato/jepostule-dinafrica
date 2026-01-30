'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { Plus, X } from 'lucide-react'
import { jobsAPI } from '@/lib/api'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

const offreSchema = z.object({
  title: z.string().min(3, 'Minimum 3 caractères'),
  company: z.string().min(2, 'Minimum 2 caractères'),
  location: z.string().min(2, 'Localisation requise'),
  contract_type: z.enum(['cdi', 'cdd', 'stage', 'freelance']),
  salary: z.string().min(1, 'Salaire requis'),
  application_deadline: z.string().min(1, 'Date limite requise'),
  description: z.string().min(50, 'Description trop courte (minimum 50 caractères)'),
})

type OffreFormValues = z.infer<typeof offreSchema>

export default function CreerOffrePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState('')

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace('/signin')
      return
    }

    if (user.role !== 'admin') {
      router.replace('/candidat')
    }
  }, [user, isLoading, router])

  const form = useForm<OffreFormValues>({
    resolver: zodResolver(offreSchema),
    defaultValues: {
      title: '',
      company: 'DiNAfrica',
      location: 'Abidjan, Côte d\'Ivoire',
      contract_type: 'cdi',
      salary: '',
      application_deadline: '',
      description: '',
    }
  })

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove))
  }

  const onSubmit = async (data: OffreFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        skills: skills,
        status: 'published'
      }

      const res = await jobsAPI.create(payload)

      if (!res.ok) {
        const error = await res.json()
        toast.error(error?.message || 'Erreur lors de la création')
        return
      }

      toast.success('Offre créée avec succès !')
      setTimeout(() => {
        router.push('/admin/offres')
      }, 1500)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur réseau')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !user || user.role !== 'admin') {
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
        title="Créer une offre d'emploi"
        subtitle="Publiez une nouvelle offre pour attirer les meilleurs talents"
        breadcrumbs={[
          { label: 'Accueil', href: '/admin' },
          { label: 'Offres', href: '/admin/offres' },
          { label: 'Créer une offre' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Titre du poste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du poste *
              </label>
              <Input
                {...form.register('title')}
                placeholder="Ex: Développeur Full Stack Senior"
                className="text-lg"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Entreprise et Localisation */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise *
                </label>
                <Input
                  {...form.register('company')}
                  placeholder="DiNAfrica"
                />
                {form.formState.errors.company && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <Input
                  {...form.register('location')}
                  placeholder="Abidjan, Côte d'Ivoire"
                />
                {form.formState.errors.location && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Type de contrat et Salaire */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  {...form.register('contract_type')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="stage">Stage</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire *
                </label>
                <Input
                  {...form.register('salary')}
                  placeholder="500 000 - 800 000 FCFA"
                />
                {form.formState.errors.salary && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.salary.message}</p>
                )}
              </div>
            </div>

            {/* Date limite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date limite de candidature *
              </label>
              <Input
                type="date"
                {...form.register('application_deadline')}
                min={new Date().toISOString().split('T')[0]}
              />
              {form.formState.errors.application_deadline && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.application_deadline.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du poste *
              </label>
              <textarea
                {...form.register('description')}
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Décrivez le poste, les missions, le profil recherché..."
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {form.watch('description')?.length || 0} caractères (minimum 50)
              </p>
            </div>

            {/* Compétences requises */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences requises
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="Ex: JavaScript, React..."
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-2 whitespace-nowrap"
                  style={{ backgroundColor: '#0F5D8C' }}
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>

              {/* Liste des compétences */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Appuyez sur Entrée ou cliquez sur "Ajouter" pour ajouter une compétence
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                onClick={() => router.push('/admin/offres')}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: '#0F5D8C' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Publier l'offre
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Aperçu (optionnel) */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Conseil</h3>
          <p className="text-blue-800 text-sm">
            Une offre bien détaillée attire les meilleurs candidats. N'hésitez pas à préciser les missions, 
            les avantages et les perspectives d'évolution.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
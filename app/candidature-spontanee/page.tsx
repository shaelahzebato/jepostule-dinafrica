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
import { Upload, FileText } from 'lucide-react'
import { applicationsAPI } from '@/lib/api'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

const candidatureSchema = z.object({
  civility: z.enum(['monsieur', 'madame']),
  first_name: z.string().min(2, 'Minimum 2 caractères'),
  last_name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone invalide'),
  country: z.string().min(2, 'Pays requis'),
  address: z.string().min(5, 'Adresse requise'),
  contract_type_sought: z.enum(['cdi', 'cdd', 'stage', 'freelance']),
  experience: z.array(z.string()).min(1, 'Sélectionnez au moins une expérience'),
  education_level: z.enum(['bac', 'licence', 'master', 'mba', 'doctorat']),
  current_salary: z.number().min(0, 'Salaire invalide'),
  expected_salary: z.number().min(0, 'Salaire invalide'),
})

type FormValues = z.infer<typeof candidatureSchema>

export default function CandidatureSpontaneePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)

  useEffect(() => {
    if (isLoading) return
    
    if (!user) {
      router.replace('/signin')
    }
  }, [user, isLoading, router])

  const form = useForm<FormValues>({
    resolver: zodResolver(candidatureSchema),
    defaultValues: {
      civility: 'monsieur',
      first_name: user?.name?.split(' ')[0] || '',
      last_name: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
      country: 'Côte d\'Ivoire',
      address: '',
      contract_type_sought: 'cdi',
      experience: [],
      education_level: 'licence',
      current_salary: 0,
      expected_salary: 0,
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        is_spontaneous: true,
        job: null
      }

      const res = await applicationsAPI.create(payload)

      if (!res.ok) {
        const error = await res.json()
        toast.error(error?.message || 'Erreur lors de l\'envoi')
        return
      }

      toast.success('Candidature envoyée avec succès !')
      setTimeout(() => {
        router.push('/candidat')
      }, 1500)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur réseau')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !user) {
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
        title="Candidature spontanée"
        subtitle="Envoyez-nous votre profil et nous vous contacterons si une opportunité correspond"
        breadcrumbs={[
          { label: 'Accueil', href: '/candidat' },
          { label: 'Candidature spontanée' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Civilité */}
            <div>
              <label className="block text-sm font-medium mb-2">Civilité *</label>
              <div className="flex gap-4">
                {['monsieur', 'madame'].map((val) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={val}
                      {...form.register('civility')}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{val}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nom Prénom */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prénom *</label>
                <Input {...form.register('first_name')} placeholder="Votre prénom" />
                {form.formState.errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.first_name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <Input {...form.register('last_name')} placeholder="Votre nom" />
                {form.formState.errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Email Téléphone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input type="email" {...form.register('email')} placeholder="votre@email.com" />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone *</label>
                <Input {...form.register('phone')} placeholder="+225 XX XX XX XX" />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Pays Adresse */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pays *</label>
                <Input {...form.register('country')} placeholder="Côte d'Ivoire" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Adresse *</label>
                <Input {...form.register('address')} placeholder="Abidjan, Cocody..." />
              </div>
            </div>

            {/* Type de contrat */}
            <div>
              <label className="block text-sm font-medium mb-2">Type de contrat recherché *</label>
              <select {...form.register('contract_type_sought')} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="stage">Stage</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Expérience */}
            <div>
              <label className="block text-sm font-medium mb-2">Expérience *</label>
              <div className="grid md:grid-cols-2 gap-2">
                {['junior', 'intermediaire', 'senior', 'freelance'].map((exp) => (
                  <label key={exp} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={exp}
                      {...form.register('experience')}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{exp}</span>
                  </label>
                ))}
              </div>
              {form.formState.errors.experience && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.experience.message}</p>
              )}
            </div>

            {/* Niveau d'études */}
            <div>
              <label className="block text-sm font-medium mb-2">Niveau d'études *</label>
              <select {...form.register('education_level')} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="bac">Bac</option>
                <option value="licence">Licence</option>
                <option value="master">Master</option>
                <option value="mba">MBA</option>
                <option value="doctorat">Doctorat</option>
              </select>
            </div>

            {/* Salaires */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Salaire actuel (FCFA) *</label>
                <Input
                  type="number"
                  {...form.register('current_salary', { valueAsNumber: true })}
                  placeholder="500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prétention salariale (FCFA) *</label>
                <Input
                  type="number"
                  {...form.register('expected_salary', { valueAsNumber: true })}
                  placeholder="700000"
                />
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">CV (PDF)</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  {cvFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FileText className="w-6 h-6" />
                      <span>{cvFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Cliquez pour télécharger votre CV</p>
                      <p className="text-xs text-gray-500 mt-1">Format PDF uniquement</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold py-6 text-lg hover:opacity-90"
              style={{ backgroundColor: '#0F5D8C' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { Upload, FileText, Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react'
import { applicationsAPI, jobsAPI } from '@/lib/api'
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

export default function PostulerOffrePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const params = useParams()
  const offerId = params.id as string
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [offer, setOffer] = useState<JobOffer | null>(null)
  const [isLoadingOffer, setIsLoadingOffer] = useState(true)

  useEffect(() => {
    if (isLoading) return
    
    if (!user) {
      router.replace('/signin')
      return
    }

    fetchOffer()
  }, [user, isLoading, offerId, router])

  const fetchOffer = async () => {
    try {
      const res = await jobsAPI.getOne(offerId)
      if (res.ok) {
        const data = await res.json()
        setOffer(data)
      } else {
        toast.error('Offre introuvable')
        router.push('/offres')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Impossible de charger l\'offre')
    } finally {
      setIsLoadingOffer(false)
    }
  }

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
        is_spontaneous: false,
        job: parseInt(offerId)
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

  if (isLoading || !user || isLoadingOffer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!offer) {
    return null
  }

  const contractTypeLabels: Record<string, string> = {
    cdi: 'CDI',
    cdd: 'CDD',
    stage: 'Stage',
    freelance: 'Freelance'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <HeroSection 
        title={`Postuler : ${offer.title}`}
        subtitle="Complétez le formulaire ci-dessous pour envoyer votre candidature"
        breadcrumbs={[
          { label: 'Accueil', href: '/candidat' },
          { label: 'Offres', href: '/offres' },
          { label: offer.title }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12 flex-1">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Détails de l'offre - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {contractTypeLabels[offer.contract_type]}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-4" style={{ color: '#0F5D8C' }}>
                {offer.title}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{offer.company}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{offer.location}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{offer.salary}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Date limite : {new Date(offer.application_deadline).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{offer.description}</p>
              </div>

              {offer.skills && offer.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Compétences requises</h4>
                  <div className="flex flex-wrap gap-2">
                    {offer.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire de candidature */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F5D8C' }}>
                Formulaire de candidature
              </h2>

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
        </div>
      </div>

      <Footer />
    </div>
  )
}
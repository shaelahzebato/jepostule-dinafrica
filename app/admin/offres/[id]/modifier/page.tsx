'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Briefcase, Upload, X, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { jobsAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { toast } from 'react-toastify'

interface JobOffer {
  id: number
  title: string
  company: string
  location: string
  contract_type: string
  salary: string
  image?: string | null
  application_deadline: string
  description: string
  skills: string[]
  status: 'published' | 'draft'
}

export default function ModifierOffrePage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    contract_type: 'cdi',
    salary: '',
    application_deadline: '',
    description: '',
    skills: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchOffer()
    }
  }, [params.id])

  const fetchOffer = async () => {
    try {
      const res = await jobsAPI.getOne(parseInt(params.id as string))
      if (res.ok) {
        const data: JobOffer = await res.json()
        setFormData({
          title: data.title,
          company: data.company,
          location: data.location,
          contract_type: data.contract_type,
          salary: data.salary,
          application_deadline: data.application_deadline,
          description: data.description,
          skills: data.skills.join('\n')
        })
        if (data.image) {
          setImagePreview(data.image)
        }
      } else {
        toast.error('Offre non trouvée')
        router.push('/admin/offres')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement de l\'offre')
      router.push('/admin/offres')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image trop grande (max 2MB)')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Format non supporté (JPG, PNG, WebP uniquement)')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.company || !formData.location || !formData.application_deadline || !formData.description || !formData.skills) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (formData.description.length < 50) {
      toast.error('La description doit contenir au moins 50 caractères')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('company', formData.company)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('contract_type', formData.contract_type)
      formDataToSend.append('salary', formData.salary)
      formDataToSend.append('application_deadline', formData.application_deadline)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('status', 'published')

      const skillsArray = formData.skills.split('\n').filter(s => s.trim())
      skillsArray.forEach(skill => {
        formDataToSend.append('skills', skill.trim())
      })

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      const token = localStorage.getItem('authToken')
      const response = await fetch(`https://din-recruitment.onrender.com/api/jobs/joboffers/${params.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Offre modifiée avec succès !')
        router.push('/admin/offres')
      } else {
        console.error('Erreur API:', data)
        toast.error(data.message || Object.values(data).flat().join(', ') || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la modification')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0F5D8C' }}></div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />

      <HeroSection
        title="Modifier l'offre d'emploi"
        subtitle="Mettez à jour les informations de l'offre"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Offres', href: '/admin/offres' },
          { label: 'Modifier' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/offres')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux offres
        </Button>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload image */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image de l'offre (optionnel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('')
                          setImageFile(null)
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">Ajoutez une image pour votre offre</p>
                      <p className="text-sm text-gray-500">JPG, PNG, WebP - Max 2MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    Télécharger une image
                  </label>
                </div>
              </div>

              {/* Formulaire 2 colonnes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Titre du poste <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Développeur Full Stack"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Entreprise <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Nom de l'entreprise"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lieu <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Abidjan, Côte d'Ivoire"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type de contrat <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.contract_type}
                    onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="stage">Stage</option>
                    <option value="freelance">Freelance</option>
                    <option value="interim">Intérim</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Salaire (optionnel)
                  </label>
                  <Input
                    placeholder="Ex: 500 000 - 800 000 FCFA"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date limite de candidature <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description du poste <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 50 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Compétences et exigences <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Une compétence par ligne"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Une exigence par ligne</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/admin/offres')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#0F5D8C' }}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Upload, AlertCircle, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { applicationsAPI, jobsAPI } from '@/lib/api'
import { useUser } from '@/context/UserContext'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { toast } from 'react-toastify'
import type { JobOffer, Civility, ContractType } from '@/types'
import { CONTRACT_TYPE_LABELS, EDUCATION_LEVELS, EXPERIENCE_OPTIONS } from '@/types'

export default function PostulerPage() {
  const { user } = useUser()
  const router = useRouter()
  const params = useParams()
  const [offer, setOffer] = useState<JobOffer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    civility: 'monsieur' as Civility,
    first_name: user?.name?.split(' ')[0] || '',
    last_name: user?.name?.split(' ')[1] || '',
    // first_name: user?.first_name || '',
    // last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    country: 'Côte D\'Ivoire',
    address: '',
    contract_type_sought: 'cdi' as ContractType,
    experience: [] as string[],
    education_level: '',
    current_salary: '',
    expected_salary: ''
  })

  useEffect(() => {
    fetchOffer()
  }, [])

  const fetchOffer = async () => {
    try {
      const res = await jobsAPI.getOne(params.id as string)
      if (res.ok) {
        const data = await res.json()
        setOffer(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 5MB')
        return
      }
      setCvFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cvFile) {
      toast.error('Veuillez télécharger votre CV')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        ...formData,
        job: parseInt(params.id as string),
        is_spontaneous: false,
        current_salary: formData.current_salary ? parseInt(formData.current_salary) : 0,
        expected_salary: parseInt(formData.expected_salary)
      }

      const response = await applicationsAPI.create(payload)
      const data = await response.json()

      if (response.ok) {
        toast.success('Candidature envoyée avec succès !')
        router.push(`/candidat/offres/${params.id}/postuler/succes`)
      } else {
        toast.error(data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (!offer) {
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
        title={offer.title}
        subtitle={`${offer.company} • ${offer.location}`}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Offres', href: '/candidat/offres' },
          { label: offer.title }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
                    Postuler à cette offre
                  </h2>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Informations pré-remplies</p>
                      <p>Vos informations sont automatiquement utilisées. Vous pouvez les modifier ci-dessous.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Upload CV */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Télécharger votre CV <span className="text-red-500">*</span>
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload"
                      required
                    />
                    <label
                      htmlFor="cv-upload"
                      className="inline-block px-6 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      Choisir un fichier
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Formats acceptés: PDF, DOC, DOCX (max 5MB)
                    </p>
                    {cvFile && (
                      <p className="text-sm text-green-600 mt-2 font-medium">
                        ✓ {cvFile.name}
                      </p>
                    )}
                  </div>

                  {/* Informations personnelles */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-blue-600">👤</span> Informations personnelles
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Civilité</label>
                        <select
                          value={formData.civility}
                          onChange={(e) => setFormData({ ...formData, civility: e.target.value as Civility })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="monsieur">Monsieur</option>
                          <option value="madame">Madame</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Type de contrat recherché
                        </label>
                        <select
                          value={formData.contract_type_sought}
                          onChange={(e) => setFormData({ ...formData, contract_type_sought: e.target.value as ContractType })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Prénom</label>
                        <Input
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nom</label>
                        <Input
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Téléphone</label>
                        <Input
                          placeholder="+225 XX XX XX XX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Pays</label>
                        <Input
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Adresse</label>
                        <Input
                          placeholder="Votre adresse"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profil professionnel */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-blue-600">💼</span> Profil professionnel
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expérience</label>
                        <select
                          onChange={(e) => {
                            const val = e.target.value
                            setFormData({ 
                              ...formData, 
                              experience: val ? [val] : [] 
                            })
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="">Sélectionnez votre expérience</option>
                          {EXPERIENCE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Niveau d'études</label>
                        <select
                          value={formData.education_level}
                          onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="">Sélectionnez votre niveau</option>
                          {EDUCATION_LEVELS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Salaire actuel (optionnel)
                        </label>
                        <Input
                          type="number"
                          placeholder="Ex: 500 000 FCFA"
                          value={formData.current_salary}
                          onChange={(e) => setFormData({ ...formData, current_salary: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Prétention salariale <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          placeholder="Ex: 600 000 FCFA"
                          value={formData.expected_salary}
                          onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white py-6 text-lg"
                    style={{ backgroundColor: '#0F5D8C' }}
                  >
                    {isLoading ? 'Envoi...' : 'Envoyer ma candidature'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2" style={{ color: '#0F5D8C' }}>
                  {offer.title}
                </h3>
                <p className="text-center text-gray-600 mb-4">
                  {offer.company} • {offer.location}
                </p>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type de contrat:</span>
                    <span className="font-medium">{CONTRACT_TYPE_LABELS[offer.contract_type]}</span>
                  </div>
                  {offer.salary && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Salaire:</span>
                      <span className="font-medium text-green-600">{offer.salary}</span>
                    </div>
                  )}
                  {offer.application_deadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date limite:</span>
                      <span className="font-medium text-orange-600">
                        {new Date(offer.application_deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>

                {offer.skills && offer.skills.length > 0 && (
                  <div className="border-t mt-4 pt-4">
                    <p className="text-sm font-medium mb-2">Compétences requises:</p>
                    <div className="flex flex-wrap gap-2">
                      {offer.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { Search, FileText, Briefcase, Calendar, Download, Eye, Clock, CheckCircle, XCircle, AlertCircle, X, User, MapPin, Phone, Mail, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { applicationsAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { toast } from 'react-toastify'

interface Application {
  id: number
  candidate: number
  candidate_name: string
  job?: number
  job_title?: string
  is_spontaneous: boolean
  civility: string
  civility_display: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  address: string
  contract_type_sought: string
  contract_type_display: string
  experience: string[]
  education_level: string
  current_salary?: number
  expected_salary: number
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  status_display: string
  cv_file?: string
  created_at: string
  updated_at: string
}

export default function MesCandidaturesPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'spontaneous' | 'offers'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    let filtered = applications

    // Filtrer par type
    if (filterType === 'spontaneous') {
      filtered = filtered.filter(app => app.is_spontaneous)
    } else if (filterType === 'offers') {
      filtered = filtered.filter(app => !app.is_spontaneous)
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(app => {
        const searchLower = searchQuery.toLowerCase()
        const jobTitle = getJobTitle(app).toLowerCase()
        
        return (
          jobTitle.includes(searchLower) ||
          app.candidate_name?.toLowerCase().includes(searchLower) ||
          (app.is_spontaneous && 'spontanée'.includes(searchLower))
        )
      })
    }

    setFilteredApplications(filtered)
  }, [applications, filterType, searchQuery])

  const fetchApplications = async () => {
    try {
      const res = await applicationsAPI.getAll()
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
        setFilteredApplications(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des candidatures')
    } finally {
      setIsLoading(false)
    }
  }

  const getJobTitle = (application: Application) => {
    if (application.is_spontaneous) {
      return 'Candidature spontanée'
    }
    return application.job_title || 'Poste non spécifié'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />
      case 'reviewed':
        return <Eye className="w-5 h-5 text-blue-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', color: 'bg-orange-100 text-orange-800 border-orange-200' }
      case 'reviewed':
        return { label: 'Examinée', color: 'bg-blue-100 text-blue-800 border-blue-200' }
      case 'accepted':
        return { label: 'Acceptée', color: 'bg-green-100 text-green-800 border-green-200' }
      case 'rejected':
        return { label: 'Refusée', color: 'bg-red-100 text-red-800 border-red-200' }
      default:
        return { label: 'Inconnue', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div>
      <Navbar />
      
      <HeroSection
        title="Mes candidatures"
        subtitle="Suivez l'évolution de vos candidatures et consultez leur statut"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Espace candidat', href: '/candidat' },
          { label: 'Mes candidatures' }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filtres et recherche */}
        <div className="mb-8 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setFilterType('all')}
              variant={filterType === 'all' ? 'default' : 'outline'}
              className={filterType === 'all' ? 'text-white' : ''}
              style={filterType === 'all' ? { backgroundColor: '#0F5D8C' } : {}}
            >
              Toutes ({applications.length})
            </Button>
            <Button
              onClick={() => setFilterType('spontaneous')}
              variant={filterType === 'spontaneous' ? 'default' : 'outline'}
              className={filterType === 'spontaneous' ? 'text-white' : ''}
              style={filterType === 'spontaneous' ? { backgroundColor: '#0F5D8C' } : {}}
            >
              <FileText className="w-4 h-4 mr-2" />
              Spontanées ({applications.filter(a => a.is_spontaneous).length})
            </Button>
            <Button
              onClick={() => setFilterType('offers')}
              variant={filterType === 'offers' ? 'default' : 'outline'}
              className={filterType === 'offers' ? 'text-white' : ''}
              style={filterType === 'offers' ? { backgroundColor: '#0F5D8C' } : {}}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Offres ({applications.filter(a => !a.is_spontaneous).length})
            </Button>
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre de poste ou entreprise..."
              className="pl-12 py-6 text-base"
            />
          </div>
        </div>

        {/* Liste des candidatures */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#0F5D8C' }}></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {searchQuery ? 'Aucune candidature trouvée' : 'Aucune candidature pour le moment'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés'
                : 'Commencez à postuler aux offres qui vous intéressent'}
            </p>
            {!searchQuery && (
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = '/candidat/candidature-spontanee'}
                  className="text-white"
                  style={{ backgroundColor: '#0F5D8C' }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Candidature spontanée
                </Button>
                <Button
                  onClick={() => window.location.href = '/candidat/offres'}
                  variant="outline"
                  className="border-blue-600 text-blue-600"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Voir les offres
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusInfo = getStatusLabel(application.status)
              const jobTitle = getJobTitle(application)
              
              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div 
                            className="p-3 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: application.is_spontaneous ? '#FEF3C7' : '#DBEAFE' }}
                          >
                            {application.is_spontaneous ? (
                              <FileText className="w-6 h-6 text-orange-600" />
                            ) : (
                              <Briefcase className="w-6 h-6 text-blue-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold mb-1" style={{ color: '#0F5D8C' }}>
                                  {jobTitle}
                                </h3>
                                {!application.is_spontaneous && (
                                  <p className="text-sm text-gray-500">
                                    Candidature à une offre d'emploi
                                  </p>
                                )}
                              </div>

                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.color}`}>
                                {getStatusIcon(application.status)}
                                <span className="text-sm font-medium">{statusInfo.label}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Postulé le {formatDate(application.created_at)}</span>
                              </div>
                              {application.expected_salary && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Prétention:</span>
                                  <span>{application.expected_salary.toLocaleString()} FCFA</span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {application.cv_file && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-600 text-blue-600"
                                  onClick={() => {
                                    window.open(application.cv_file, '_blank')
                                  }}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Télécharger mon CV
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(application)
                                  setShowModal(true)
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Voir les détails
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {filteredApplications.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            {filteredApplications.length} candidature{filteredApplications.length > 1 ? 's' : ''} trouvée{filteredApplications.length > 1 ? 's' : ''}
          </div>
        )}

        {/* Info box */}
        {!isLoading && applications.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Comprendre les statuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span><strong>En attente:</strong> Votre candidature est enregistrée</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <span><strong>Examinée:</strong> En cours d'analyse par nos équipes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span><strong>Acceptée:</strong> Félicitations ! Nous vous contacterons</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span><strong>Refusée:</strong> Votre profil ne correspond pas actuellement</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal détails candidature */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
                Détails de la candidature
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Statut */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedApplication.is_spontaneous ? (
                    <FileText className="w-8 h-8 text-orange-600" />
                  ) : (
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
                      {getJobTitle(selectedApplication)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedApplication.is_spontaneous 
                        ? 'Candidature spontanée' 
                        : 'Candidature à une offre d\'emploi'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusLabel(selectedApplication.status).color}`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="font-medium">{getStatusLabel(selectedApplication.status).label}</span>
                </div>
              </div>

              {/* Informations personnelles */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#0F5D8C' }}>
                  <User className="w-5 h-5" />
                  Informations personnelles
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Civilité</p>
                    <p className="font-medium">{selectedApplication.civility_display}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium">{selectedApplication.first_name} {selectedApplication.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedApplication.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedApplication.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pays</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedApplication.country}
                    </p>
                  </div>
                  {selectedApplication.address && (
                    <div>
                      <p className="text-sm text-gray-600">Adresse</p>
                      <p className="font-medium">{selectedApplication.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations professionnelles */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#0F5D8C' }}>
                  <Briefcase className="w-5 h-5" />
                  Informations professionnelles
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Type de contrat recherché</p>
                    <p className="font-medium">{selectedApplication.contract_type_display}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Niveau d'études</p>
                    <p className="font-medium uppercase">{selectedApplication.education_level}</p>
                  </div>
                  {selectedApplication.experience && selectedApplication.experience.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Expérience</p>
                      <p className="font-medium">{selectedApplication.experience.join(', ')}</p>
                    </div>
                  )}
                  {selectedApplication.current_salary && (
                    <div>
                      <p className="text-sm text-gray-600">Salaire actuel</p>
                      <p className="font-medium flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {selectedApplication.current_salary.toLocaleString()} FCFA
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Prétention salariale</p>
                    <p className="font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {selectedApplication.expected_salary.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations candidature */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#0F5D8C' }}>
                  <Calendar className="w-5 h-5" />
                  Informations candidature
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de candidature:</span>
                    <span className="font-medium">{formatDate(selectedApplication.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {selectedApplication.is_spontaneous ? 'Candidature spontanée' : 'Réponse à une offre'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CV:</span>
                    {selectedApplication.cv_file ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedApplication.cv_file, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    ) : (
                      <span className="text-gray-400">Non disponible</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Fermer
                </Button>
                {selectedApplication.cv_file && (
                  <Button
                    onClick={() => window.open(selectedApplication.cv_file, '_blank')}
                    className="flex-1 text-white"
                    style={{ backgroundColor: '#0F5D8C' }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger mon CV
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}









// 'use client'

// import { useEffect, useState } from 'react'
// import { Search, FileText, Briefcase, Calendar, Download, Eye, Clock, CheckCircle, XCircle, AlertCircle, X, User, MapPin, Phone, Mail, DollarSign } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { applicationsAPI, jobsAPI } from '@/lib/api'
// import Navbar from '@/components/Navbar'
// import HeroSection from '@/components/HeroSection'
// import Footer from '@/components/Footer'
// import { toast } from 'react-toastify'

// interface JobOffer {
//   id: number
//   title: string
//   company: string
//   location: string
//   contract_type: string
//   description: string
// }

// interface Application {
//   id: number
//   civility: string
//   first_name: string
//   last_name: string
//   email: string
//   phone: string
//   country: string
//   address: string
//   job?: number | JobOffer
//   is_spontaneous: boolean
//   status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
//   cv_file?: string
//   created_at: string
//   expected_salary: number
//   current_salary?: number
//   contract_type_sought: string
//   education_level: string
//   experience: string[]
// }

// export default function MesCandidaturesPage() {
//   const [applications, setApplications] = useState<Application[]>([])
//   const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
//   const [searchQuery, setSearchQuery] = useState('')
//   const [filterType, setFilterType] = useState<'all' | 'spontaneous' | 'offers'>('all')
//   const [isLoading, setIsLoading] = useState(true)
//   const [jobs, setJobs] = useState<Record<number, JobOffer>>({})
//   const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
//   const [showModal, setShowModal] = useState(false)

//   useEffect(() => {
//     fetchApplications()
//   }, [])

//   useEffect(() => {
//     let filtered = applications

//     // Filtrer par type
//     if (filterType === 'spontaneous') {
//       filtered = filtered.filter(app => app.is_spontaneous)
//     } else if (filterType === 'offers') {
//       filtered = filtered.filter(app => !app.is_spontaneous)
//     }

//     // Filtrer par recherche
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(app => {
//         const searchLower = searchQuery.toLowerCase()
//         const jobTitle = getJobTitle(app).toLowerCase()
//         const jobDetails = getJobDetails(app)
        
//         return (
//           jobTitle.includes(searchLower) ||
//           jobDetails?.company.toLowerCase().includes(searchLower) ||
//           (app.is_spontaneous && 'spontanée'.includes(searchLower))
//         )
//       })
//     }

//     setFilteredApplications(filtered)
//   }, [applications, filterType, searchQuery])

//   const fetchApplications = async () => {
//     try {
//       const res = await applicationsAPI.getAll()
//       if (res.ok) {
//         const data = await res.json()
//         setApplications(data)
//         setFilteredApplications(data)
        
//         // Récupérer les détails des jobs
//         const jobIds = data
//           .filter((app: Application) => !app.is_spontaneous && typeof app.job === 'number')
//           .map((app: Application) => app.job as number)
        
//         if (jobIds.length > 0) {
//           fetchJobDetails(jobIds)
//         }
//       }
//     } catch (error) {
//       console.error('Erreur:', error)
//       toast.error('Erreur lors du chargement des candidatures')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchJobDetails = async (jobIds: number[]) => {
//     const uniqueIds = [...new Set(jobIds)]
//     const jobsData: Record<number, JobOffer> = {}
    
//     for (const id of uniqueIds) {
//       try {
//         const res = await jobsAPI.getOne(id)
//         if (res.ok) {
//           const job = await res.json()
//           jobsData[id] = job
//         }
//       } catch (error) {
//         console.error(`Erreur chargement job ${id}:`, error)
//       }
//     }
    
//     setJobs(jobsData)
//   }

//   const getJobTitle = (application: Application) => {
//     if (application.is_spontaneous) {
//       return 'Candidature spontanée'
//     }
    
//     const jobId = typeof application.job === 'number' ? application.job : application.job?.id
//     if (jobId && jobs[jobId]) {
//       return jobs[jobId].title
//     }
    
//     if (typeof application.job === 'object' && application.job?.title) {
//       return application.job.title
//     }
    
//     return 'Poste non spécifié'
//   }

//   const getJobDetails = (application: Application) => {
//     if (application.is_spontaneous) return null
    
//     const jobId = typeof application.job === 'number' ? application.job : application.job?.id
//     if (jobId && jobs[jobId]) {
//       return jobs[jobId]
//     }
    
//     if (typeof application.job === 'object') {
//       return application.job as JobOffer
//     }
    
//     return null
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="w-5 h-5 text-orange-500" />
//       case 'reviewed':
//         return <Eye className="w-5 h-5 text-blue-500" />
//       case 'accepted':
//         return <CheckCircle className="w-5 h-5 text-green-500" />
//       case 'rejected':
//         return <XCircle className="w-5 h-5 text-red-500" />
//       default:
//         return <AlertCircle className="w-5 h-5 text-gray-500" />
//     }
//   }

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return { label: 'En attente', color: 'bg-orange-100 text-orange-800 border-orange-200' }
//       case 'reviewed':
//         return { label: 'Examinée', color: 'bg-blue-100 text-blue-800 border-blue-200' }
//       case 'accepted':
//         return { label: 'Acceptée', color: 'bg-green-100 text-green-800 border-green-200' }
//       case 'rejected':
//         return { label: 'Refusée', color: 'bg-red-100 text-red-800 border-red-200' }
//       default:
//         return { label: 'Inconnue', color: 'bg-gray-100 text-gray-800 border-gray-200' }
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     })
//   }

//   return (
//     <div>
//       <Navbar />
      
//       <HeroSection
//         title="Mes candidatures"
//         subtitle="Suivez l'évolution de vos candidatures et consultez leur statut"
//         breadcrumbs={[
//           { label: 'Accueil', href: '/' },
//           { label: 'Espace candidat', href: '/candidat' },
//           { label: 'Mes candidatures' }
//         ]}
//       />

//       <div className="max-w-6xl mx-auto px-4 py-12">
//         {/* Filtres et recherche */}
//         <div className="mb-8 space-y-4">
//           {/* Tabs */}
//           <div className="flex gap-2 flex-wrap">
//             <Button
//               onClick={() => setFilterType('all')}
//               variant={filterType === 'all' ? 'default' : 'outline'}
//               className={filterType === 'all' ? 'text-white' : ''}
//               style={filterType === 'all' ? { backgroundColor: '#0F5D8C' } : {}}
//             >
//               Toutes ({applications.length})
//             </Button>
//             <Button
//               onClick={() => setFilterType('spontaneous')}
//               variant={filterType === 'spontaneous' ? 'default' : 'outline'}
//               className={filterType === 'spontaneous' ? 'text-white' : ''}
//               style={filterType === 'spontaneous' ? { backgroundColor: '#0F5D8C' } : {}}
//             >
//               <FileText className="w-4 h-4 mr-2" />
//               Spontanées ({applications.filter(a => a.is_spontaneous).length})
//             </Button>
//             <Button
//               onClick={() => setFilterType('offers')}
//               variant={filterType === 'offers' ? 'default' : 'outline'}
//               className={filterType === 'offers' ? 'text-white' : ''}
//               style={filterType === 'offers' ? { backgroundColor: '#0F5D8C' } : {}}
//             >
//               <Briefcase className="w-4 h-4 mr-2" />
//               Offres ({applications.filter(a => !a.is_spontaneous).length})
//             </Button>
//           </div>

//           {/* Recherche */}
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <Input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Rechercher par titre de poste ou entreprise..."
//               className="pl-12 py-6 text-base"
//             />
//           </div>
//         </div>

//         {/* Liste des candidatures */}
//         {isLoading ? (
//           <div className="text-center py-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#0F5D8C' }}></div>
//           </div>
//         ) : filteredApplications.length === 0 ? (
//           <div className="text-center py-16">
//             <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-500 mb-2">
//               {searchQuery ? 'Aucune candidature trouvée' : 'Aucune candidature pour le moment'}
//             </h3>
//             <p className="text-gray-400 mb-6">
//               {searchQuery 
//                 ? 'Essayez avec d\'autres mots-clés'
//                 : 'Commencez à postuler aux offres qui vous intéressent'}
//             </p>
//             {!searchQuery && (
//               <div className="flex gap-4 justify-center">
//                 <Button
//                   onClick={() => window.location.href = '/candidat/candidature-spontanee'}
//                   className="text-white"
//                   style={{ backgroundColor: '#0F5D8C' }}
//                 >
//                   <FileText className="w-4 h-4 mr-2" />
//                   Candidature spontanée
//                 </Button>
//                 <Button
//                   onClick={() => window.location.href = '/candidat/offres'}
//                   variant="outline"
//                   className="border-blue-600 text-blue-600"
//                 >
//                   <Briefcase className="w-4 h-4 mr-2" />
//                   Voir les offres
//                 </Button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredApplications.map((application) => {
//               const statusInfo = getStatusLabel(application.status)
//               const jobTitle = getJobTitle(application)
//               const jobDetails = getJobDetails(application)
              
//               return (
//                 <Card key={application.id} className="hover:shadow-md transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-start gap-4">
//                           <div 
//                             className="p-3 rounded-lg flex-shrink-0"
//                             style={{ backgroundColor: application.is_spontaneous ? '#FEF3C7' : '#DBEAFE' }}
//                           >
//                             {application.is_spontaneous ? (
//                               <FileText className="w-6 h-6 text-orange-600" />
//                             ) : (
//                               <Briefcase className="w-6 h-6 text-blue-600" />
//                             )}
//                           </div>

//                           <div className="flex-1">
//                             <div className="flex items-start justify-between mb-2">
//                               <div>
//                                 <h3 className="text-xl font-bold mb-1" style={{ color: '#0F5D8C' }}>
//                                   {jobTitle}
//                                 </h3>
//                                 {!application.is_spontaneous && jobDetails && (
//                                   <p className="text-gray-600">
//                                     {jobDetails.company} • {jobDetails.location}
//                                   </p>
//                                 )}
//                               </div>

//                               <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.color}`}>
//                                 {getStatusIcon(application.status)}
//                                 <span className="text-sm font-medium">{statusInfo.label}</span>
//                               </div>
//                             </div>

//                             <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
//                               <div className="flex items-center gap-1">
//                                 <Calendar className="w-4 h-4" />
//                                 <span>Postulé le {formatDate(application.created_at)}</span>
//                               </div>
//                               {application.expected_salary && (
//                                 <div className="flex items-center gap-1">
//                                   <span className="font-medium">Prétention:</span>
//                                   <span>{application.expected_salary.toLocaleString()} FCFA</span>
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex gap-2">
//                               {application.cv_file && (
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   className="border-blue-600 text-blue-600"
//                                   onClick={() => {
//                                     window.open(application.cv_file, '_blank')
//                                   }}
//                                 >
//                                   <Download className="w-4 h-4 mr-2" />
//                                   Télécharger mon CV
//                                 </Button>
//                               )}
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => {
//                                   setSelectedApplication(application)
//                                   setShowModal(true)
//                                 }}
//                               >
//                                 <Eye className="w-4 h-4 mr-2" />
//                                 Voir les détails
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>
//         )}

//         {filteredApplications.length > 0 && (
//           <div className="mt-8 text-center text-gray-600">
//             {filteredApplications.length} candidature{filteredApplications.length > 1 ? 's' : ''} trouvée{filteredApplications.length > 1 ? 's' : ''}
//           </div>
//         )}

//         {/* Info box */}
//         {!isLoading && applications.length > 0 && (
//           <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
//             <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
//               <AlertCircle className="w-5 h-5" />
//               Comprendre les statuts
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-orange-500" />
//                 <span><strong>En attente:</strong> Votre candidature est enregistrée</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Eye className="w-4 h-4 text-blue-500" />
//                 <span><strong>Examinée:</strong> En cours d'analyse par nos équipes</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-green-500" />
//                 <span><strong>Acceptée:</strong> Félicitations ! Nous vous contacterons</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <XCircle className="w-4 h-4 text-red-500" />
//                 <span><strong>Refusée:</strong> Votre profil ne correspond pas actuellement</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal détails candidature */}
//       {showModal && selectedApplication && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
//               <h2 className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
//                 Détails de la candidature
//               </h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Statut */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {selectedApplication.is_spontaneous ? (
//                     <FileText className="w-8 h-8 text-orange-600" />
//                   ) : (
//                     <Briefcase className="w-8 h-8 text-blue-600" />
//                   )}
//                   <div>
//                     <h3 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
//                       {getJobTitle(selectedApplication)}
//                     </h3>
//                     {!selectedApplication.is_spontaneous && (() => {
//                       const jobDetails = getJobDetails(selectedApplication)
//                       return jobDetails ? (
//                         <p className="text-gray-600">{jobDetails.company} • {jobDetails.location}</p>
//                       ) : null
//                     })()}
//                   </div>
//                 </div>
//                 <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusLabel(selectedApplication.status).color}`}>
//                   {getStatusIcon(selectedApplication.status)}
//                   <span className="font-medium">{getStatusLabel(selectedApplication.status).label}</span>
//                 </div>
//               </div>

//               {/* Description du poste (si offre) */}
//               {!selectedApplication.is_spontaneous && (() => {
//                 const jobDetails = getJobDetails(selectedApplication)
//                 return jobDetails?.description ? (
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <h4 className="font-bold text-blue-900 mb-2">Description du poste</h4>
//                     <p className="text-blue-800 text-sm">{jobDetails.description}</p>
//                   </div>
//                 ) : null
//               })()}

//               {/* Informations personnelles */}
//               <div>
//                 <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#0F5D8C' }}>
//                   <User className="w-5 h-5" />
//                   Informations personnelles
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
//                   <div>
//                     <p className="text-sm text-gray-600">Nom complet</p>
//                     <p className="font-medium">{selectedApplication.civility} {selectedApplication.first_name} {selectedApplication.last_name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Email</p>
//                     <p className="font-medium flex items-center gap-1">
//                       <Mail className="w-4 h-4" />
//                       {selectedApplication.email}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Téléphone</p>
//                     <p className="font-medium flex items-center gap-1">
//                       <Phone className="w-4 h-4" />
//                       {selectedApplication.phone}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Localisation</p>
//                     <p className="font-medium flex items-center gap-1">
//                       <MapPin className="w-4 h-4" />
//                       {selectedApplication.country}
//                     </p>
//                   </div>
//                   {selectedApplication.address && (
//                     <div className="col-span-2">
//                       <p className="text-sm text-gray-600">Adresse</p>
//                       <p className="font-medium">{selectedApplication.address}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Informations professionnelles */}
//               <div>
//                 <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#0F5D8C' }}>
//                   <Briefcase className="w-5 h-5" />
//                   Informations professionnelles
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
//                   <div>
//                     <p className="text-sm text-gray-600">Type de contrat recherché</p>
//                     <p className="font-medium uppercase">{selectedApplication.contract_type_sought}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Niveau d'études</p>
//                     <p className="font-medium">{selectedApplication.education_level}</p>
//                   </div>
//                   {selectedApplication.experience && selectedApplication.experience.length > 0 && (
//                     <div>
//                       <p className="text-sm text-gray-600">Expérience</p>
//                       <p className="font-medium">{selectedApplication.experience.join(', ')}</p>
//                     </div>
//                   )}
//                   {selectedApplication.current_salary && (
//                     <div>
//                       <p className="text-sm text-gray-600">Salaire actuel</p>
//                       <p className="font-medium flex items-center gap-1">
//                         <DollarSign className="w-4 h-4" />
//                         {selectedApplication.current_salary.toLocaleString()} FCFA
//                       </p>
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-sm text-gray-600">Prétention salariale</p>
//                     <p className="font-medium flex items-center gap-1">
//                       <DollarSign className="w-4 h-4" />
//                       {selectedApplication.expected_salary.toLocaleString()} FCFA
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Informations candidature */}
//               <div>
//                 <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#0F5D8C' }}>
//                   <Calendar className="w-5 h-5" />
//                   Informations candidature
//                 </h4>
//                 <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Date de candidature:</span>
//                     <span className="font-medium">{formatDate(selectedApplication.created_at)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Type:</span>
//                     <span className="font-medium">
//                       {selectedApplication.is_spontaneous ? 'Candidature spontanée' : 'Réponse à une offre'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">CV:</span>
//                     {selectedApplication.cv_file ? (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => window.open(selectedApplication.cv_file, '_blank')}
//                       >
//                         <Download className="w-4 h-4 mr-2" />
//                         Télécharger
//                       </Button>
//                     ) : (
//                       <span className="text-gray-400">Non disponible</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-3 pt-4 border-t">
//                 <Button
//                   onClick={() => setShowModal(false)}
//                   variant="outline"
//                   className="flex-1"
//                 >
//                   Fermer
//                 </Button>
//                 {selectedApplication.cv_file && (
//                   <Button
//                     onClick={() => window.open(selectedApplication.cv_file, '_blank')}
//                     className="flex-1 text-white"
//                     style={{ backgroundColor: '#0F5D8C' }}
//                   >
//                     <Download className="w-4 h-4 mr-2" />
//                     Télécharger mon CV
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   )
// }
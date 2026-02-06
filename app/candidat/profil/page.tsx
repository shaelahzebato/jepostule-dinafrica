'use client'

import { useState } from 'react'
import { FileText, User, Briefcase, Key, Save, Download, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useUser } from '@/context/UserContext'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { toast } from 'react-toastify'
import { EDUCATION_LEVELS, EXPERIENCE_OPTIONS, CONTRACT_TYPE_LABELS } from '@/types'

export default function ProfilPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('evaluation')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const tabs = [
    { id: 'evaluation', label: 'Dossier d\'auto-évaluation', icon: FileText },
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'professional', label: 'Informations professionnelles', icon: Briefcase },
    { id: 'security', label: 'Sécurité', icon: Key }
  ]

  return (
    <div>
      <Navbar />
      
      <HeroSection
        title="Mon profil"
        subtitle="Gérez vos informations personnelles et votre dossier candidat."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Espace candidat' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2" style={{ color: '#0F5D8C' }}>
                  Mon compte
                </h3>
                <div className="text-center mb-6">
                  <p className="font-medium text-gray-900">Candidat</p>
                  <p className="text-sm text-blue-600">candidat@exemple.com</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Auto-évaluation complétée</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Gardez vos informations à jour pour faciliter le processus de recrutement et la communication.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-600 text-blue-600"
                  >
                    Retour au tableau de bord
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {/* Tabs */}
                <div className="border-b">
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-600 text-blue-600'
                              : 'border-transparent text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="p-8">
                  {/* Dossier auto-évaluation */}
                  {activeTab === 'evaluation' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F5D8C' }}>
                        Dossier d'auto-évaluation
                      </h2>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-bold text-green-900 mb-2">Évaluation complétée</h3>
                            <p className="text-sm text-green-800 mb-3">
                              Complétée le 4 février 2026
                            </p>
                            <p className="text-sm text-gray-700 mb-4">
                              Le dossier d'auto-évaluation vous permet de présenter votre profil professionnel de manière détaillée.
                              Il couvre 3 thèmes principaux :
                            </p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="bg-white rounded p-2 text-center">
                                <span className="text-blue-600">●</span>
                                <p className="text-xs mt-1">Adéquation au poste</p>
                              </div>
                              <div className="bg-white rounded p-2 text-center">
                                <span className="text-blue-600">●</span>
                                <p className="text-xs mt-1">Travail en équipe</p>
                              </div>
                              <div className="bg-white rounded p-2 text-center">
                                <span className="text-blue-600">●</span>
                                <p className="text-xs mt-1">Culture d'entreprise</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-600 text-green-600"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger mon dossier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-600 text-blue-600"
                              >
                                Voir/Modifier
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-bold text-gray-900 mb-4">Résumé de votre évaluation</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Poste visé :</span>
                            <span className="font-medium">Dev</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Statut :</span>
                            <span className="text-green-600 font-medium">✓ Complète</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informations personnelles */}
                  {activeTab === 'personal' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F5D8C' }}>
                        Informations personnelles
                      </h2>
                      <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Prénom</label>
                            <Input defaultValue="Candidat" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Nom</label>
                            <Input defaultValue="candidat" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input type="email" defaultValue="candidat@exemple.com" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Téléphone</label>
                            <Input placeholder="+225 XX XX XX XX" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Pays</label>
                            <Input defaultValue="Côte D'Ivoire" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Adresse complète</label>
                            <Input placeholder="Votre adresse complète" />
                          </div>
                        </div>

                        <Button className="text-white" style={{ backgroundColor: '#0F5D8C' }}>
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer les modifications
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* Informations professionnelles */}
                  {activeTab === 'professional' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F5D8C' }}>
                        Informations professionnelles
                      </h2>
                      <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Expérience</label>
                            <select className="w-full border rounded-lg px-3 py-2">
                              <option>Sélectionnez votre expérience</option>
                              {EXPERIENCE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Niveau d'études</label>
                            <select className="w-full border rounded-lg px-3 py-2">
                              <option>Sélectionnez votre niveau</option>
                              {EDUCATION_LEVELS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Type de contrat recherché</label>
                          <select className="w-full border rounded-lg px-3 py-2">
                            {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Compétences principales (séparées par des virgules)
                          </label>
                          <Input placeholder="Ex: React, TypeScript, JavaScript, CSS, HTML..." />
                          <p className="text-xs text-gray-500 mt-1">
                            Listez vos compétences techniques et professionnelles principales
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Mettre à jour votre CV
                          </label>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="cv-upload" />
                            <label htmlFor="cv-upload" className="cursor-pointer">
                              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Cliquez pour télécharger votre CV</p>
                              <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX (max 5MB)</p>
                            </label>
                            <p className="text-sm text-blue-600 mt-2">
                              CV actuel: Candidat_candidat_cv.pdf
                            </p>
                          </div>
                        </div>

                        <Button className="text-white" style={{ backgroundColor: '#0F5D8C' }}>
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer les modifications
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* Sécurité */}
                  {activeTab === 'security' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F5D8C' }}>
                        Sécurité
                      </h2>
                      <div className="bg-gray-50 border rounded-lg p-6">
                        <h3 className="font-bold text-gray-900 mb-2">Modifier le mot de passe</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Vous pouvez modifier votre mot de passe pour sécuriser votre compte.
                          Il est recommandé d'utiliser un mot de passe fort et de le changer régulièrement.
                        </p>
                        <Button
                          onClick={() => setShowPasswordModal(true)}
                          variant="outline"
                        >
                          Modifier le mot de passe
                        </Button>
                      </div>

                      {showPasswordModal && (
                        <div className="mt-6 border rounded-lg p-6">
                          <form className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
                              <Input type="password" placeholder="••••••••" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
                              <Input type="password" placeholder="••••••••" />
                              <p className="text-xs text-gray-500 mt-1">
                                Minimum 6 caractères, idéalement avec des chiffres et des caractères spéciaux
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Confirmer le nouveau mot de passe</label>
                              <Input type="password" placeholder="••••••••" />
                            </div>
                            <div className="flex gap-2">
                              <Button className="text-white" style={{ backgroundColor: '#0F5D8C' }}>
                                Mettre à jour le mot de passe
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPasswordModal(false)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Briefcase, Key, Building, ArrowLeft, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@/context/UserContext'
import { accountsAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function AdminProfilPage() {
  const { user } = useUser()
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    address: ''
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        country: (user as any).country || '',
        address: (user as any).address || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!user?.id) return

      const res = await accountsAPI.update(user.id, formData)
      const data = await res.json()

      if (res.ok) {
        toast.success('Profil mis à jour avec succès !')
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordData.new_password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      // TODO: Appel API changement de mot de passe
      toast.success('Mot de passe modifié avec succès !')
      setShowPasswordModal(false)
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue')
    }
  }

  if (!user) {
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
        title="Mon profil"
        subtitle="Gérez vos informations personnelles et votre dossier candidat."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Administration', href: '/admin' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0F5D8C' }}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
                    Informations personnelles
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prénom</label>
                      <Input
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom</label>
                      <Input
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2 mt-6" style={{ color: '#0F5D8C' }}>
                      <Mail className="w-5 h-5" />
                      Informations de contact
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+225 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2 mt-6" style={{ color: '#0F5D8C' }}>
                      <MapPin className="w-5 h-5" />
                      Localisation
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pays</label>
                      <Input
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Côte D'Ivoire"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Adresse complète</label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Votre adresse complète"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2 mt-6" style={{ color: '#0F5D8C' }}>
                      <Briefcase className="w-5 h-5" />
                      Informations professionnelles
                    </h4>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white mt-6"
                    style={{ backgroundColor: '#0F5D8C' }}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#0F5D8C' }}>
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
                    Sécurité
                  </h3>
                </div>

                <p className="text-gray-600 mb-4">
                  Vous pouvez modifier votre mot de passe pour sécuriser votre compte. 
                  Il est recommandé d'utiliser un mot de passe fort et de le changer régulièrement.
                </p>

                <Button
                  variant="outline"
                  onClick={() => setShowPasswordModal(true)}
                  className="border-blue-600 text-blue-600"
                >
                  Modifier le mot de passe
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#0F5D8C' }}
                >
                  <Building className="w-12 h-12 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2" style={{ color: '#0F5D8C' }}>
                  Mon compte
                </h3>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="font-bold mb-1">Administrateur</p>
                  <p className="text-sm text-blue-600">{user.email}</p>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Gardez vos informations à jour pour faciliter le processus de recrutement et la communication.
                </p>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/admin')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au tableau de bord
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal changement mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
                Modifier le mot de passe
              </h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mot de passe actuel
                </label>
                <Input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 caractères, idéalement avec des chiffres et des caractères spéciaux
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirmez le nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordData({
                      current_password: '',
                      new_password: '',
                      confirm_password: ''
                    })
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#0F5D8C' }}
                >
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}





// 'use client'

// import { useState, useEffect } from 'react'
// import { User, Mail, Phone, MapPin, Briefcase, Key, Building, ArrowLeft, X } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { useUser } from '@/context/UserContext'
// import { accountsAPI } from '@/lib/api'
// import Navbar from '@/components/Navbar'
// import HeroSection from '@/components/HeroSection'
// import Footer from '@/components/Footer'
// import { toast } from 'react-toastify'
// import { useRouter } from 'next/navigation'

// export default function AdminProfilPage() {
//   const { user } = useUser()
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     country: '',
//     address: ''
//   })
//   const [showPasswordModal, setShowPasswordModal] = useState(false)
//   const [passwordData, setPasswordData] = useState({
//     current_password: '',
//     new_password: '',
//     confirm_password: ''
//   })
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         first_name: user.name|| '',
//         last_name: user.name || '',
//         email: user.email || '',
//         phone: user?.phone || '',
//         country: user.country || '',
//         address: user.address || ''
//       })
//     }
//   }, [user])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       if (!user?.id) return

//       const res = await accountsAPI.update(user.id, formData)
//       const data = await res.json()

//       if (res.ok) {
//         toast.success('Profil mis à jour avec succès !')
//       } else {
//         toast.error(data.message || 'Une erreur est survenue')
//       }
//     } catch (error) {
//       console.error('Erreur:', error)
//       toast.error('Une erreur est survenue')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (passwordData.new_password !== passwordData.confirm_password) {
//       toast.error('Les mots de passe ne correspondent pas')
//       return
//     }

//     if (passwordData.new_password.length < 6) {
//       toast.error('Le mot de passe doit contenir au moins 6 caractères')
//       return
//     }

//     try {
//       // TODO: Appel API changement de mot de passe
//       toast.success('Mot de passe modifié avec succès !')
//       setShowPasswordModal(false)
//       setPasswordData({
//         current_password: '',
//         new_password: '',
//         confirm_password: ''
//       })
//     } catch (error) {
//       console.error('Erreur:', error)
//       toast.error('Une erreur est survenue')
//     }
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0F5D8C' }}></div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <Navbar />

//       <HeroSection
//         title="Mon profil"
//         subtitle="Gérez vos informations personnelles et votre dossier candidat."
//         breadcrumbs={[
//           { label: 'Accueil', href: '/' },
//           { label: 'Administration', href: '/admin' }
//         ]}
//       />

//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Formulaire principal */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Informations personnelles */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-3 rounded-lg" style={{ backgroundColor: '#0F5D8C' }}>
//                     <User className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
//                     Informations personnelles
//                   </h3>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Prénom</label>
//                       <Input
//                         value={formData.first_name}
//                         onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
//                         placeholder="Votre prénom"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Nom</label>
//                       <Input
//                         value={formData.last_name}
//                         onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
//                         placeholder="Votre nom"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-bold mb-3 flex items-center gap-2 mt-6" style={{ color: '#0F5D8C' }}>
//                       <Mail className="w-5 h-5" />
//                       Informations de contact
//                     </h4>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Email</label>
//                       <Input
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         placeholder="votre@email.com"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Téléphone</label>
//                       <Input
//                         value={formData.phone}
//                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                         placeholder="+225 XX XX XX XX"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-bold mb-3 flex items-center gap-2 mt-6" style={{ color: '#0F5D8C' }}>
//                       <MapPin className="w-5 h-5" />
//                       Localisation
//                     </h4>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Pays</label>
//                       <Input
//                         value={formData.country}
//                         onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//                         placeholder="Côte D'Ivoire"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Adresse complète</label>
//                       <Input
//                         value={formData.address}
//                         onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                         placeholder="Votre adresse complète"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-bold mb-3 flex items-center gap-2 mt-6" style={{ color: '#0F5D8C' }}>
//                       <Briefcase className="w-5 h-5" />
//                       Informations professionnelles
//                     </h4>
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full text-white mt-6"
//                     style={{ backgroundColor: '#0F5D8C' }}
//                   >
//                     <Building className="w-4 h-4 mr-2" />
//                     Enregistrer les modifications
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Sécurité */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-3 rounded-lg" style={{ backgroundColor: '#0F5D8C' }}>
//                     <Key className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
//                     Sécurité
//                   </h3>
//                 </div>

//                 <p className="text-gray-600 mb-4">
//                   Vous pouvez modifier votre mot de passe pour sécuriser votre compte. 
//                   Il est recommandé d'utiliser un mot de passe fort et de le changer régulièrement.
//                 </p>

//                 <Button
//                   variant="outline"
//                   onClick={() => setShowPasswordModal(true)}
//                   className="border-blue-600 text-blue-600"
//                 >
//                   Modifier le mot de passe
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <Card>
//               <CardContent className="p-6 text-center">
//                 <div 
//                   className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
//                   style={{ backgroundColor: '#0F5D8C' }}
//                 >
//                   <Building className="w-12 h-12 text-white" />
//                 </div>

//                 <h3 className="text-xl font-bold mb-2" style={{ color: '#0F5D8C' }}>
//                   Mon compte
//                 </h3>

//                 <div className="bg-blue-50 rounded-lg p-4 mb-4">
//                   <p className="font-bold mb-1">Administrateur</p>
//                   <p className="text-sm text-blue-600">{user.email}</p>
//                 </div>

//                 <p className="text-sm text-gray-600 mb-4">
//                   Gardez vos informations à jour pour faciliter le processus de recrutement et la communication.
//                 </p>

//                 <Button
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => router.push('/admin')}
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Retour au tableau de bord
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Modal changement mot de passe */}
//       {showPasswordModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full">
//             <div className="border-b p-6 flex items-center justify-between">
//               <h2 className="text-xl font-bold" style={{ color: '#0F5D8C' }}>
//                 Modifier le mot de passe
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowPasswordModal(false)
//                   setPasswordData({
//                     current_password: '',
//                     new_password: '',
//                     confirm_password: ''
//                   })
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Mot de passe actuel
//                 </label>
//                 <Input
//                   type="password"
//                   value={passwordData.current_password}
//                   onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Nouveau mot de passe
//                 </label>
//                 <Input
//                   type="password"
//                   value={passwordData.new_password}
//                   onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
//                   placeholder="••••••••"
//                   required
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Minimum 6 caractères, idéalement avec des chiffres et des caractères spéciaux
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Confirmez le nouveau mot de passe
//                 </label>
//                 <Input
//                   type="password"
//                   value={passwordData.confirm_password}
//                   onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => {
//                     setShowPasswordModal(false)
//                     setPasswordData({
//                       current_password: '',
//                       new_password: '',
//                       confirm_password: ''
//                     })
//                   }}
//                 >
//                   Annuler
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="flex-1 text-white"
//                   style={{ backgroundColor: '#0F5D8C' }}
//                 >
//                   Mettre à jour le mot de passe
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   )
// }
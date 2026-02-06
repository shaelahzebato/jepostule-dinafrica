'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, User, UserPlus, Menu, ChevronDown, LogOut, Settings, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/UserContext'

export default function Navbar() {
  const { user, logout } = useUser()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name[0].toUpperCase()
  }

  const getRoleLabel = (role?: string) => {
    if (role === 'admin') return 'Administrateur'
    if (role === 'candidat') return 'Candidat'
    return 'Utilisateur'
  }

  return (
    <nav className="shadow-lg px-6 py-4 md:px-8 bg-white border-b border-gray-100">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
          <img alt="Logo DIN" width={200} height={200} className="h-20 w-auto" src="/images/logo-din.png" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="https://din-africa.net/v3/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium border border-transparent hover:border-green-200"
            >
              <span>Retour au site web</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {user ? (
            <>
              {/* ADMIN : Bouton "Publier une offre" */}
              {user.role === 'admin' ? (
                <Button 
                  onClick={() => router.push('/admin/offres/nouvelle')}
                  className="bg-[#79B749] hover:bg-green-600 text-white flex items-center gap-2 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  Publier une offre
                </Button>
              ) : (
                /* CANDIDAT : Bouton "Postuler" */
                <Button 
                  onClick={() => router.push('/candidat/candidature-spontanee')}
                  className="bg-[#79B749] hover:bg-green-600 text-white flex items-center gap-2 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4" />
                  Postuler
                </Button>
              )}

              {/* User Menu */}
              <div className="flex items-center gap-4 relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 font-medium">{getInitials(user.name)}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-800 text-sm font-medium">{user.name}</div>
                    <div className="text-gray-500 text-xs capitalize">{getRoleLabel(user.role)}</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {user.role === 'admin' ? (
                      /* MENU ADMIN */
                      <>
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                          <span>Accueil</span>
                        </Link>
                        <Link href="/admin/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <span>Tableau de bord</span>
                        </Link>
                        <Link href="/admin/offres" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                          <span>Gérer les offres</span>
                        </Link>
                        <Link href="/admin/profil" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="w-5 h-5" />
                          <span>Mon profil</span>
                        </Link>
                      </>
                    ) : (
                      /* MENU CANDIDAT */
                      <>
                        <Link href="/candidat" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                          <span>Accueil</span>
                        </Link>
                        <Link href="/candidat/candidature-spontanee" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span>Candidature spontanée</span>
                        </Link>
                        <Link href="/candidat/offres" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Search className="w-5 h-5" />
                          <span>Offres d&apos;emploi</span>
                        </Link>
                        <Link href="/candidat/auto-evaluation" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span>Auto-évaluation</span>
                        </Link>
                        <Link href="/candidat/profil" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="w-5 h-5" />
                          <span>Mon profil</span>
                        </Link>
                      </>
                    )}
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/signin">
                <Button className="bg-[#79B749] hover:bg-green-600 text-white flex items-center gap-2 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  <User className="w-4 h-4" />
                  Se connecter
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="border-[#79B749] text-[#79B749] hover:bg-[#79B749] hover:text-white flex items-center gap-2 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border bg-white">
                  <UserPlus className="w-4 h-4" />
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Menu className="w-7 h-7" />
        </Button>
      </div>
    </nav>
  )
}


// 'use client'

// import Link from 'next/link'
// import { useState, useRef, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { ExternalLink, User, UserPlus, Menu, ChevronDown, LogOut, Settings, Search } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { useUser } from '@/context/UserContext'

// export default function Navbar() {
//   const { user, logout } = useUser()
//   const router = useRouter()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const menuRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsMenuOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleLogout = () => {
//     logout()
//     setIsMenuOpen(false)
//   }

//   const getInitials = (name?: string) => {
//     if (!name) return 'U'
//     const parts = name.trim().split(' ')
//     if (parts.length >= 2) {
//       return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
//     }
//     return name[0].toUpperCase()
//   }

//   const getRoleLabel = (role?: string) => {
//     if (role === 'admin') return 'Administrateur'
//     if (role === 'candidat') return 'Candidat'
//     return 'Utilisateur'
//   }

//   return (
//     <nav className="shadow-lg px-6 py-4 md:px-8 bg-white border-b border-gray-100">
//       <div className="flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
//           <img 
//             alt="Logo DIN" 
//             width={200} 
//             height={200} 
//             className="h-20 w-auto" 
//             src="/images/logo-din.png"
//           />
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-3">
//           {/* Retour au site web */}
//           <div className="hidden md:flex items-center gap-4">
//             <Link
//               href="https://din-africa.net/v3/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium border border-transparent hover:border-green-200"
//             >
//               <span>Retour au site web</span>
//               <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//             </Link>
//           </div>

//           {/* Si l'utilisateur est connecté */}
//           {user ? (
//             <>
//               {/* Bouton Postuler */}
//               <Button 
//                 onClick={() => router.push('/candidature-spontanee')}
//                 className="bg-[#79B749] hover:bg-green-600 text-white flex items-center gap-2 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer text-sm font-medium"
//               >
//                 <Search className="w-4 h-4" />
//                 Postuler
//               </Button>

//               {/* User Menu */}
//               <div className="flex items-center gap-4 relative" ref={menuRef}>
//                 <button 
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                     <span className="text-green-800 font-medium">
//                       {getInitials(user.name)}
//                     </span>
//                   </div>
//                   <div className="text-left">
//                     <div className="text-gray-800 text-sm font-medium">
//                       {user.name}
//                     </div>
//                     <div className="text-gray-500 text-xs capitalize">
//                       {getRoleLabel(user.role)}
//                     </div>
//                   </div>
//                   <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isMenuOpen && (
//                   <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
//                     {user.role === 'admin' ? (
//                       // MENU ADMIN
//                       <>
//                         <Link 
//                           href="/admin"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                             <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//                             <polyline points="9 22 9 12 15 12 15 22"></polyline>
//                           </svg>
//                           <span>Accueil</span>
//                         </Link>
                        
//                         <Link 
//                           href="/tableau-de-bord"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
//                             <circle cx="9" cy="7" r="4"></circle>
//                             <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
//                             <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//                           </svg>
//                           <span>Tableau de bord</span>
//                         </Link>
                        
//                         <Link 
//                           href="/admin/offres"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                             <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
//                             <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
//                           </svg>
//                           <span>Gérer les offres</span>
//                         </Link>
                        
//                         <Link 
//                           href="/profil"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <Settings className="w-5 h-5" />
//                           <span>Mon profil</span>
//                         </Link>
//                       </>
//                     ) : (
//                       // MENU CANDIDAT
//                       <>
//                         <Link 
//                           href="/"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                             <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//                             <polyline points="9 22 9 12 15 12 15 22"></polyline>
//                           </svg>
//                           <span>Accueil</span>
//                         </Link>
                        
//                         <Link 
//                           href="/candidature-spontanee"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                             <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
//                             <polyline points="14 2 14 8 20 8"></polyline>
//                           </svg>
//                           <span>Candidature spontanée</span>
//                         </Link>
                        
//                         <Link 
//                           href="/"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <Search className="w-5 h-5" />
//                           <span>Offres d&apos;emploi</span>
//                         </Link>
                        
//                         <Link 
//                           href="/auto-evaluation"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                             <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
//                             <polyline points="14 2 14 8 20 8"></polyline>
//                           </svg>
//                           <span>Auto-évaluation</span>
//                         </Link>
                        
//                         <Link 
//                           href="/profil"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <Settings className="w-5 h-5" />
//                           <span>Mon profil</span>
//                         </Link>
//                       </>
//                     )}
                    
//                     {/* Déconnexion */}
//                     <div className="border-t border-gray-200 my-2"></div>
//                     <button 
//                       onClick={handleLogout}
//                       className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
//                     >
//                       <LogOut className="w-5 h-5" />
//                       <span>Déconnexion</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             /* Si l'utilisateur n'est PAS connecté */
//             <div className="flex gap-3">
//               <Link href="/signin">
//                 <Button 
//                   className="bg-[#79B749] hover:bg-green-600 text-white flex items-center gap-2 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer text-sm font-medium"
//                 >
//                   <User className="w-4 h-4" />
//                   Se connecter
//                 </Button>
//               </Link>

//               <Link href="/signup">
//                 <Button 
//                   variant="outline"
//                   className="border-[#79B749] text-[#79B749] hover:bg-[#79B749] hover:text-white flex items-center gap-2 rounded-full px-6 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer text-sm font-medium border bg-white"
//                 >
//                   <UserPlus className="w-4 h-4" />
//                   S&apos;inscrire
//                 </Button>
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <Button variant="ghost" size="icon" className="md:hidden text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//           <Menu className="w-7 h-7" />
//         </Button>
//       </div>
//     </nav>
//   )
// }





// 'use client'

// import Link from 'next/link'
// import { ExternalLink, User, UserPlus, Menu } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// export default function Navbar() {
//   return (
//     <nav className="shadow-lg px-6 py-4 md:px-8 bg-white border-b border-gray-100">
//       <div className="flex justify-between items-center">
//         <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
//           <img 
//             alt="Logo DIN" 
//             width={200} 
//             height={200} 
//             className="h-20 w-auto" 
//             src="/images/logo-din.png"
//           />
//         </Link>

//         <div className="hidden md:flex items-center gap-3">
//           <div className="hidden md:flex items-center gap-4">
//             <Link
//               href="https://din-africa.net/v3/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium border border-transparent hover:border-green-200"
//             >
//               <span>Retour au site web</span>
//               <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//             </Link>
//           </div>

//           <div className="flex gap-3">
//             <Link href="/signin">
//               <Button 
//                 className="bg-[#79B749] hover:bg-green-600 text-white rounded-full px-6 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//               >
//                 <User className="w-4 h-4 mr-2" />
//                 Se connecter
//               </Button>
//             </Link>

//             <Link href="/signup">
//               <Button 
//                 variant="outline"
//                 className="border-[#79B749] text-[#79B749] hover:bg-[#79B749] hover:text-white rounded-full px-6 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//               >
//                 <UserPlus className="w-4 h-4 mr-2" />
//                 S&apos;inscrire
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="w-7 h-7" />
//         </Button>
//       </div>
//     </nav>
//   )
// }
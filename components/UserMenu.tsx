'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { Home, FileText, Briefcase, User, LogOut, ClipboardCheck, Settings } from 'lucide-react'
import Link from 'next/link'

export default function UserMenu() {
  const { user, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  if (!user) return null

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const isAdmin = user.role === 'admin'
  const avatarColor = isAdmin ? 'bg-purple-600' : 'bg-green-500'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold`}>
          {user.name?.charAt(0)?.toUpperCase() || (isAdmin ? 'A' : 'C')}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          {isAdmin ? (
            <>
              <Link 
                href="/admin" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link 
                href="/admin/offres" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Briefcase className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Gérer les offres</span>
              </Link>
              <Link 
                href="/profil" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Mon profil</span>
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/candidat" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Accueil</span>
              </Link>
              <Link 
                href="/offres" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Briefcase className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Offres d'emploi</span>
              </Link>
              <Link 
                href="/candidature-spontanee" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Candidature spontanée</span>
              </Link>
              <Link 
                href="/auto-evaluation" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ClipboardCheck className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Auto-évaluation</span>
              </Link>
              <Link 
                href="/profil" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Mon profil</span>
              </Link>
            </>
          )}
          
          <button 
            onClick={logout} 
            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-600 border-t transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      )}
    </div>
  )
}







// 'use client'

// import { useState } from 'react'
// import { useUser } from '@/context/UserContext'
// import { Home, FileText, Briefcase, User, LogOut, ClipboardCheck, Settings } from 'lucide-react'
// import Link from 'next/link'

// export default function UserMenu() {
//   const { user, logout } = useUser()
//   const [isOpen, setIsOpen] = useState(false)

//   if (!user) return null

//   const isAdmin = user.role === 'admin'
//   const avatarColor = isAdmin ? 'bg-purple-600' : 'bg-green-500'

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         onBlur={() => setTimeout(() => setIsOpen(false), 200)}
//         className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//       >
//         <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold`}>
//           {user.name?.charAt(0)?.toUpperCase() || (isAdmin ? 'A' : 'C')}
//         </div>
//         <div className="text-left hidden sm:block">
//           <p className="text-sm font-semibold text-gray-800">{user.name}</p>
//           <p className="text-xs text-gray-500 capitalize">{user.role}</p>
//         </div>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
//           {isAdmin ? (
//             <>
//               <Link 
//                 href="/admin" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <Home className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Dashboard</span>
//               </Link>
//               <Link 
//                 href="/admin/offres" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <Briefcase className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Gérer les offres</span>
//               </Link>
//               <Link 
//                 href="/profil" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <User className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Mon profil</span>
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link 
//                 href="/candidat" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <Home className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Accueil</span>
//               </Link>
//               <Link 
//                 href="/offres" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <Briefcase className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Offres d'emploi</span>
//               </Link>
//               <Link 
//                 href="/candidature-spontanee" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FileText className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Candidature spontanée</span>
//               </Link>
//               <Link 
//                 href="/auto-evaluation" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <ClipboardCheck className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Auto-évaluation</span>
//               </Link>
//               <Link 
//                 href="/profil" 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <User className="w-5 h-5 text-gray-600" />
//                 <span className="font-medium">Mon profil</span>
//               </Link>
//             </>
//           )}
          
//           <button 
//             onClick={logout} 
//             className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-red-600 border-t transition-colors"
//           >
//             <LogOut className="w-5 h-5" />
//             <span className="font-medium">Déconnexion</span>
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }
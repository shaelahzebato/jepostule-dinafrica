'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User as UserIcon, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { authAPI } from '@/lib/api'
import type { User } from '@/context/UserContext'
import Link from 'next/link'

const signupSchema = z.object({
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Le téléphone doit contenir au moins 8 chiffres'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignUpPage() {
  const { user, setUser } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      router.replace(user.role === 'admin' ? '/admin' : '/candidat')
    }
  }, [user, router])

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)

    try {
      const payload = {
        first_name: data.prenom,
        last_name: data.nom,
        email: data.email.toLowerCase().trim(),
        phone: data.telephone,
        password: data.password,
        password_confirm: data.confirmPassword,
      }

      const res = await authAPI.register(payload)
      const result = await res.json()

      console.log('📦 Réponse API register:', result); // DEBUG

      if (!res.ok) {
        toast.error(result?.message || "Erreur lors de l'inscription")
        return
      }

      // ✅ SAUVEGARDER LE TOKEN EN PREMIER
    //   if (result.token) {
    //     localStorage.setItem('authToken', result.token)
    //     console.log('✅ Token sauvegardé:', result.token.substring(0, 20) + '...'); // DEBUG
    //   } else {
    //     console.warn('⚠️ Aucun token reçu du backend'); // DEBUG
    //   }

    // ✅ BON
if (result.access) {
  localStorage.setItem('authToken', result.access)
  console.log('✅ Token sauvegardé:', result.access.substring(0, 20) + '...');
} else {
  console.warn('⚠️ Aucun token reçu du backend');
}

      const newUser: User = {
        id: result.account.id,
        name: `${result.account.first_name} ${result.account.last_name}`,
        email: result.account.email,
        role: 'candidat',
      }

      setUser(newUser)
      toast.success(`Inscription réussie ! Bienvenue ${newUser.name}`)
      router.replace('/candidat')
    } catch (error) {
      console.error(error)
      toast.error('Une erreur réseau est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(form.watch('password') || '')

  if (user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      {/* Bannière bleue */}
      <div className="absolute top-0 left-0 right-0 h-64" style={{ backgroundColor: '#0F5D8C' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/40"></div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-8 sm:h-12 fill-gray-50">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center space-x-2 text-blue-100 text-sm mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span className="text-blue-200">›</span>
          <span className="text-white">Inscription</span>
        </nav>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center" style={{ backgroundColor: '#0F5D8C' }}>
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold" style={{ color: '#0F5D8C' }}>
              Inscription
            </h2>
            <p className="text-gray-600 mt-2">Créez votre compte candidat</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <Input {...form.register('prenom')} placeholder="Votre prénom" />
                {form.formState.errors.prenom && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.prenom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input {...form.register('nom')} placeholder="Votre nom" />
                {form.formState.errors.nom && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.nom.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input type="email" {...form.register('email')} placeholder="votre@email.com" />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <Input type="tel" {...form.register('telephone')} placeholder="+225 XX XX XX XX" />
              {form.formState.errors.telephone && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.telephone.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register('password')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Indicateur de force */}
              {form.watch('password') && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 w-full rounded ${
                          passwordStrength >= level
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Force : {passwordStrength <= 2 ? 'Faible' : passwordStrength <= 3 ? 'Moyenne' : 'Forte'}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 caractères avec une minuscule, une majuscule et un chiffre
              </p>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register('confirmPassword')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  {...form.register('acceptTerms')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  J'accepte les conditions d'utilisation et la politique de confidentialité
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              {form.formState.errors.acceptTerms && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-white py-3 font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0F5D8C' }}
              disabled={isLoading}
            >
              {isLoading ? 'Inscription...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/signin" className="font-medium hover:underline" style={{ color: '#0F5D8C' }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



// 'use client'

// import { useState, useEffect } from 'react'
// import { useUser } from '@/context/UserContext'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { User as UserIcon, Eye, EyeOff, CheckCircle } from 'lucide-react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { toast } from 'react-toastify'
// import { authAPI } from '@/lib/api'
// import type { User } from '@/context/UserContext'
// import Link from 'next/link'

// const signupSchema = z.object({
//   prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
//   nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
//   email: z.string().email('Email invalide'),
//   telephone: z.string().min(8, 'Le téléphone doit contenir au moins 8 chiffres'),
//   password: z.string()
//     .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir une minuscule, une majuscule et un chiffre'),
//   confirmPassword: z.string(),
//   acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
// }).refine(data => data.password === data.confirmPassword, {
//   message: 'Les mots de passe ne correspondent pas',
//   path: ['confirmPassword'],
// })

// type SignupFormValues = z.infer<typeof signupSchema>

// export default function SignUpPage() {
//   const { user, setUser } = useUser()
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   useEffect(() => {
//     if (user) {
//       router.replace(user.role === 'admin' ? '/admin' : '/candidat')
//     }
//   }, [user, router])

//   const form = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       nom: '',
//       prenom: '',
//       email: '',
//       telephone: '',
//       password: '',
//       confirmPassword: '',
//       acceptTerms: false,
//     },
//   })

//   const onSubmit = async (data: SignupFormValues) => {
//     setIsLoading(true)

//     try {
//       const payload = {
//         first_name: data.prenom,
//         last_name: data.nom,
//         email: data.email.toLowerCase().trim(),
//         phone: data.telephone,
//         password: data.password,
//         password_confirm: data.confirmPassword,
//       }

//       const res = await authAPI.register(payload)
//       const result = await res.json()

//       if (!res.ok) {
//         toast.error(result?.message || "Erreur lors de l'inscription")
//         return
//       }

//       const newUser: User = {
//         id: result.account.id,
//         name: `${result.account.first_name} ${result.account.last_name}`,
//         email: result.account.email,
//         role: 'candidat',
//       }

//       // Sauvegarder le token si présent
//       if (result.token) {
//         localStorage.setItem('authToken', result.token)
//       }

//       setUser(newUser)
//       toast.success(`Inscription réussie ! Bienvenue ${newUser.name}`)
//       router.replace('/candidat')
//     } catch (error) {
//       console.error(error)
//       toast.error('Une erreur réseau est survenue')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getPasswordStrength = (password: string) => {
//     let strength = 0
//     if (password.length >= 8) strength++
//     if (/[a-z]/.test(password)) strength++
//     if (/[A-Z]/.test(password)) strength++
//     if (/[0-9]/.test(password)) strength++
//     if (/[^A-Za-z0-9]/.test(password)) strength++
//     return strength
//   }

//   const passwordStrength = getPasswordStrength(form.watch('password') || '')

//   if (user) return null

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
//       {/* Bannière bleue */}
//       <div className="absolute top-0 left-0 right-0 h-64" style={{ backgroundColor: '#0F5D8C' }}>
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/40"></div>
//         <div className="absolute -bottom-1 left-0 right-0">
//           <svg viewBox="0 0 1200 120" className="w-full h-8 sm:h-12 fill-gray-50">
//             <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
//           </svg>
//         </div>
//       </div>

//       <div className="relative max-w-md w-full space-y-8">
//         {/* Breadcrumb */}
//         <nav className="flex items-center justify-center space-x-2 text-blue-100 text-sm mb-8">
//           <Link href="/" className="hover:text-white transition-colors">
//             Accueil
//           </Link>
//           <span className="text-blue-200">›</span>
//           <span className="text-white">Inscription</span>
//         </nav>

//         <div className="bg-white rounded-xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <div className="p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center" style={{ backgroundColor: '#0F5D8C' }}>
//               <UserIcon className="h-8 w-8 text-white" />
//             </div>
//             <h2 className="text-3xl font-bold" style={{ color: '#0F5D8C' }}>
//               Inscription
//             </h2>
//             <p className="text-gray-600 mt-2">Créez votre compte candidat</p>
//           </div>

//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Prénom et Nom */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Prénom <span className="text-red-500">*</span>
//                 </label>
//                 <Input {...form.register('prenom')} placeholder="Votre prénom" />
//                 {form.formState.errors.prenom && (
//                   <p className="text-red-500 text-xs mt-1">{form.formState.errors.prenom.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Nom <span className="text-red-500">*</span>
//                 </label>
//                 <Input {...form.register('nom')} placeholder="Votre nom" />
//                 {form.formState.errors.nom && (
//                   <p className="text-red-500 text-xs mt-1">{form.formState.errors.nom.message}</p>
//                 )}
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <Input type="email" {...form.register('email')} placeholder="votre@email.com" />
//               {form.formState.errors.email && (
//                 <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
//               )}
//             </div>

//             {/* Téléphone */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Téléphone <span className="text-red-500">*</span>
//               </label>
//               <Input type="tel" {...form.register('telephone')} placeholder="+225 XX XX XX XX" />
//               {form.formState.errors.telephone && (
//                 <p className="text-red-500 text-xs mt-1">{form.formState.errors.telephone.message}</p>
//               )}
//             </div>

//             {/* Mot de passe */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   {...form.register('password')}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>

//               {/* Indicateur de force */}
//               {form.watch('password') && (
//                 <div className="mt-2">
//                   <div className="flex space-x-1">
//                     {[1, 2, 3, 4].map((level) => (
//                       <div
//                         key={level}
//                         className={`h-2 w-full rounded ${
//                           passwordStrength >= level
//                             ? passwordStrength <= 2
//                               ? 'bg-red-500'
//                               : passwordStrength <= 3
//                               ? 'bg-yellow-500'
//                               : 'bg-green-500'
//                             : 'bg-gray-200'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Force : {passwordStrength <= 2 ? 'Faible' : passwordStrength <= 3 ? 'Moyenne' : 'Forte'}
//                   </p>
//                 </div>
//               )}

//               <p className="text-xs text-gray-500 mt-1">
//                 Minimum 8 caractères avec une minuscule, une majuscule et un chiffre
//               </p>
//               {form.formState.errors.password && (
//                 <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
//               )}
//             </div>

//             {/* Confirmer mot de passe */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirmer le mot de passe <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Input
//                   type={showConfirmPassword ? "text" : "password"}
//                   {...form.register('confirmPassword')}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
//               {form.formState.errors.confirmPassword && (
//                 <p className="text-red-500 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
//               )}
//             </div>

//             {/* Conditions */}
//             <div>
//               <div className="flex items-start">
//                 <input
//                   type="checkbox"
//                   {...form.register('acceptTerms')}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
//                 />
//                 <label className="ml-2 block text-sm text-gray-700">
//                   J'accepte les conditions d'utilisation et la politique de confidentialité
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//               </div>
//               {form.formState.errors.acceptTerms && (
//                 <p className="text-red-500 text-xs mt-1">{form.formState.errors.acceptTerms.message}</p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               className="w-full text-white py-3 font-semibold hover:opacity-90 transition-opacity"
//               style={{ backgroundColor: '#0F5D8C' }}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Inscription...' : 'Créer mon compte'}
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Déjà un compte ?{' '}
//               <Link href="/signin" className="font-medium hover:underline" style={{ color: '#0F5D8C' }}>
//                 Se connecter
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
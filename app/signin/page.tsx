"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";
import { authAPI } from "@/lib/api";
import type { User } from "@/context/UserContext";
import Link from "next/link";

export default function SignInPage() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/candidat");
    }
  }, [user, router]);

  useEffect(() => {
    const rememberUser = localStorage.getItem("rememberUser");
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberUser === "true" && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }

      const res = await authAPI.login(email.trim().toLowerCase(), password);
      const result = await res.json();

      console.log('📦 Réponse API login:', result); // DEBUG

      if (!res.ok) {
        toast.error(result?.message || "Email ou mot de passe incorrect");
        return;
      }

      if (!result.account) {
        throw new Error("Données de compte manquantes");
      }

      // ✅ SAUVEGARDER LE TOKEN EN PREMIER
    //   if (result.token) {
    //     localStorage.setItem("authToken", result.token);
    //     console.log('✅ Token sauvegardé:', result.token.substring(0, 20) + '...'); // DEBUG
    //   } else {
    //     console.warn('⚠️ Aucun token reçu du backend'); // DEBUG
    //   }

    // ✅ BON
if (result.access) {
  localStorage.setItem("authToken", result.access);
  console.log('✅ Token sauvegardé:', result.access.substring(0, 20) + '...'); 
} else {
  console.warn('⚠️ Aucun token reçu du backend');
}

      const newUser: User = {
        id: result.account.id,
        name: `${result.account.first_name} ${result.account.last_name}`,
        email: result.account.email,
        role: result.account.role === "candidate" ? "candidat" : "admin",
      };

      setUser(newUser);

      if (rememberMe) {
        localStorage.setItem("rememberUser", "true");
        localStorage.setItem("rememberedEmail", newUser.email);
      } else {
        localStorage.removeItem("rememberUser");
        localStorage.removeItem("rememberedEmail");
      }

      toast.success(`Connexion réussie ! Bienvenue ${newUser.name}`);
      router.replace(newUser.role === "admin" ? "/admin" : "/candidat");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Erreur réseau lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      {/* Bannière bleue */}
      <div
        className="absolute top-0 left-0 right-0 h-64"
        style={{ backgroundColor: "#0F5D8C" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/40"></div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            className="w-full h-8 sm:h-12 fill-gray-50"
          >
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
          <span className="text-white">Connexion</span>
        </nav>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div
              className="p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center"
              style={{ backgroundColor: "#0F5D8C" }}
            >
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold" style={{ color: "#0F5D8C" }}>
              Connexion
            </h2>
            <p className="text-gray-600 mt-2">
              Accédez à votre espace personnel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Se souvenir de moi
              </label>
            </div>

            <Button
              type="submit"
              className="w-full text-white py-3 font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0F5D8C" }}
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                href="/signup"
                className="font-medium hover:underline"
                style={{ color: "#0F5D8C" }}
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@/context/UserContext";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Eye, EyeOff, User as UserIcon } from "lucide-react";
// import { toast } from "react-toastify";
// import { authAPI } from "@/lib/api";
// import type { User } from "@/context/UserContext";
// import Link from "next/link";

// export default function SignInPage() {
//   const { user, setUser } = useUser();
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   useEffect(() => {
//     if (user) {
//       router.replace(user.role === "admin" ? "/admin" : "/candidat");
//     }
//   }, [user, router]);

//   useEffect(() => {
//     const rememberUser = localStorage.getItem("rememberUser");
//     const rememberedEmail = localStorage.getItem("rememberedEmail");

//     if (rememberUser === "true" && rememberedEmail) {
//       setEmail(rememberedEmail);
//       setRememberMe(true);
//     }
//   }, []);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (!email.trim() || !password.trim()) {
//         toast.error("Veuillez remplir tous les champs");
//         return;
//       }

//       const res = await authAPI.login(email.trim().toLowerCase(), password);
//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result?.message || "Email ou mot de passe incorrect");
//         return;
//       }

//       if (!result.account) {
//         throw new Error("Données de compte manquantes");
//       }

//       //   const newUser: User = {
//       //     id: result.account.id,
//       //     name: `${result.account.first_name} ${result.account.last_name}`,
//       //     email: result.account.email,
//       //     role: result.account.role,
//       //   }

//       const newUser: User = {
//         id: result.account.id,
//         name: `${result.account.first_name} ${result.account.last_name}`,
//         email: result.account.email,
//         role: result.account.role === "candidate" ? "candidat" : "admin", // ← Normalisation
//       };

//       // Sauvegarder le token
//       if (result.token) {
//         localStorage.setItem("authToken", result.token);
//       }

//       setUser(newUser);

//       if (rememberMe) {
//         localStorage.setItem("rememberUser", "true");
//         localStorage.setItem("rememberedEmail", newUser.email);
//       } else {
//         localStorage.removeItem("rememberUser");
//         localStorage.removeItem("rememberedEmail");
//       }

//       toast.success(`Connexion réussie ! Bienvenue ${newUser.name}`);
//       router.replace(newUser.role === "admin" ? "/admin" : "/candidat");
//     } catch (error) {
//       console.error("Erreur de connexion:", error);
//       toast.error("Erreur réseau lors de la connexion");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (user) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
//       {/* Bannière bleue */}
//       <div
//         className="absolute top-0 left-0 right-0 h-64"
//         style={{ backgroundColor: "#0F5D8C" }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/40"></div>
//         <div className="absolute -bottom-1 left-0 right-0">
//           <svg
//             viewBox="0 0 1200 120"
//             className="w-full h-8 sm:h-12 fill-gray-50"
//           >
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
//           <span className="text-white">Connexion</span>
//         </nav>

//         <div className="bg-white rounded-xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <div
//               className="p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center"
//               style={{ backgroundColor: "#0F5D8C" }}
//             >
//               <UserIcon className="h-8 w-8 text-white" />
//             </div>
//             <h2 className="text-3xl font-bold" style={{ color: "#0F5D8C" }}>
//               Connexion
//             </h2>
//             <p className="text-gray-600 mt-2">
//               Accédez à votre espace personnel
//             </p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="votre@email.com"
//                 required
//                 autoComplete="email"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   required
//                   autoComplete="current-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label
//                 htmlFor="remember-me"
//                 className="ml-2 block text-sm text-gray-700"
//               >
//                 Se souvenir de moi
//               </label>
//             </div>

//             <Button
//               type="submit"
//               className="w-full text-white py-3 font-semibold hover:opacity-90 transition-opacity"
//               style={{ backgroundColor: "#0F5D8C" }}
//               disabled={isLoading}
//             >
//               {isLoading ? "Connexion..." : "Se connecter"}
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Pas encore de compte ?{" "}
//               <Link
//                 href="/signup"
//                 className="font-medium hover:underline"
//                 style={{ color: "#0F5D8C" }}
//               >
//                 Créer un compte
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

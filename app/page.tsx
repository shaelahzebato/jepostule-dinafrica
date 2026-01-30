import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '#0F5D8C' }}>
          JePostule - DiNAfrica
        </h1>
        <p className="text-gray-600 mb-8">
          Plateforme de recrutement
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/signin"
            className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90"
            style={{ backgroundColor: '#0F5D8C' }}
          >
            Connexion
          </Link>
          <Link 
            href="/signup"
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  )
}
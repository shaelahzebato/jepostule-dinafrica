import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
          <Image
            src="/images/logo-din.png"
            alt="Logo DIN"
            width={200}
            height={200}
            className="h-20 w-auto"
          />
        </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plateforme de recrutement et de gestion des talents en Afrique
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Candidats</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/offres" className="hover:text-white transition-colors">
                  Offres d'emploi
                </Link>
              </li>
              <li>
                <Link href="/candidature-spontanee" className="hover:text-white transition-colors">
                  Candidature spontanée
                </Link>
              </li>
              <li>
                <Link href="/auto-evaluation" className="hover:text-white transition-colors">
                  Auto-évaluation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://din-africa.com" target="_blank" className="hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="https://din-africa.com" target="_blank" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="https://din-africa.com" target="_blank" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>contact@din-africa.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+225 XX XX XX XX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} DiNAfrica. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
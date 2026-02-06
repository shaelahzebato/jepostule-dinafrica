import { redirect } from 'next/navigation'

export default function OffresPage() {
  // Redirection vers la liste des offres dans l'espace candidat
  redirect('/candidat/offres')
}
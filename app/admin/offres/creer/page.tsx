import { redirect } from 'next/navigation'

export default function AdminCreateOfferPage() {
  // Redirection vers la liste des offres (où se trouve le modal de création)
  redirect('/admin/offres')
}
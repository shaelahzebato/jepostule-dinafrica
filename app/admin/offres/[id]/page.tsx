import { redirect } from 'next/navigation'

export default function AdminOfferDetailsPage({ params }: { params: { id: string } }) {
  // Redirection vers la page de modification
  redirect(`/admin/offres/${params.id}/modifier`)
}
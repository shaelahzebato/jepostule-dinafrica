import { redirect } from 'next/navigation'

export default function AdminCandidaturesPage() {
  // Redirection serveur vers le dashboard qui contient déjà la liste des candidatures
  redirect('/admin')
}
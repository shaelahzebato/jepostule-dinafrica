// Types pour l'application JePostule

export interface User {
  id: string | number
  name: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  country?: string
  address?: string
  role: 'admin' | 'candidat'
}

export interface JobOffer {
  id: number
  title: string
  company: string
  location: string
  contract_type: 'cdi' | 'cdd' | 'stage' | 'freelance'
  salary: string
  application_deadline: string
  description: string
  skills: string[]
  created_at?: string
  is_active?: boolean
}

export interface Application {
  id?: number
  civility: 'monsieur' | 'madame'
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  address: string
  contract_type_sought: 'cdi' | 'cdd' | 'stage' | 'freelance'
  experience: string[]
  education_level: string
  current_salary?: number
  expected_salary: number
  job?: number
  is_spontaneous?: boolean
  cv_file?: File | string
  created_at?: string
  status?: string
}

export type ContractType = 'cdi' | 'cdd' | 'stage' | 'freelance'
export type Civility = 'monsieur' | 'madame'

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  cdi: 'CDI',
  cdd: 'CDD',
  stage: 'Stage',
  freelance: 'Freelance'
}

export const CIVILITY_LABELS: Record<Civility, string> = {
  monsieur: 'Monsieur',
  madame: 'Madame'
}

export const EDUCATION_LEVELS = [
  { value: 'bac', label: 'Baccalauréat' },
  { value: 'bac+2', label: 'Bac+2 (BTS, DUT)' },
  { value: 'licence', label: 'Licence (Bac+3)' },
  { value: 'master', label: 'Master (Bac+5)' },
  { value: 'mba', label: 'MBA' },
  { value: 'doctorat', label: 'Doctorat' }
]

export const EXPERIENCE_OPTIONS = [
  { value: 'junior', label: 'Junior (0-2 ans)' },
  { value: 'intermediate', label: 'Intermédiaire (3-5 ans)' },
  { value: 'senior', label: 'Senior (5-10 ans)' },
  { value: 'expert', label: 'Expert (10+ ans)' },
  { value: 'freelance', label: 'Freelance' }
]



// // types/index.ts

// export interface User {
//   id: string | number
//   name: string
//   email: string
//   role: 'admin' | 'candidat'
//   first_name?: string
//   last_name?: string
//   phone?: string
// }

// export interface JobOffer {
//   id: number
//   title: string
//   company: string
//   location: string
//   contract_type: 'cdi' | 'cdd' | 'stage' | 'freelance'
//   salary: string
//   application_deadline: string
//   description: string
//   skills: string[]
//   created_at?: string
//   updated_at?: string
// }

// export interface Application {
//   id: number
//   civility: 'monsieur' | 'madame'
//   first_name: string
//   last_name: string
//   email: string
//   phone: string
//   country: string
//   address: string
//   contract_type_sought: 'cdi' | 'cdd' | 'stage' | 'freelance'
//   experience: string[]
//   education_level: string
//   current_salary: number
//   expected_salary: number
//   job?: number
//   is_spontaneous?: boolean
//   cv_file?: string
//   status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
//   created_at?: string
// }

// export interface AutoEvaluation {
//   id?: number
//   candidat_id: number
//   poste_vise: string
//   step_1?: string
//   step_2?: string
//   step_3?: string
//   step_4?: string
//   step_5?: string
//   step_6?: string
//   step_7?: string
//   step_8?: string
//   step_9?: string
//   step_10?: string
//   step_11?: string
//   progress: number
//   completed: boolean
//   completed_at?: string
// }

// export type ContractType = 'cdi' | 'cdd' | 'stage' | 'freelance'
// export type Civility = 'monsieur' | 'madame'

// export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
//   cdi: 'CDI',
//   cdd: 'CDD',
//   stage: 'Stage',
//   freelance: 'Freelance'
// }

// export const CIVILITY_LABELS: Record<Civility, string> = {
//   monsieur: 'Monsieur',
//   madame: 'Madame'
// }

// export const EDUCATION_LEVELS = [
//   { value: 'bac', label: 'Baccalauréat' },
//   { value: 'bac+2', label: 'Bac+2 (BTS, DUT)' },
//   { value: 'licence', label: 'Licence (Bac+3)' },
//   { value: 'master', label: 'Master (Bac+5)' },
//   { value: 'mba', label: 'MBA' },
//   { value: 'doctorat', label: 'Doctorat' }
// ]

// export const EXPERIENCE_OPTIONS = [
//   { value: 'junior', label: 'Junior (0-2 ans)' },
//   { value: 'intermediate', label: 'Intermédiaire (3-5 ans)' },
//   { value: 'senior', label: 'Senior (5-10 ans)' },
//   { value: 'expert', label: 'Expert (10+ ans)' },
//   { value: 'freelance', label: 'Freelance' }
// ]
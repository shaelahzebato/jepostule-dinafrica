// lib/api.ts
const API_BASE_URL = 'https://din-recruitment.onrender.com/api'

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

export const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('Token envoyé dans headers:', token.substring(0, 20) + '...') // Debug
    } else {
      console.warn('⚠️ Aucun token trouvé dans localStorage')
    }
  }
  
  return headers
}

// export const getHeaders = (includeAuth = true): HeadersInit => {
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//   }
  
//   if (includeAuth) {
//     const token = getToken()
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`
//     }
//   }
  
//   return headers
// }

// AUTH

export const authAPI = {
  login: (email: string, password: string) => {
    return fetch(`${API_BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password })
    })
  },
  
  register: (data: any) => {
    return fetch(`${API_BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data)
    })
  }
}

// ACCOUNTS
export const accountsAPI = {
  getAll: () => {
    return fetch(`${API_BASE_URL}/accounts/`, {
      headers: getHeaders()
    })
  },
  
  getOne: (id: string | number) => {
    return fetch(`${API_BASE_URL}/accounts/${id}/`, {
      headers: getHeaders()
    })
  },
  
  update: (id: string | number, data: any) => {
    return fetch(`${API_BASE_URL}/accounts/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
  }
}

// APPLICATIONS (Candidatures)
export const applicationsAPI = {
  getAll: () => {
    return fetch(`${API_BASE_URL}/applications/`, {
      headers: getHeaders()
    })
  },
  
  getOne: (id: string | number) => {
    return fetch(`${API_BASE_URL}/applications/${id}/`, {
      headers: getHeaders()
    })
  },
  
  create: (data: any) => {
    return fetch(`${API_BASE_URL}/applications/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
  },
  
  update: (id: string | number, data: any) => {
    return fetch(`${API_BASE_URL}/applications/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
  },
  
  delete: (id: string | number) => {
    return fetch(`${API_BASE_URL}/applications/${id}/`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  }
}

// JOBS (Offres d'emploi)
export const jobsAPI = {
  getAll: () => {
    return fetch(`${API_BASE_URL}/jobs/joboffers/`, {
      headers: getHeaders()
    })
  },
  
  getOne: (id: string | number) => {
    return fetch(`${API_BASE_URL}/jobs/joboffers/${id}/`, {
      headers: getHeaders()
    })
  },
  
  create: (data: any) => {
    return fetch(`${API_BASE_URL}/jobs/joboffers/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
  },
  
  update: (id: string | number, data: any) => {
    return fetch(`${API_BASE_URL}/jobs/joboffers/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
  },
  
  delete: (id: string | number) => {
    return fetch(`${API_BASE_URL}/jobs/joboffers/${id}/`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  }
}

// // JOBS (Offres d'emploi)
// export const jobsAPI = {
//   getAll: () => {
//     return fetch(`${API_BASE_URL}/jobs/`, {
//       headers: getHeaders()
//     })
//   },
  
//   getOne: (id: string | number) => {
//     return fetch(`${API_BASE_URL}/jobs/${id}/`, {
//       headers: getHeaders()
//     })
//   },
  
//   create: (data: any) => {
//     return fetch(`${API_BASE_URL}/jobs/`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(data)
//     })
//   },
  
//   update: (id: string | number, data: any) => {
//     return fetch(`${API_BASE_URL}/jobs/${id}/`, {
//       method: 'PATCH',
//       headers: getHeaders(),
//       body: JSON.stringify(data)
//     })
//   },
  
//   delete: (id: string | number) => {
//     return fetch(`${API_BASE_URL}/jobs/${id}/`, {
//       method: 'DELETE',
//       headers: getHeaders()
//     })
//   }
// }





// const API_BASE = 'https://din-recruitment.onrender.com/api'

// const getToken = () => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('authToken')
//   }
//   return null
// }

// const getHeaders = (includeAuth = true) => {
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//   }
  
//   if (includeAuth) {
//     const token = getToken()
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`
//     }
//   }
  
//   return headers
// }

// export const authAPI = {
//   login: async (email: string, password: string) => {
//     const res = await fetch(`${API_BASE}/accounts/login/`, {
//       method: 'POST',
//       headers: getHeaders(false),
//       body: JSON.stringify({ email, password })
//     })
//     return res
//   },

//   register: async (data: {
//     first_name: string
//     last_name: string
//     email: string
//     phone: string
//     password: string
//     password_confirm: string
//   }) => {
//     const res = await fetch(`${API_BASE}/accounts/register/`, {
//       method: 'POST',
//       headers: getHeaders(false),
//       body: JSON.stringify(data)
//     })
//     return res
//   }
// }

// export const accountsAPI = {
//   getAll: async () => {
//     const res = await fetch(`${API_BASE}/accounts/`, { headers: getHeaders() })
//     return res
//   },

//   getOne: async (id: string | number) => {
//     const res = await fetch(`${API_BASE}/accounts/${id}/`, { headers: getHeaders() })
//     return res
//   },

//   update: async (id: string | number, data: any) => {
//     const res = await fetch(`${API_BASE}/accounts/${id}/`, {
//       method: 'PATCH',
//       headers: getHeaders(),
//       body: JSON.stringify(data)
//     })
//     return res
//   }
// }

// export const applicationsAPI = {
//   getAll: async () => {
//     const res = await fetch(`${API_BASE}/applications/`, { headers: getHeaders() })
//     return res
//   },

//   create: async (data: any) => {
//     const res = await fetch(`${API_BASE}/applications/`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(data)
//     })
//     return res
//   }
// }

// export const jobsAPI = {
//   getAll: async () => {
//     const res = await fetch(`${API_BASE}/jobs/joboffers/`, { headers: getHeaders() })
//     return res
//   },

//   getOne: async (id: string | number) => {
//     const res = await fetch(`${API_BASE}/jobs/joboffers/${id}/`, { headers: getHeaders() })
//     return res
//   }
// }
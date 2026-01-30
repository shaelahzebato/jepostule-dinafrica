import Link from 'next/link'

interface Breadcrumb {
  label: string
  href?: string
}

interface HeroSectionProps {
  title: string
  subtitle: string
  breadcrumbs?: Breadcrumb[]
}

export default function HeroSection({ title, subtitle, breadcrumbs = [] }: HeroSectionProps) {
  return (
    <div className="relative" style={{ backgroundColor: '#0F5D8C' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {breadcrumbs.length > 0 && (
          <nav className="text-blue-100 text-sm mb-6 flex items-center gap-2 flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link 
                    href={crumb.href} 
                    className="hover:text-white transition-colors hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-blue-300">›</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-3xl">
          {subtitle}
        </p>
      </div>

      {/* Vague SVG */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-8 sm:h-12 fill-gray-50">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  )
}
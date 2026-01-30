import Link from 'next/link'
import { Button } from '@/components/ui/button'
import UserMenu from '@/components/UserMenu'
import Image from 'next/image'

interface HeaderProps {
  showWebsiteLink?: boolean
  showActionButton?: boolean
  actionButtonText?: string
  actionButtonHref?: string
}

export default function Header({ 
  showWebsiteLink = true, 
  showActionButton = false,
  actionButtonText = 'Postuler',
  actionButtonHref = '/offres'
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
          <Image
            src="/images/logo-din.png"
            alt="Logo DIN"
            width={200}
            height={200}
            className="h-20 w-auto"
          />
        </Link>
        {/* <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-2xl font-bold" style={{ color: '#0F5D8C' }}>
            DiN<span className="text-gray-700">Africa</span>
          </div>
        </Link> */}

        <div className="flex items-center gap-4">
          {showWebsiteLink && (
            <Link href="https://din-africa.com" target="_blank">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Site web
              </Button>
            </Link>
          )}

          {showActionButton && (
            <Link href={actionButtonHref}>
              <Button 
                style={{ backgroundColor: '#0F5D8C' }} 
                className="text-white hover:opacity-90 transition-opacity" 
                size="sm"
              >
                {actionButtonText}
              </Button>
            </Link>
          )}

          <UserMenu />
        </div>
      </div>
    </header>
  )
}
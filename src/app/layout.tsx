"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="FairStay - A transparent accommodation listing platform" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
        <title>FairStay</title>
      </head>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

function Header() {
  const pathname = usePathname();
  const { user, signOut, isTrialActive, trialDaysLeft } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-indigo-600 font-display font-bold text-xl">FairStay</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors duration-200 ${isActive('/') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/upload" 
              className={`text-sm font-medium transition-colors duration-200 ${isActive('/upload') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
            >
              List Property
            </Link>
            
            {/* Auth Links */}
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors duration-200 ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
                >
                  Dashboard
                </Link>
                
                {/* Trial Status */}
                {!user.isPaid && (
                  <div className="relative group">
                    <div className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-200 ${
                      isTrialActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isTrialActive 
                        ? `Trial: ${trialDaysLeft} days left` 
                        : 'Trial Expired'}
                    </div>
                    
                    <div className="absolute z-10 hidden group-hover:block mt-2 w-48 bg-white rounded-lg shadow-elevated py-1 right-0 animate-fadeIn">
                      <div className="px-4 py-2 text-sm">
                        {isTrialActive ? (
                          <>
                            <p className="font-medium">Your free trial is active</p>
                            <p className="text-gray-600">Expires in {trialDaysLeft} days</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">Your trial has expired</p>
                            <p className="text-gray-600">Upgrade to continue</p>
                          </>
                        )}
                        <Link 
                          href="/dashboard"
                          className="mt-2 block text-center bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors duration-200"
                        >
                          {user.isPaid ? 'Manage Subscription' : 'Upgrade Now'}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth" 
                  className={`text-sm font-medium transition-colors duration-200 ${isActive('/auth') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
                >
                  Login
                </Link>
                <Link 
                  href="/auth" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-700'}`}
              >
                Home
              </Link>
              <Link 
                href="/upload" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium ${isActive('/upload') ? 'text-indigo-600' : 'text-gray-700'}`}
              >
                List Property
              </Link>
              
              {/* Auth Links */}
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-700'}`}
                  >
                    Dashboard
                  </Link>
                  
                  {/* Trial Status for Mobile */}
                  {!user.isPaid && (
                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                      isTrialActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isTrialActive 
                        ? `Trial: ${trialDaysLeft} days left` 
                        : 'Trial Expired'}
                    </div>
                  )}
                  
                  <button 
                    onClick={handleSignOut}
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium ${isActive('/auth') ? 'text-indigo-600' : 'text-gray-700'}`}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary inline-block"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-indigo-400 font-display font-bold text-xl">FairStay</span>
            </div>
            <p className="text-gray-400 mb-4">
              A transparent accommodation platform connecting property owners directly with tenants. No hidden fees, no middlemen.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/placeholder" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com/placeholder" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://instagram.com/placeholder" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link href="/upload" className="text-gray-400 hover:text-white transition-colors duration-200">List Property</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">Dashboard</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FairStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 
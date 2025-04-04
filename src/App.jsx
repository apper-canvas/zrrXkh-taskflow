import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Sun, Moon, BarChart4, Home as HomeIcon } from 'lucide-react'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  const location = useLocation()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              TF
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              <Link 
                to="/" 
                className={`p-2 rounded-lg flex items-center ${
                  location.pathname === '/' 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                <HomeIcon size={20} className="mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link 
                to="/analytics" 
                className={`p-2 rounded-lg flex items-center ${
                  location.pathname === '/analytics' 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                <BarChart4 size={20} className="mr-1" />
                <span className="hidden sm:inline">Analytics</span>
              </Link>
            </nav>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="border-t border-surface-200 dark:border-surface-800 py-4 mt-10">
        <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
          &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
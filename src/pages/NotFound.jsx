import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="w-24 h-24 mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
      >
        <span className="text-4xl font-bold text-primary">404</span>
      </motion.div>
      
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/" 
        className="btn btn-primary flex items-center"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </Link>
    </motion.div>
  )
}

export default NotFound
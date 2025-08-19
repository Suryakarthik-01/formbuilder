import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import FormBuilder from './pages/FormBuilder'
import FormPreview from './pages/FormPreview'
import Analytics from './pages/Analytics'
import FormSubmissions from './pages/FormSubmissions'

// Suppress React development warnings in console
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    if (
      args[0]?.includes?.('React Router Future Flag Warning') ||
      args[0]?.includes?.('React.startTransition') ||
      args[0]?.includes?.('route resolution within Splat routes')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    if (
      args[0]?.includes?.('React Router Future Flag Warning') ||
      args[0]?.includes?.('React.startTransition') ||
      args[0]?.includes?.('route resolution within Splat routes')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forms/new" element={<FormBuilder />} />
        <Route path="/forms/:id/edit" element={<FormBuilder />} />
        <Route path="/forms/:id/preview" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <FormPreview />
            </main>
          </div>
        } />
        <Route path="/forms/:id/analytics" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Analytics />
            </main>
          </div>
        } />
        <Route path="/forms/:id/submissions" element={<FormSubmissions />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Router>
  )
}

export default App

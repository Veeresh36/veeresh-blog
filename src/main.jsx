import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routees/Approuter.jsx'
import './index.css'

export const createRoot = ViteReactSSG(
  { routes, basename: '/' }
)
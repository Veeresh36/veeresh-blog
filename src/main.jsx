import { ViteReactSSG } from 'vite-react-ssg'
import './index.css'
import { routes } from './routees/Approuter.jsx'



export const createRoot = ViteReactSSG(
  { routes, basename: '/' }
)
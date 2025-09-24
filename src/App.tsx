
import './App.css'
import { HomeScreen } from './modules/home'
import { QueryProvider } from './providers/query-provider'
import { CartProvider } from './shared/contexts/cart.context'

function App() {
  return (
    <QueryProvider>
      <CartProvider>
        <div className="w-full h-screen">
          <HomeScreen userId='0a3c1ff5-79b3-4bc4-a788-38bebf49e997' />
        </div>
      </CartProvider>
    </QueryProvider>
  )
}

export default App

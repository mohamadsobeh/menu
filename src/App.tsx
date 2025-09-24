
import './App.css'
import { HomeScreen } from './modules/home'
import { QueryProvider } from './providers/query-provider'
import { CartProvider } from './shared/contexts/cart.context'

function App() {
  return (
    <QueryProvider>
      <CartProvider>
        <div className="w-full h-screen">
          <HomeScreen restaurantId={1} />
        </div>
      </CartProvider>
    </QueryProvider>
  )
}

export default App

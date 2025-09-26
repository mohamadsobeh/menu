
import './App.css'
import { HomeScreen } from './modules/home'
import { QueryProvider } from './providers/query-provider'
import { WhiteLabelProvider } from './providers/white-label-provider'
import { CartProvider } from './shared/contexts/cart.context'

function App() {
  return (
    <QueryProvider>
      <WhiteLabelProvider>
        <CartProvider>
          <div className="w-full h-screen">
            <HomeScreen restaurantId={1} />
          </div>
        </CartProvider>
      </WhiteLabelProvider>
    </QueryProvider>
  )
}

export default App

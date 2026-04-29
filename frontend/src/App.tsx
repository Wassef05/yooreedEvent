import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CookieBanner } from './components/CookieBanner';
import { Home } from './pages/Home';
import { Catalogue } from './pages/Catalogue';
import { ProductPage } from './pages/Product';
import { Cart } from './pages/Cart';
import { Order } from './pages/Order';
import { OrderSuccess } from './pages/OrderSuccess';
import { Quote } from './pages/Quote';
import { QuoteSuccess } from './pages/QuoteSuccess';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { EventServices } from './pages/EventServices';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { CGU } from './pages/CGU';
import { AdminLogin } from './pages/admin/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ProductsManagement } from './pages/admin/ProductsManagement';
import { CategoriesManagement } from './pages/admin/CategoriesManagement';
import { OrdersManagement } from './pages/admin/OrdersManagement';
import { QuotesManagement } from './pages/admin/QuotesManagement';
import { Profile } from './pages/admin/Profile';
import { EventServicesManagement } from './pages/admin/EventServicesManagement';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Routes publiques */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogue" element={<Catalogue />} />
                    <Route path="/produit/:id" element={<ProductPage />} />
                    <Route path="/panier" element={<Cart />} />
                    <Route path="/commande" element={<Order />} />
                    <Route path="/commande/succes" element={<OrderSuccess />} />
                    <Route path="/devis" element={<Quote />} />
                    <Route path="/devis/succes" element={<QuoteSuccess />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services-evenementiels" element={<EventServices />} />
                    <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
                    <Route path="/cgu" element={<CGU />} />
                  </Routes>
                </main>
                <Footer />
                <CookieBanner />
              </div>
            }
          />

          {/* Routes admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/products" element={<ProductsManagement />} />
                  <Route path="/categories" element={<CategoriesManagement />} />
                  <Route path="/orders" element={<OrdersManagement />} />
                  <Route path="/quotes" element={<QuotesManagement />} />
                  <Route path="/event-services" element={<EventServicesManagement />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </AdminLayout>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

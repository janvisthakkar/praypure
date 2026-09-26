import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const About = lazy(() => import('./pages/About'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CollectionHub = lazy(() => import('./pages/CollectionHub'));
const Offers = lazy(() => import('./pages/Offers'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));

const CategoryPageWrapper = () => {
  const { slug } = useParams();
  return <CategoryPage key={slug} />;
};

const PageFallback = () => <div className="hero-skeleton skeleton" />;

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
        <Navbar />
        <main>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/incense" element={<CollectionHub familyKey="incense" />} />
              <Route path="/dhoop" element={<CollectionHub familyKey="dhoop" />} />
              <Route path="/:slug" element={<CategoryPageWrapper />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
    </HelmetProvider>
  );
}

export default App;

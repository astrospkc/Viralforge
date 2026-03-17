import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MainPage from './pages/MainPage';
import TranscodingPage from './pages/TranscodingPage';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/auth_store';
import PageNotFound from './pages/PageNotFound';

function App() {
  const { isAuthenticated } = useAuthStore()
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {isAuthenticated ?
          <>
            <Route path="/browse" element={<MainPage />} />
            <Route path="/transcode" element={<TranscodingPage />} />
          </>
          :

          <Route path="/pageNotFound" element={<PageNotFound />} />


        }

      </Routes>
    </Router>
  );
}

export default App;

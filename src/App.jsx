
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/Home/home';
import { AboutPage } from './pages/About/about';
import { MyProvider } from './utils/contextProvider';
import Error from './pages/Error/error';
function App() {
  return (
    <MyProvider>
      <Routes >
        <Route path='/*' element={<Error />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
      </Routes >
    </MyProvider>

  );
}
export default App;

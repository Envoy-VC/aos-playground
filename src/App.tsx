import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import '~/assets/index.css';

import Home from '~/pages/home';
import { Toaster } from '~/components/ui/sonner';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
      </Routes>
      <Toaster position='bottom-left' />
    </HashRouter>
  );
}

export default App;

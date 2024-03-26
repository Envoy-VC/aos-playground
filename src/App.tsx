import { HashRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { Toaster } from '~/components/ui/toaster';

import Home from '~/pages/home';
import '~/styles/index.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
      </Routes>
      <Toaster />
    </HashRouter>
  );
}

export default App;

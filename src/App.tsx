import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import '~/assets/index.css';

import Home from '~/pages/home';
import Contact from '~/pages/contact';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/contact'} element={<Contact />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

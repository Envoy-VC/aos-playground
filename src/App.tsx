import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import '~/assets/index.css';
import { ThemeProvider } from '~/components/theme-provider';

import Home from '~/pages/home';

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <HashRouter>
        <Routes>
          <Route path={'/'} element={<Home />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

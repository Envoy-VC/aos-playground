import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import ProviderTree from './providers';

const Root = (
  <ProviderTree>
    <App />
  </ProviderTree>
);

ReactDOM.hydrateRoot(document.getElementById('root')!, Root);

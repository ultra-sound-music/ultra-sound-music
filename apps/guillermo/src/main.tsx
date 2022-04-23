import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Spinner } from '@usm/ui';

import '@usm/styles/global.scss';

import App from './components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <Suspense fallback={<Spinner cover='fixed' />}>
          <App />
        </Suspense>
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>
);

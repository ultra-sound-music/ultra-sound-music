import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Spinner } from '@usm/ui';

import '@usm/styles/global.scss';

import App from './components/App/App';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      {/* @ts-expect-error - Temporary until this is fixed https://github.com/facebookexperimental/Recoil/pull/1718 */}
      <RecoilRoot>
        <Suspense fallback={<Spinner cover='fixed' />}>
          <App />
        </Suspense>
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);

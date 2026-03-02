import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './api/store';
import { AuthProvider } from './common/context/authcontext';
import router from './tenantroute';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  )
}

export default App

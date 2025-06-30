import './App.css'
import { RouterProvider } from 'react-router-dom';
import router from './components/router/Router';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

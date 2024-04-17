import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { HomePage } from './HomePage.tsx';

function App() {
  const main = ReactDOM.createRoot(document.getElementById("main"));
  main.render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  )
}

export default App;
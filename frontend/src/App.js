import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin); // Alterna entre mostrar Login y Register
  };

  return (
    <div className="App">
      {showLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <Register toggleForm={toggleForm} />
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div>
      <h1>{data ? data : 'Loading...'}</h1>
    </div>
  );
}

export default App;

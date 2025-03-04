import React from 'react';
import Router from './routes/Routes';

function App() {
  // useState 사용해보기 (React를 명시적으로 사용)
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Router />
    </div>
  );
}

export default App;

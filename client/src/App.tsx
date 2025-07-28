import { useEffect } from 'react';
import { useUserId } from './context/UserIdContext';
import { ChatCard } from './components/ChatCard';
import './App.scss';

function App() {
  const { userId } = useUserId();

  useEffect(() => {
    let hex = userId.replace(/[^A-Fa-f0-9]/g, '').toUpperCase();
    if (hex.length < 6) hex = hex.padEnd(6, '0');
    if (hex.length > 6) hex = hex.slice(0, 6);
    document.documentElement.style.setProperty('--user-color', `#${hex}`);
  }, [userId]);

  return (
    <div className="app-container" data-bs-theme="dark">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <ChatCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

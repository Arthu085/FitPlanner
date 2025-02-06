import { useNavigate } from 'react-router-dom';
import './NavigationBar.css'

const NavigationBar = () => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('id');
    navigate('/');
  }

  return (
    <div className="navigation-bar-container">
        <nav>
            <button className='home-button' onClick={() => navigate('/home')}>Fit Planner</button>
            <button className='logout-button' onClick={handleLogout}>Sair</button>
        </nav>
    </div>
  )
}

export default NavigationBar
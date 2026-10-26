import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import '../ui/Navbar.css';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            Qelvo
          </Link>
          <Link to="/" className="chat-link" aria-label="Open chats">
            <MessageCircle />
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/settings" className="nav-link">
            Settings
          </Link>

          {authUser && (
            <div className="auth-group">
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
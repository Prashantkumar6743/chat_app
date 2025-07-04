import { useAuth } from "../auth/useAuth";
import { useTheme } from "../auth/useTheme";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { logout, authUser } = useAuth();
  const { setTheme, storeLastUserTheme } = useTheme();

  const handleLogout = () => {
    storeLastUserTheme(); 
    logout();          
    setTheme("dark");  
  };

  return (
    <nav className="bg-base-100 text-base-content px-6 py-4 shadow-md flex items-center justify-between">
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:text-primary transition">ChatApp</Link>
      </div>

      <ul className="flex space-x-6 text-sm font-medium items-center">
        <li>
          <Link to="/" className="hover:text-primary transition">Home</Link>
        </li>

        {!authUser ? (
          <>
            <li>
              <Link to="/signup" className="hover:text-primary transition">Signup</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary transition">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/profile" className="hover:text-primary transition">Profile</Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-primary transition">Settings</Link>
            </li>
            <li>
              <button
                onClick={handleLogout} 
                className="btn btn-sm btn-outline btn-error"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

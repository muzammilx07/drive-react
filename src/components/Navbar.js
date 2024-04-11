import React from 'react';
import { useAuth } from './contexts/AuthProvider';
import { useNavigate, Link} from 'react-router-dom';
import DashBoard from './DashBoard';

const Navbar = () => {
    const{ logout }= useAuth()
    const { isMenuOpen, toggleMenu } = useAuth(); 
    const navigate = useNavigate()

    async function handleLogout(){
        try {
            await logout();
            navigate("/login")
        } catch (error) {
            console.alert("error whle logging out")
            navigate("/login")
        }

    }

  return (
    <div className="relative flex min-w-screen h-16 shadow-xl bg-white m-0 px-10 flex-row items-center justify-between border-b-2 border-gray-300">
      <Link to='/DashBoard'>LOGO</Link>
      <div className="relative">
        <div
          className="profile rounded-full border-solid border-2 hover:border-dotted border-sky-500 cursor-pointer"
          onClick={toggleMenu}
        >
          <img
            className="h-10 w-10 rounded-full"
            src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
            alt=""
          />
        </div>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">Profile</button>
            <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">Logout</button>
            <button onClick={toggleMenu} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

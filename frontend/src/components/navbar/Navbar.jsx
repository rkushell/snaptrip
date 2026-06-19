import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#69585F]/20 bg-[#FCDDBC]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

        <Link
          to="/"
          className="text-2xl font-bold text-[#1A1423]"
        >
          SnapTrip
        </Link>

        <div className="flex gap-8 text-[#69585F]">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Trips</Link>
          <Link to="/login">Login</Link>
          <button
            onClick={() => {

                logout();

                navigate("/login");

              }}
            >
              Logout
            </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
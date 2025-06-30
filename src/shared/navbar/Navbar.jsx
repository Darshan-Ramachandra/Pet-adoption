import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { CiLogin } from 'react-icons/ci';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/providers/AuthProvider";
import { MdArrowDropDown } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import NotificationCenter from '../../components/notifications/NotificationCenter';


// import icon from '../../assets/user.png';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  const handleToggle = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  const handleSignOut = () => {
    logOut().then().catch();
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/petlisting", label: "Pet Listing" },
    { to: "/donationcampaign", label: "Donation Campaigns" },
    { to: "/pet-quiz", label: "Find Your Pet Match" }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-md">
      <div className="max-w-[1200px] mx-auto">
        <div className="navbar min-h-[4rem] px-4">
          {/* Mobile menu button */}
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <HiMenuAlt2 className="h-6 w-6" />
            </label>
          </div>

          {/* Logo section */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="flex items-center gap-4">
              <img src={logo} alt="FourPows Logo" className="w-12 h-12" />
              <span className="text-xl font-bold">FourPows</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive
                        ? "px-4 py-2 rounded-full bg-[#D52B5C] text-white font-medium"
                        : "px-4 py-2 rounded-full hover:bg-base-200 transition-colors duration-200"
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right section: Notifications, Profile, Theme */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            {/* {user && <NotificationCenter />} */}

            {/* User Profile */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="dropdown dropdown-end">
                  <div className="flex items-center gap-2 cursor-pointer" tabIndex={0}>
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={user.photoURL} alt={user.displayName} />
                      </div>
                    </div>
                    <span className="hidden md:inline font-medium">{user.displayName}</span>
                    <MdArrowDropDown className="text-xl" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu p-4 shadow-lg bg-base-100 rounded-box w-72 mt-4">
                    <div className="text-center mb-4 p-2">
                      <div className="avatar mb-2">
                        <div className="w-16 h-16 rounded-full mx-auto">
                          <img src={user.photoURL} alt={user.displayName} />
                        </div>
                      </div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="border-t border-base-200 pt-2">
                      <li>
                        <Link to="/userdashboard" className="py-2">Dashboard</Link>
                      </li>
                      <li>
                        <button onClick={handleSignOut} className="text-error py-2">
                          <CiLogin className="text-xl" />
                          Logout
                        </button>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="btn btn-primary rounded-full normal-case">
                  Login
                </button>
              </Link>
            )}

            {/* Theme Toggle */}
            <label className="swap swap-rotate btn btn-ghost btn-circle">
              <input type="checkbox" onChange={handleToggle} checked={theme === "dark"} />
              <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className="drawer-side lg:hidden">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "bg-[#D52B5C] text-white" : ""
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
// src/components/layout/TopBar.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  SearchIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  BellIcon, 
  UserCircleIcon, 
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';
import { useAuth } from '../../hooks/useAuth';

const TopBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <div className="bg-spotify-dark-gray bg-opacity-95 sticky top-0 z-10 flex items-center justify-between px-6 py-3">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className="text-spotify-white"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Navigation buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={handleGoBack}
          className="bg-black bg-opacity-70 rounded-full p-1 text-spotify-white"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={handleGoForward}
          className="bg-black bg-opacity-70 rounded-full p-1 text-spotify-white"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Search form */}
      <form 
        onSubmit={handleSearch} 
        className="hidden md:flex flex-1 max-w-md mx-4"
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for artists, songs, or podcasts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 rounded-full
                      bg-spotify-light-gray text-spotify-white
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
        </div>
      </form>

      {/* User menu */}
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <Link to="/notifications" className="text-spotify-white">
              <BellIcon className="h-6 w-6" />
            </Link>
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="bg-spotify-light-gray rounded-full p-1 h-8 w-8 flex items-center justify-center">
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.username}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-6 w-6 text-spotify-white" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-spotify-white">
                  {currentUser.username}
                </span>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-spotify-light-gray ring-1 ring-black ring-opacity-5 z-50">
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className="block px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/register"
              // className="text-sm font-medium text-spotify-light hover:text-spotify-white"
              className="bg-spotify-white text-spotify-black px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-80"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="bg-spotify-green text-spotify-black px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-80"
            >
              Log in
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-spotify-dark-gray p-4 z-50">
          <form 
            onSubmit={handleSearch} 
            className="mb-4"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-full
                          bg-spotify-light-gray text-spotify-white
                          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
          </form>
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className="text-spotify-white py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="text-spotify-white py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Search
            </Link>
            <Link
              to="/library"
              className="text-spotify-white py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Your Library
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopBar;



// src/components/layout/TopBar.jsx
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   SearchIcon, 
//   ChevronLeftIcon, 
//   ChevronRightIcon, 
//   BellIcon, 
//   UserCircleIcon, 
//   MenuIcon,
//   XIcon
// } from '@heroicons/react/outline';
// import { useAuth } from '../../hooks/useAuth';
// import { useNotification } from '../../hooks/useNotification';

// const TopBar = () => {
//   const { currentUser, logout } = useAuth();
//   const { unreadCount } = useNotification ? useNotification() : { unreadCount: 0 };
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       // If there's a valid search query, navigate to search results
//       navigate(`/search/${encodeURIComponent(searchQuery)}`);
//     } else {
//       // If empty search, go to search page
//       navigate('/search');
//     }
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   const handleGoForward = () => {
//     navigate(1);
//   };

//   const toggleUserMenu = () => {
//     setShowUserMenu(!showUserMenu);
//   };

//   const toggleMobileMenu = () => {
//     setShowMobileMenu(!showMobileMenu);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setShowUserMenu(false);
//   };

//   return (
//     <div className="bg-spotify-dark-gray bg-opacity-95 sticky top-0 z-10 flex items-center justify-between px-6 py-3">
//       {/* Mobile menu button */}
//       <div className="md:hidden">
//         <button
//           type="button"
//           className="text-spotify-white"
//           onClick={toggleMobileMenu}
//         >
//           {showMobileMenu ? (
//             <XIcon className="h-6 w-6" />
//           ) : (
//             <MenuIcon className="h-6 w-6" />
//           )}
//         </button>
//       </div>

//       {/* Navigation buttons */}
//       <div className="hidden md:flex items-center space-x-4">
//         <button
//           onClick={handleGoBack}
//           className="bg-black bg-opacity-70 rounded-full p-1 text-spotify-white"
//         >
//           <ChevronLeftIcon className="h-6 w-6" />
//         </button>
//         <button
//           onClick={handleGoForward}
//           className="bg-black bg-opacity-70 rounded-full p-1 text-spotify-white"
//         >
//           <ChevronRightIcon className="h-6 w-6" />
//         </button>
//       </div>

//       {/* Search form */}
//       <form 
//         onSubmit={handleSearch} 
//         className="hidden md:flex flex-1 max-w-md mx-4"
//       >
//         <div className="relative w-full">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <SearchIcon className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search for artists, songs, or playlists"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="block w-full pl-10 pr-3 py-2 rounded-full
//                       bg-spotify-light-gray text-spotify-white
//                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
//           />
//         </div>
//       </form>

//       {/* User menu */}
//       <div className="flex items-center space-x-4">
//         {currentUser ? (
//           <>
//             <Link to="/notifications" className="text-spotify-white relative">
//               <BellIcon className="h-6 w-6" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-spotify-green text-xs text-black rounded-full w-4 h-4 flex items-center justify-center">
//                   {unreadCount > 9 ? '9+' : unreadCount}
//                 </span>
//               )}
//             </Link>
//             <div className="relative">
//               <button
//                 onClick={toggleUserMenu}
//                 className="flex items-center space-x-2 focus:outline-none"
//               >
//                 <div className="bg-spotify-light-gray rounded-full p-1 h-8 w-8 flex items-center justify-center">
//                   {currentUser.profileImage ? (
//                     <img
//                       src={currentUser.profileImage}
//                       alt={currentUser.username}
//                       className="h-full w-full rounded-full object-cover"
//                     />
//                   ) : (
//                     <UserCircleIcon className="h-6 w-6 text-spotify-white" />
//                   )}
//                 </div>
//                 <span className="hidden md:block text-sm font-medium text-spotify-white">
//                   {currentUser.username}
//                 </span>
//               </button>

//               {/* Dropdown menu */}
//               {showUserMenu && (
//                 <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-spotify-light-gray ring-1 ring-black ring-opacity-5 z-50">
//                   <Link
//                     to={`/profile/${currentUser.id}`}
//                     className="block px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
//                     onClick={() => setShowUserMenu(false)}
//                   >
//                     Profile
//                   </Link>
//                   <Link
//                     to="/settings"
//                     className="block px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
//                     onClick={() => setShowUserMenu(false)}
//                   >
//                     Settings
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-spotify-white hover:bg-spotify-dark-gray"
//                   >
//                     Log out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="flex space-x-4">
//             <Link
//               to="/register"
//               className="text-sm font-medium text-spotify-light hover:text-spotify-white"
//             >
//               Sign up
//             </Link>
//             <Link
//               to="/login"
//               className="bg-spotify-white text-spotify-black px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-80"
//             >
//               Log in
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Mobile menu */}
//       {showMobileMenu && (
//         <div className="md:hidden absolute top-16 left-0 right-0 bg-spotify-dark-gray p-4 z-50">
//           <form 
//             onSubmit={handleSearch} 
//             className="mb-4"
//           >
//             <div className="relative w-full">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <SearchIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 rounded-full
//                           bg-spotify-light-gray text-spotify-white
//                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
//               />
//             </div>
//           </form>
//           <nav className="flex flex-col space-y-2">
//             <Link
//               to="/"
//               className="text-spotify-white py-2"
//               onClick={() => setShowMobileMenu(false)}
//             >
//               Home
//             </Link>
//             <Link
//               to="/search"
//               className="text-spotify-white py-2"
//               onClick={() => setShowMobileMenu(false)}
//             >
//               Search
//             </Link>
//             <Link
//               to="/library"
//               className="text-spotify-white py-2"
//               onClick={() => setShowMobileMenu(false)}
//             >
//               Your Library
//             </Link>
//             {currentUser && (
//               <>
//                 <Link
//                   to="/collection/tracks"
//                   className="text-spotify-white py-2"
//                   onClick={() => setShowMobileMenu(false)}
//                 >
//                   Liked Songs
//                 </Link>
//                 <Link
//                   to="/notifications"
//                   className="text-spotify-white py-2"
//                   onClick={() => setShowMobileMenu(false)}
//                 >
//                   Notifications
//                 </Link>
//               </>
//             )}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TopBar;
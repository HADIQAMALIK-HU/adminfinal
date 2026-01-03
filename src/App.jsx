import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Admin Panel Components (already correctly imported from assets)
import Users from './assets/Users';
import CreateUser from './assets/CreateUser';
import UpdateUser from './assets/UpdateUser';
import DisplayDetail from './assets/DisplayDetail'; // Import the detail component for admin view

// Navbar and Footer components (already correctly imported from assets)
import MediaNavbar from './assets/MediaNavbar';
import MediaFooter from './assets/MediaFooter';

// --- NEW IMPORT: Client-Side Billboard Listing Component ---
// This assumes ClientViewBillboards.jsx is also in the 'assets' folder
import ClientViewBillboards from './assets/ClientViewBillboards';
import AdminCareer from './assets/AdminCareer';
// --- END NEW IMPORT ---

function App() {
  const [count, setCount] = useState(0); // This state isn't used, can be removed if not needed elsewhere

  return (
    <div>
      <BrowserRouter>
        <MediaNavbar /> {/* Navbar always at the top */}

        <Routes>
          {/* --- ADMIN ROUTES --- */}
          {/* Default route (/) will now be the Admin Users list */}
          <Route path='/' element={<Users />} /> 
           <Route path='/users' element={<Users />} />
          <Route path='/create' element={<CreateUser />} />
          <Route path='/update/:id' element={<UpdateUser />} />
          <Route path='/display/:id' element={<DisplayDetail />} />
          <Route path='/admincareer' element={<AdminCareer/>} />

          {/* --- CLIENT-SIDE PUBLIC ROUTES --- */}
          {/* New route for the client-facing billboard list */}
          <Route path='/client-billboards' element={<ClientViewBillboards />} />
          {/* New route for the client-facing single billboard detail page */}
          {/* You can reuse DisplayDetail or create a separate ClientBillboardDetail if needed */}
          <Route path='/client-billboards/:id' element={<DisplayDetail />} /> 
          
          {/* Add a general 404 route if desired */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>

        <MediaFooter /> {/* Footer always at the bottom */}
      </BrowserRouter>
    </div>
  );
}

export default App;
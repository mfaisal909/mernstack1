import {BrowserRouter,Routes,Route} from 'react-router-dom'

import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Home from './pages/Home'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Createlisting from './pages/Createlisting'

function App() {
    return <BrowserRouter>
    <Header/>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route element={<PrivateRoute/>}>
    <Route path="/profile" element={<Profile/>}/>
    <Route path='/create-listing' element={<Createlisting/>}/>
    </Route>
    <Route path="/sign-in" element={<SignIn/>}/>
    <Route path="/sign-up" element={<SignUp/>}/>
    <Route path="/about" element={<About/>}/>
  </Routes>
  </BrowserRouter>
}

export default App

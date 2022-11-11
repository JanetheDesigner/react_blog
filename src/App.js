import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Posts from './pages/Posts';
import SingleBlog from './pages/SinglePost';
import Create from './pages/Create';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>

      
      <Route path='/posts' element={<Posts />} />
      <Route path='/' element={<Login />} />
      <Route path='/create' element={<Create />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/post/:id' element={<SingleBlog />} />


      <Route path='*' element={
       <h1> Page not found</h1> 
      }/>
      </Routes>

    </div>
    </BrowserRouter>
  );
}

export default App;

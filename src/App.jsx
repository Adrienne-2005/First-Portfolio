import { useEffect } from 'react'
import './App.css'
import 'aos/dist/aos.css';
import AOS from 'aos';

function App() {
  useEffect(function() {
    AOS.init({
      duration: 500,
      once: false,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      
    </>

  )
}

export default App

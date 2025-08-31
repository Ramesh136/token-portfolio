import { useEffect , useState } from 'react'
import './App.css'
import Body from './components/Body';

function App() {
  const [dark] = useState(
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (dark) {
      document.body.classList?.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
     document.body.classList?.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div id='app-wrapper' className='bg-white dark:bg-[#212124] text-black dark:text-[#F4F4F5] min-h-screen' >
      <Body />
    </div>
  )
}

export default App

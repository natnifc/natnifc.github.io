import Hero from './components/Hero';
import Projects from './components/Projects';
import Colophon from './components/Colophon';
import { footer } from './content';
import './App.css';

function App() {
  return (
    <div className="page-content">
      <Hero />
      <Projects />
      <Colophon />
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {footer.name}
        </p>
      </footer>
    </div>
  );
}

export default App;

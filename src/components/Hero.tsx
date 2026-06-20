import FlappyNN from './FlappyNN';
import { hero } from '../content';
import './Hero.css';

export default function Hero() {
  return (
    <header className="hero">
      <p className="hero-prompt">{hero.prompt}</p>
      <h1 className="hero-name">{hero.name}</h1>
      <p className="hero-tagline">{hero.tagline}</p>
      <nav className="hero-links">
        {hero.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <FlappyNN />
      <p className="hero-hint">{hero.hint}</p>
    </header>
  );
}

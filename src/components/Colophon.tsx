import { colophon, colophonHeading } from '../content';
import './Colophon.css';

export default function Colophon() {
  return (
    <section className="colophon" id="how-it-works">
      <h2 className="colophon-heading">{colophonHeading}</h2>
      <p className="colophon-intro">
        The bird up top is played by a neural network that teaches itself, live
        in your browser. How it's wired:
      </p>
      <dl className="colophon-list">
        {colophon.map((entry) => (
          <div className="colophon-entry" key={entry.file}>
            <dt>
              <code>{entry.file}</code>
            </dt>
            <dd>{entry.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

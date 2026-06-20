import { projects, projectsHeading } from '../content';
import './Projects.css';

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <h2 className="projects-heading">{projectsHeading}</h2>
      <div className="projects-list">
        {projects.map((project) => (
          <article className="project" key={project.title}>
            <div className="project-header">
              <h3>{project.title}</h3>
              {project.subtitle && (
                <span className="project-subtitle">{project.subtitle}</span>
              )}
            </div>
            <ul className="project-points">
              {project.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span className="project-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

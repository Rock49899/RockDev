import { Suspense } from "react";
import AdminFrame from "../AdminFrame";
import { ProjectForm } from "../AdminUI";
import { SITE_FALLBACK } from "../fallback";

export default function ProjectsAdminPage() {
  return (
    <Suspense fallback={SITE_FALLBACK}>
      <AdminFrame
        active="/admin/projets"
        title="Projets"
        lead="Un même projet peut apparaître dans la version développeur, la version AMOA, ou les deux. Chaque projet a sa page détaillée avec galerie, points clés et liens."
        render={(data) => {
          const projects = [...data.projects].sort((a, b) => a.sort - b.sort);
          return (
            <section>
              {projects.map((project) => (
                <details key={project.id} className="card project-edit">
                  <summary>
                    <strong>{project.title}</strong>
                    <span>
                      {project.published ? "Publié" : "Brouillon"} · {project.images.length} image
                      {project.images.length > 1 ? "s" : ""}
                    </span>
                  </summary>
                  <ProjectForm project={project} />
                </details>
              ))}
              <details className="card project-edit" open={projects.length === 0}>
                <summary>
                  <strong>+ Ajouter un projet</strong>
                </summary>
                <ProjectForm />
              </details>
            </section>
          );
        }}
      />
    </Suspense>
  );
}

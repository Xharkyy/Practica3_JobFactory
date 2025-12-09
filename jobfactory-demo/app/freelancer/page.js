"use client";

import { useRouter } from "next/navigation";
import { useJobFactory } from "../../hooks/useJobFactory";
import { JobList } from "../../components/JobList";

export default function FreelancerPage() {
  const router = useRouter();
  const { jobs, acceptJob } = useJobFactory();

  const accept = (jobId) => {
    const deadline = Math.floor(Date.now() / 1000) + 86400; // +1 día
    const challengePeriod = 86400;                          // 1 día

    // Árbitro dummy para la demo
    const arbiter = "0x0000000000000000000000000000000000000000";

    acceptJob(jobId, arbiter, deadline, challengePeriod);

    alert("Trabajo aceptado. Redirigiendo al escrow...");
    setTimeout(() => router.push(`/job/${jobId}`), 600);
  };

  return (
    <main className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">👨‍💼 Zona Freelancer</h1>

      <section>
        <h2 className="text-2xl font-bold mb-4">📝 Trabajos disponibles</h2>

        <JobList
          jobs={jobs}
          showAcceptButton={true}
          onAccept={(jobId) => accept(jobId)}
        />
      </section>
    </main>
  );
}
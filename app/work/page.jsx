import CaseCards from "../components/CaseCards";

export const metadata = {
  title: "Work — Sumedh Kamble",
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-8 pt-20 pb-10">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-black">
          Work
        </h1>
      </section>
      <CaseCards />
    </main>
  );
}

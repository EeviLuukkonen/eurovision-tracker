import { useParams } from 'react-router-dom';

const OfficialResultsPage = () => {
  const { year } = useParams<{ year: string }>();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
        <h1 className="text-2xl font-semibold">Official Results</h1>
      </div>

      <div>
        <p>content coming soon...</p>
      </div>
    </main>
  );
};

export default OfficialResultsPage;

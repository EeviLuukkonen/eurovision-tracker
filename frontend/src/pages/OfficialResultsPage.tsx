import { useParams } from 'react-router-dom';

const OfficialResultsPage = () => {
  const { year } = useParams<{ year: string }>();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Official Results - Eurovision {year}</h1>

      <div>
        <p>content coming soon...</p>
      </div>
    </main>
  );
};

export default OfficialResultsPage;

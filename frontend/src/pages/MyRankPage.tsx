import { useParams } from 'react-router-dom';

const MyRankPage = () => {
  const { year } = useParams<{ year: string }>();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Rank - Eurovision {year}</h1>
      <div>
        <p>content coming soon...</p>
      </div>
    </main>
  );
};

export default MyRankPage;

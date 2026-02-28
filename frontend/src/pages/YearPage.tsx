import { Link, useParams } from 'react-router-dom';

const YearPage = () => {
  const { year } = useParams<{ year: string }>();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">

      <h1 className="text-4xl font-bold mb-8">Eurovision {year}</h1>

      <div className="flex flex-col gap-4">
        <Link
          to={`/year/${year}/my-rank`}
          className="block w-full p-6 text-center border-2 border-white/20 rounded-lg hover:border-primary hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <h2 className="text-2xl font-bold text-white">My Rank</h2>
          <p className="text-white/70 mt-2">Create and view your personal ranking</p>
        </Link>

        <Link
          to={`/year/${year}/official-rank`}
          className="block w-full p-6 text-center border-2 border-white/20 rounded-lg hover:border-primary hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <h2 className="text-2xl font-bold text-white">Official Rank</h2>
          <p className="text-white/70 mt-2">View the official Eurovision results</p>
        </Link>
      </div>
    </main>
  );
};

export default YearPage;
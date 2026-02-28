import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const YearPage = () => {
  const { year } = useParams<{ year: string }>();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link to="/">
          <ArrowLeft />
          Back to years
        </Link>
      </Button>

      <h1 className="text-4xl font-bold mb-8">Eurovision {year}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:border-primary transition-all cursor-pointer">
          <Link to={`/year/${year}/my-rank`} className="block">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">My Rank</CardTitle>
              <CardDescription>
                Create and view your personal ranking
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-all cursor-pointer">
          <Link to={`/year/${year}/official-rank`} className="block">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Official Rank</CardTitle>
              <CardDescription>
                View the official Eurovision results
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </main>
  );
};

export default YearPage;
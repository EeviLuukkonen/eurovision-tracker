import ReactCountryFlag from 'react-country-flag';
import type { ContestYear } from '../types/year';

type YearButtonProps = {
  item: ContestYear;
};

const YearButton = ({ item }: YearButtonProps) => {
  const onClick = () => {
    console.log(`Clicked year ${item.year}`);
  };

  return (
    <button 
      onClick={onClick} 
      className="w-full p-4 text-left cursor-pointer flex items-center gap-4 border-2 border-white/20 rounded-lg hover:border-primary hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div className="flex-shrink-0 opacity-90">
        <ReactCountryFlag 
          countryCode={item.country} 
          svg 
          style={{ width: '4rem', height: '3rem' }} 
          className="rounded shadow-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <strong className="text-2xl font-bold text-white">{item.year}</strong>
        <span className="text-white/40 text-xl">-</span>
        <span className="text-lg text-white/70">{item.city}</span>
      </div>
    </button>
  );
};

export default YearButton;

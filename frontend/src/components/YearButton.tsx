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
    <button onClick={onClick} style={{ padding: '0.75rem 1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <ReactCountryFlag countryCode={item.country} svg style={{ width: '2em', height: '2em' }} />
      <strong>{item.year}</strong> — {item.city}
    </button>
  );
};

export default YearButton;

import MealRatePerMember from './components/MealRatePerMember';
import MealRateStats from './components/MealRateStats';
const MealRate: React.FC = () => {

  return (
    <div className="p-4">
      <MealRateStats></MealRateStats>
      <MealRatePerMember></MealRatePerMember>
    </div>
  );
};

export default MealRate;

import React, { useState } from 'react';
import Button from './Button';

interface NumberSelectorProps {
  maxNumber: number;
  onSelect: (value: number) => void;
  selectedValue?: number;
  isInvalid: boolean;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ 
  maxNumber, 
  onSelect,
  selectedValue,
  isInvalid = false
}) => {
  const [value, setValue] = useState<number>(selectedValue || 0);
  
  const handleIncrement = () => {
    if (value < maxNumber) {
      const newValue = value + 1;
      setValue(newValue);
      onSelect(newValue);
    }
  };
  
  const handleDecrement = () => {
    if (value > 0) {
      const newValue = value - 1;
      setValue(newValue);
      onSelect(newValue);
    }
  };
  
  return (
    <div className="flex flex-col items-center bg-red">
      <div className="flex items-center gap-3 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDecrement}
          disabled={value <= 0}
          aria-label="Decrease number"
        >
          -
        </Button>
        
        <div className="bg-slate-700 w-16 h-16 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold">{value}</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleIncrement}
          disabled={value >= maxNumber}
          aria-label="Increase number"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default NumberSelector;
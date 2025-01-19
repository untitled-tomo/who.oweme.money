import React, { useState } from 'react';
import styles from './PeopleForm.module.css'

interface PeopleFormProps {
    setNames: React.Dispatch<React.SetStateAction<string[]>>;
  }

const PeopleForm: React.FC<PeopleFormProps> = ({ setNames }) => {
    const [numPeople, setNumPeople] = useState(0);
    const [localNames, setLocalNames] = useState<string[]>([]);

  const handleNumPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    setNumPeople(num);
    setLocalNames(Array(num).fill(''));
  };


  const handleNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newNames = [...localNames];
    newNames[index] = e.target.value;
    setLocalNames(newNames);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNames(localNames);
    console.log('Submitted names:', localNames);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Number of People:
          <input type="number" value={numPeople} onChange={handleNumPeopleChange}  />
        </label>
      </div>
      {localNames.map((name, index) => (
        <div key={index}>
          <label>
            Name {index + 1}:
            <input type="text" value={name} onChange={(e) => handleNameChange(index, e)} />
          </label>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default PeopleForm;
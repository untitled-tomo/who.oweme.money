import React, { useState } from 'react';

interface PeopleFormProps {
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  nextStep: () => void;
}

const PeopleForm: React.FC<PeopleFormProps> = ({ setNames, nextStep }) => {
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
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Number of People:</span>
          <input type="number" value={numPeople} onChange={handleNumPeopleChange} className="form-control" placeholder="Number of People" aria-label="Username" aria-describedby="basic-addon1" />
        </div>
      {localNames.map((name, index) => (
        <div key={index}>
          <div className="input-group mb-3 w-50">
          <span className="input-group-text" id="basic-addon1">Name {index + 1}:</span>
          <input type="text" value={name} onChange={(e) => handleNameChange(index, e)}  className="form-control" placeholder="Name" aria-label="Username" aria-describedby="basic-addon1" />
        </div>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default PeopleForm;
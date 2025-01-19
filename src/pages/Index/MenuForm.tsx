import React, { useState } from 'react';
import { forEachChild } from 'typescript';
import { DeleteOutlined } from '@ant-design/icons';
interface MenuItem {
    name: string;
    amount: number;
    peopleInvolved: string[];
  }

interface MenuFormProps {
    people: string[];
  }
const MenuForm: React.FC<MenuFormProps> = ({ people }) => {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [peopleInvolved, setPeopleInvolved] = useState<string[]>([]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
      };
    
      const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value));
      };
    
      const handleCheckboxChange = (person: string) => {
        setPeopleInvolved((prev) =>
          prev.includes(person)
            ? prev.filter((p) => p !== person)
            : [...prev, person]
        );
      };
    
      const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        const newItem: MenuItem = { name, amount, peopleInvolved };
        setMenu((prevMenu) => [...prevMenu, newItem]);
        setName('');
        setAmount(0);
        setPeopleInvolved([]);
      };





    return(
        <>

        <h2>Menu</h2>
        <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input type="text" value={name} onChange={handleNameChange} />
          </label>
        </div>
        <div>
          <label>
            Amount:
            <input type="number" value={amount} onChange={handleAmountChange} />
          </label>
        </div>
        <div>
          {people.map((person) => (
            <label key={person}>
              <input
                type="checkbox"
                checked={peopleInvolved.includes(person)}
                onChange={() => handleCheckboxChange(person)}
              />
              {person}
            </label>
          ))}
        </div>
        <button type="submit">Add Menu Item</button>
      </form>
        <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            {people.map((person) => (
              <th key={person}>{person}</th>
            ))}
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item, index) => {
            const amountPerPerson = item.amount / item.peopleInvolved.length;
            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                {people.map((person) => (
                  <td key={person}>
                    {item.peopleInvolved.includes(person) ? amountPerPerson : ''}
                  </td>
                ))}
                <td>
                  <DeleteOutlined
                    onClick={() =>
                      setMenu((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </DeleteOutlined>
                  </td>
              </tr>
            );
          })}
        </tbody>
      </table>
        </>
    )
}
export default MenuForm;
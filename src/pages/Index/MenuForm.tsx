import React, { useState } from 'react';
import { Table, Input, Button, Checkbox, Form } from 'antd';
import Index from '.';

interface MenuItem {
  name: string;
  amount: number;
  peopleInvolved: string[];
}

interface MenuFormProps {
  people: string[];
}

interface DataType {
  key: React.Key;
  name: string;
  amount: number;
  [key: string]: any;
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if( name.trim() === '' ){
        alert('Name cannot be empty');
        return;
    }
    if (amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }
    if (peopleInvolved.length === 0) {
        alert('Please select at least one person');
        return;
    }
    console.log(peopleInvolved)
    const newItem: MenuItem = { name, amount, peopleInvolved };
    setMenu((prevMenu) => [...prevMenu, newItem]);
    setName('');
    setAmount(0);
    setPeopleInvolved([]);
  };

  const columns = [
    {
      title: 'Menu Item',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    ...people.map((person) => ({
      title: person,
      dataIndex: person,
      key: person,
    })),
  ];

  const dataSource: DataType[] = menu.map((item, index) => {
    const amountPerPerson = (item.amount / item.peopleInvolved.length).toFixed(2);
    const row: DataType = {
      key: index,
      name: item.name,
      amount: item.amount,
    };
    item.peopleInvolved.forEach((person) => {
      row[person] = amountPerPerson;
    });
    return row;
  });

  const totals: Record<string, number> = people.reduce((acc, person) => {
    acc[person] = 0;
    return acc;
  }, {});

  menu.forEach((item) => {
    const amountPerPerson = item.amount / item.peopleInvolved.length;
    item.peopleInvolved.forEach((person) => {
      totals[person] += amountPerPerson;
    });
  });

  const totalRow: DataType = {
    key: 'total',
    name: 'Total',
    amount: menu.reduce((acc, item) => acc + item.amount, 0),
    ...totals,
  };

  return (
    <>
      <h2>Menu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <Input type="text" value={name} onChange={handleNameChange} />
          </label>
        </div>
        <div>
          <label>
            Amount:
            <Input type="number" value={amount} onChange={handleAmountChange} />
          </label>
        </div>
        <div>
          {people.map((person) => (
            <label key={person}>
              <Checkbox
                checked={peopleInvolved.includes(person)}
                onChange={() => handleCheckboxChange(person)}
              />
              {person}
            </label>
          ))}
        </div>
        <Button type="primary" htmlType="submit">
          Add Menu Item
        </Button>
      </form>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>{totalRow.amount}</Table.Summary.Cell>
            {people.map((person, index) => (
              <Table.Summary.Cell index={index+1} key={person}>
                {totalRow[person].toFixed(2)}
              </Table.Summary.Cell>
            ))}
          </Table.Summary.Row>
        )}
      />
    </>
  );
};

export default MenuForm;
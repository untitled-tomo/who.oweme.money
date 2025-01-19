import React, { memo, useState } from 'react';
import { Button, message, Steps, theme, Alert } from 'antd';
import PeopleForm from './PeopleForm';
import MenuForm from './MenuForm';

interface Props {}

const AlertStore = {
  MIN_2_PEOPLE: "Please enter at least 2 people",
  EMPTY_NAME: "Names cannot be empty",
  DUPLICATE_NAME: "Duplicate names are not allowed: ",
};

const Index: React.FC<Props> = memo(() => {
  const [names, setNames] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { token } = theme.useToken();


  const next = () => {
    if (current === 0) {
      if (names.length < 2) {
        setAlertMessage(AlertStore.MIN_2_PEOPLE);
        setAlertVisible(true);
        return;
      }
      if (names.some(name => name.trim() === '')) {
        setAlertMessage(AlertStore.EMPTY_NAME);
        setAlertVisible(true);
        return;
      }
      const nameCount = names.reduce((acc, name) => {
        const trimmedName = name.trim().toLowerCase();
        acc[trimmedName] = (acc[trimmedName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const duplicates = Object.keys(nameCount).filter(name => nameCount[name] > 1);
      if (duplicates.length > 0) {
        setAlertMessage(`${AlertStore.DUPLICATE_NAME} ${duplicates.join(', ')}`);
        setAlertVisible(true);
        return;
      }
    }
    setAlertVisible(false);
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'People',
      content: <PeopleForm setNames={setNames} nextStep={() => next()} />,
    },
    {
      title: 'Menu',
      content: <MenuForm people={names} />,
    },
    {
      title: 'Last',
      content: 'Last-content',
    },
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));


  return (
    <>
      <Steps
        type="navigation"
        current={current}
        items={items}
        direction="horizontal"
      />

      {alertVisible && (
        <Alert
          message="Error"
          description={alertMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={() => setAlertVisible(false)}
        />
      )}

      <div>{steps[current].content}</div>
      <div>
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => next()}
            disabled={current === 0 && names.length < 2}
          >
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
});

export default Index;
import React, { memo, Suspense , useState} from 'react'

import Box from '../../components/Box'
import Spinner from '../../components/Spinner'
import logo from '../../logo.svg'

import Counter from './Counter'
import DocList from './DocList'
import styles from './index.module.css'
import PeopleForm from './PeopleForm';
import MenuForm from './MenuForm';

interface Props {}

const Index: React.FC<Props> = memo(() => {
  const [names, setNames] = useState<string[]>([]);
  
  return (
    <>
      <Box>
        <h1 className={styles.h1}>I'm REACT_APP_TEXT from .env</h1>
        {/* <img src={logo} alt="react-logo" className="react-logo" /> */}
      </Box>
      <Box>
        <PeopleForm setNames={setNames} />
      </Box>
      <Box>
        <MenuForm people={names} />
      </Box>
    </>
  )
})
Index.displayName = 'Index'

export default Index

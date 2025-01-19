import type { PropsWithChildren } from 'react'
import React from 'react'
import { Flex, Layout as AntLayout } from 'antd'
// import { Col, Row } from 'antd';

import styles from './Layout.module.css'
const { Header, Footer, Sider, Content } = AntLayout

const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <AntLayout className={styles.layout} {...rest}>
      <Header style={{ color: 'white' }}>Header</Header>
      <Content  >
				<Flex align="start" justify="space-around" >
					<div>{children}</div>
				</Flex>
      </Content>
      <Footer>
				Footer
			</Footer>
    </AntLayout>
  )
}

export default Layout

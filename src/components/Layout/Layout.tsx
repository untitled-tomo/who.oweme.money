// import type { PropsWithChildren } from 'react'
// import React from 'react'
// import { Flex, Layout as AntLayout } from 'antd'
// // import { Col, Row } from 'antd';

// import styles from './Layout.module.css'
// const { Header, Footer, Sider, Content } = AntLayout

// const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
//   return (
//     <AntLayout className={styles.layout} {...rest}>
//       <Header style={{ color: 'white' }}>Header</Header>
//       <Content  >
// 				<Flex align="start" justify="space-around" >
// 					<div>{children}</div>
// 				</Flex>
//       </Content>
//       <Footer>
// 				Footer
// 			</Footer>
//     </AntLayout>
//   )
// }

// export default Layout

import type { PropsWithChildren } from 'react'
import React from 'react';
import { Flex, Layout as AntLayout } from 'antd';

const { Header, Footer, Sider, Content } = AntLayout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  // color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  // minHeight: 120,
  // color: '#fff',
  // backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  // color: '#fff',
  // backgroundColor: '#1677ff',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  // color: '#fff',
  // backgroundColor: '#4096ff',
};

const layoutStyle = {
  overflow: 'hidden',
  height:'100vh',
  backgroundColor: 'White',
  // width: 'calc(50% - 8px)',
  // maxWidth: 'calc(50% - 8px)',
};

const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (<Flex gap="middle" wrap>
    <AntLayout style={layoutStyle}>
      <Header style={headerStyle}>Header</Header>
      <Content style={contentStyle}>{children}</Content>
      {/* <Footer style={footerStyle}>Footer</Footer> */}
    </AntLayout>
  </Flex>
)
};

export default Layout;
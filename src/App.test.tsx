import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import App from './App'

test('Work App Component without error', () => {
  render(<App />)

  // expect(screen.getByText("Who.OweMe.Money")).toBeInTheDocument()
})

test('Working Landing Page', async () => {
  const user = userEvent.setup()
  const { getByText } = render(<App />)
  // expect(getByText('Who.OweMe.Money')).toBeInTheDocument()

  // const button = getByText(/Get Started \d/)

  // await user.click(button)
  // expect(getByText('Proceed')).toBeInTheDocument()

})

test('working with msw', async () => {
  render(<App />)

  // await waitFor(
  //   () => {
  //     expect(screen.getByText('MSW')).toBeInTheDocument()
  //     expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
  //   },
  //   { timeout: 5000 },
  // )
})

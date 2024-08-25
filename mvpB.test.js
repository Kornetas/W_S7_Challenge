import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Sprint 7 Challenge Learner Tests', () => {
  // TASK 1 - Unit Testing of sum function
  describe('sum function', () => {
    test('[1] throws an error when no arguments are provided', () => {
      expect(() => sum()).toThrow('pass valid numbers')
    })

    test('[2] throws an error when second argument is not a number', () => {
      expect(() => sum(2, 'seven')).toThrow('pass valid numbers')
    })

    test('[3] returns correct sum for two numbers', () => {
      expect(sum(1, 3)).toBe(4)
    })

    test('[4] returns correct sum for one number and one string representing a number', () => {
      expect(sum('1', 2)).toBe(3)
    })

    test('[5] returns correct sum for two strings representing numbers', () => {
      expect(sum('10', '3')).toBe(13)
    })
  })

  // TASK 2 - Integration Testing of HelloWorld component
  describe('<HelloWorld /> component', () => {
    beforeEach(() => {
      render(<HelloWorld />)
    })

    test('[1] renders a link that reads "Home"', () => {
      expect(screen.queryByText('Home')).toBeInTheDocument()
    })

    test('[2] renders a link that reads "About"', () => {
      expect(screen.queryByText('About')).toBeInTheDocument()
    })

    test('[3] renders a link that reads "Blog"', () => {
      expect(screen.queryByText('Blog')).toBeInTheDocument()
    })

    test('[4] renders a text that reads "The Truth"', () => {
      expect(screen.queryByText('The Truth')).toBeInTheDocument()
    })

    test('[5] renders a text that reads "JavaScript is pretty awesome"', () => {
      expect(screen.queryByText('JavaScript is pretty awesome')).toBeInTheDocument()
    })

    test('[6] renders a text that includes "javaScript is pretty"', () => {
      expect(screen.queryByText(/javaScript is pretty/i)).toBeInTheDocument()
    })
  })
})

// sum function implementation
function sum(a, b) {
  a = Number(a)
  b = Number(b)
  if (isNaN(a) || isNaN(b)) {
    throw new Error('pass valid numbers')
  }
  return a + b
}

// HelloWorld component implementation
function HelloWorld() {
  return (
    <div>
      <h1>Hello World Component</h1>
      <nav>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Blog</a>
      </nav>
      <main>
        <section>
          <h2>The Truth</h2>
          <p>JavaScript is pretty awesome</p>
        </section>
      </main>
    </div>
  )
}
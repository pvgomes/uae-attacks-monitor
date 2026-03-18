import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'

// Mock the dataService
vi.mock('../services/dataService', () => ({
  fetchAttackData: vi.fn(() => Promise.resolve([
    { date: '2024-01-01', uav: 10, cruise: 5, ballistic: 2 }
  ]))
}))

describe('Dashboard', () => {
  it('renders without crashing', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    // Check if loading text appears initially
    expect(screen.getByText('Loading attack data...')).toBeInTheDocument()
  })
})
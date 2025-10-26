import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

// Mock providers for testing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress error logs in tests
    },
  })

// Custom render function that includes all necessary providers
const AllTheProviders = ({
  children,
  queryClient = createTestQueryClient(),
  initialEntries = ['/']
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui,
  options = {}
) => {
  const { queryClient, initialEntries, ...renderOptions } = options

  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders queryClient={queryClient} initialEntries={initialEntries}>
        {props.children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything from RTL
export * from '@testing-library/react'
export { customRender as render }

// Common test utilities
export const createMockUser = (overrides = {}) => ({
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'student',
  ...overrides,
})

export const createMockCourse = (overrides = {}) => ({
  _id: 'course123',
  title: 'Test Course',
  code: 'TEST101',
  description: 'A test course',
  instructor: 'Test Instructor',
  credits: 3,
  status: 'active',
  ...overrides,
})

export const createMockAssignment = (overrides = {}) => ({
  _id: 'assignment123',
  title: 'Test Assignment',
  description: 'A test assignment',
  course: { title: 'Test Course' },
  dueDate: new Date().toISOString(),
  points: 100,
  submitted: false,
  ...overrides,
})

// Mock WebSocket context
export const createMockWebSocketContext = (overrides = {}) => ({
  socket: null,
  isConnected: false,
  notifications: [],
  markNotificationAsRead: vi.fn(),
  clearNotification: vi.fn(),
  clearAllNotifications: vi.fn(),
  emitEvent: vi.fn(),
  reconnectAttempts: 0,
  ...overrides,
})

// Wait for async operations to complete
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0))

// Mock API responses
export const mockApiResponse = (data) => ({
  data: { success: true, data },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
})

// Mock error API response
export const mockApiError = (message = 'API Error') => ({
  response: {
    data: { message },
    status: 400,
  },
})

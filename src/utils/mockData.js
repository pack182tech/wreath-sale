// Initialize mock data for local development
export const initializeMockData = () => {
  // Initialize scouts if not exists
  if (!localStorage.getItem('scouts')) {
    const scouts = [
      {
        id: 'scout-1',
        name: 'Tommy Anderson',
        slug: 'tommy-anderson',
        rank: 'Bear',
        parentName: 'John Anderson',
        parentEmail: 'john.anderson@email.com',
        active: true
      },
      {
        id: 'scout-2',
        name: 'Sarah Martinez',
        slug: 'sarah-martinez',
        rank: 'Wolf',
        parentName: 'Maria Martinez',
        parentEmail: 'maria.martinez@email.com',
        active: true
      },
      {
        id: 'scout-3',
        name: 'Michael Chen',
        slug: 'michael-chen',
        rank: 'Webelos',
        parentName: 'David Chen',
        parentEmail: 'david.chen@email.com',
        active: true
      },
      {
        id: 'scout-4',
        name: 'Emma Johnson',
        slug: 'emma-johnson',
        rank: 'Tiger',
        parentName: 'Lisa Johnson',
        parentEmail: 'lisa.johnson@email.com',
        active: true
      },
      {
        id: 'scout-5',
        name: 'Alex Rivera',
        slug: 'alex-rivera',
        rank: 'Arrow of Light',
        parentName: 'Carlos Rivera',
        parentEmail: 'carlos.rivera@email.com',
        active: true
      }
    ]
    localStorage.setItem('scouts', JSON.stringify(scouts))
  }

  // Initialize admin user if not exists
  if (!localStorage.getItem('users')) {
    const users = [
      {
        id: 'admin-1',
        email: 'admin@pack182.org',
        password: 'admin123', // In production, this would be hashed
        role: 'admin',
        name: 'Pack Leader'
      }
    ]
    localStorage.setItem('users', JSON.stringify(users))
  }

  // Initialize orders array if not exists
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]))
  }
}

export const getScouts = () => {
  return JSON.parse(localStorage.getItem('scouts') || '[]')
}

export const getOrders = () => {
  return JSON.parse(localStorage.getItem('orders') || '[]')
}

export const getUsers = () => {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

export const saveOrder = (order) => {
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))
  return order
}

export const updateOrder = (orderId, updates) => {
  const orders = getOrders()
  const index = orders.findIndex(o => o.orderId === orderId)
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates }
    localStorage.setItem('orders', JSON.stringify(orders))
    return orders[index]
  }
  return null
}

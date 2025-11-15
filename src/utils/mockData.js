// Initialize mock data for local development
export const initializeMockData = () => {
  // Initialize scouts - Pack 182 Real Scout Data (Force update to latest)
  // Always update scouts to ensure we have the latest roster
  const SCOUT_DATA_VERSION = '2.6'; // Increment this to force update all users
  const currentVersion = localStorage.getItem('scoutDataVersion');

  if (!localStorage.getItem('scouts') || currentVersion !== SCOUT_DATA_VERSION) {
    // Clear sessionStorage when data version changes to prevent stale cached names
    sessionStorage.clear()
    console.log('[MockData] Data version changed from', currentVersion, 'to', SCOUT_DATA_VERSION, '- cleared all storage')

    // PRIVACY: Only store minimal scout lookup data (slug -> name mapping)
    // Full scout details are not stored to protect privacy
    const scoutLookup = [{"id":"scout-1","name":"Jackson Haines","slug":"haines-jackson"},{"id":"scout-2","name":"Sahil Kalladeen","slug":"kalladeen-sahil"},{"id":"scout-3","name":"Raphael Kilanowski","slug":"kilanowski-raphael"},{"id":"scout-4","name":"Jacob Mcewan","slug":"mcewan-jacob"},{"id":"scout-5","name":"Clay Morgan Allen","slug":"morgan-allen-clay"},{"id":"scout-6","name":"Owen Mutz","slug":"mutz-owen"},{"id":"scout-7","name":"Maverick Uzarski","slug":"uzarski-maverick"},{"id":"scout-8","name":"Declan Canning","slug":"canning-declan"},{"id":"scout-9","name":"Will Cofoni","slug":"cofoni-will"},{"id":"scout-10","name":"Frank DaGraca","slug":"dagraca-frank"},{"id":"scout-11","name":"Wesley Hettenbach","slug":"hettenbach-wesley"},{"id":"scout-12","name":"Gabriel Kilanowski","slug":"kilanowski-gabriel"},{"id":"scout-13","name":"Levi Peterson","slug":"peterson-levi"},{"id":"scout-14","name":"Alexander Pidiath","slug":"pidiath-alexander"},{"id":"scout-15","name":"Nathan Shiminsky","slug":"shiminsky-nathan"},{"id":"scout-16","name":"Whitaker Thompson","slug":"thompson-whitaker"},{"id":"scout-17","name":"River Doherty","slug":"doherty-river"},{"id":"scout-18","name":"Russell Gregorio","slug":"gregorio-russell"},{"id":"scout-19","name":"Arlo Herman","slug":"herman-arlo"},{"id":"scout-20","name":"Zachery Hosgood","slug":"hosgood-zachery"},{"id":"scout-21","name":"Carter Molchan","slug":"molchan-carter"},{"id":"scout-22","name":"Matthew Serafyn","slug":"serafyn-matthew"},{"id":"scout-23","name":"Rory Sullivan","slug":"sullivan-rory"},{"id":"scout-24","name":"Jacob Waidelich","slug":"waidelich-jacob"},{"id":"scout-25","name":"Mason Brandt","slug":"brandt-mason"},{"id":"scout-26","name":"Logan Cambria","slug":"cambria-logan"},{"id":"scout-27","name":"SJ Cofoni","slug":"cofoni-sj"},{"id":"scout-28","name":"Ethan DaGraca","slug":"dagraca-ethan"},{"id":"scout-29","name":"Luca Facchina","slug":"facchina-luca"},{"id":"scout-30","name":"John Gamboa","slug":"gamboa-john"},{"id":"scout-31","name":"Parker Lutz-Polizzi","slug":"lutz-polizzi-parker"},{"id":"scout-32","name":"Alex Marsh","slug":"marsh-alex"},{"id":"scout-33","name":"Dylan McGowan","slug":"mcgowan-dylan"},{"id":"scout-34","name":"Declan Mest","slug":"mest-declan"},{"id":"scout-35","name":"Joshua Ranallo","slug":"ranallo-joshua"},{"id":"scout-36","name":"Anthony Serafyn","slug":"serafyn-anthony"},{"id":"scout-37","name":"Alistair Solberg","slug":"solberg-alistair"},{"id":"scout-38","name":"Quinn Wilson","slug":"wilson-quinn"},{"id":"scout-39","name":"Beau Conte","slug":"conte-beau"},{"id":"scout-40","name":"Henry Giroud","slug":"giroud-henry"},{"id":"scout-41","name":"Jack Mamay","slug":"mamay-jack"},{"id":"scout-42","name":"Julian Rodriguez","slug":"rodriguez-julian"},{"id":"scout-43","name":"Sam Rodriguez","slug":"rodriguez-sam"},{"id":"scout-44","name":"Garrett Thompson","slug":"thompson-garrett"},{"id":"scout-45","name":"Ronan Wallace","slug":"wallace-ronan"}]
    localStorage.setItem('scouts', JSON.stringify(scoutLookup))
    localStorage.setItem('scoutDataVersion', SCOUT_DATA_VERSION)
  }

  // Initialize admin and scout users if not exists
  if (!localStorage.getItem('users')) {
    const users = [
      {
        id: 'admin-1',
        email: 'admin@pack182.org',
        password: 'admin123', // In production, this would be hashed
        role: 'admin',
        name: 'Pack Leader'
      },
      {
        id: 'user-scout-1',
        email: 'tommy.anderson@email.com',
        password: 'scout123',
        role: 'scout',
        name: 'Tommy Anderson'
      },
      {
        id: 'user-scout-2',
        email: 'sarah.martinez@email.com',
        password: 'scout123',
        role: 'scout',
        name: 'Sarah Martinez'
      },
      {
        id: 'user-scout-3',
        email: 'michael.chen@email.com',
        password: 'scout123',
        role: 'scout',
        name: 'Michael Chen'
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

export const deleteOrder = (orderId) => {
  const orders = getOrders()
  const filtered = orders.filter(o => o.orderId !== orderId)
  localStorage.setItem('orders', JSON.stringify(filtered))
  return true
}

export const saveScout = (scout) => {
  const scouts = getScouts()
  const existing = scouts.findIndex(s => s.id === scout.id)

  if (existing !== -1) {
    scouts[existing] = scout
  } else {
    scouts.push(scout)
  }

  localStorage.setItem('scouts', JSON.stringify(scouts))
  return scout
}

export const deleteScout = (scoutId) => {
  const scouts = getScouts()
  const filtered = scouts.filter(s => s.id !== scoutId)
  localStorage.setItem('scouts', JSON.stringify(filtered))
  return true
}

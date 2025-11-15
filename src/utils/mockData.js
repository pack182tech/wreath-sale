// Initialize mock data for local development
export const initializeMockData = () => {
  // Initialize scouts - Pack 182 Real Scout Data (Force update to latest)
  // Always update scouts to ensure we have the latest roster
  const SCOUT_DATA_VERSION = '2.7'; // Increment this to force update all users
  const currentVersion = localStorage.getItem('scoutDataVersion');

  if (!localStorage.getItem('scouts') || currentVersion !== SCOUT_DATA_VERSION) {
    // Clear sessionStorage when data version changes to prevent stale cached names
    sessionStorage.clear()
    console.log('[MockData] Data version changed from', currentVersion, 'to', SCOUT_DATA_VERSION, '- cleared all storage')

    // Scout data with parent email addresses for order notifications
    const scoutLookup = [
  {
    id: "scout-1",
    name: "Mason Brandt",
    slug: "brandt-mason",
    parentEmails: []
  },
  {
    id: "scout-2",
    name: "Logan Cambria",
    slug: "cambria-logan",
    parentEmails: [
      "smithcambria2016@gmail.com"
    ]
  },
  {
    id: "scout-3",
    name: "Declan Canning",
    slug: "canning-declan",
    parentEmails: [
      "brittanycanning@gmail.com"
    ]
  },
  {
    id: "scout-4",
    name: "SJ Cofoni",
    slug: "cofoni-sj",
    parentEmails: [
      "jcofoni@gmail.com",
      "mille4ja@gmail.com"
    ]
  },
  {
    id: "scout-5",
    name: "Will Cofoni",
    slug: "cofoni-will",
    parentEmails: [
      "jcofoni@gmail.com",
      "mille4ja@gmail.com"
    ]
  },
  {
    id: "scout-6",
    name: "Beau Conte",
    slug: "conte-beau",
    parentEmails: [
      "mbodaj@comcast.net",
      "nconte0927@hotmail.com"
    ]
  },
  {
    id: "scout-7",
    name: "Ethan DaGraca",
    slug: "dagraca-ethan",
    parentEmails: [
      "cpdagraca@gmail.com"
    ]
  },
  {
    id: "scout-8",
    name: "Frank DaGraca",
    slug: "dagraca-frank",
    parentEmails: [
      "cpdagraca@gmail.com"
    ]
  },
  {
    id: "scout-9",
    name: "River Doherty",
    slug: "doherty-river",
    parentEmails: [
      "dohertym1@gmail.com"
    ]
  },
  {
    id: "scout-10",
    name: "Luca Facchina",
    slug: "facchina-luca",
    parentEmails: [
      "dianna.facchina@gmail.com"
    ]
  },
  {
    id: "scout-11",
    name: "John Gamboa",
    slug: "gamboa-john",
    parentEmails: [
      "lizneub@gmail.com",
      "Mr.pcg004@gmail.com"
    ]
  },
  {
    id: "scout-12",
    name: "Henry Giroud",
    slug: "giroud-henry",
    parentEmails: [
      "jason.giroud@gmail.com",
      "lgiroud81@gmail.com"
    ]
  },
  {
    id: "scout-13",
    name: "Russell Gregorio",
    slug: "gregorio-russell",
    parentEmails: [
      "ngregorio70@gmail.com"
    ]
  },
  {
    id: "scout-14",
    name: "Jackson Haines",
    slug: "haines-jackson",
    parentEmails: [
      "jessicarae.haines@yahoo.com"
    ]
  },
  {
    id: "scout-15",
    name: "Arlo Herman",
    slug: "herman-arlo",
    parentEmails: [
      "j.lucas.herman@gmail.com",
      "natalia.l.herman@gmail.com"
    ]
  },
  {
    id: "scout-16",
    name: "Wesley Hettenbach",
    slug: "hettenbach-wesley",
    parentEmails: [
      "marisahandren@gmail.com"
    ]
  },
  {
    id: "scout-17",
    name: "Zachery Hosgood",
    slug: "hosgood-zachery",
    parentEmails: [
      "hosgoods2017@gmail.com"
    ]
  },
  {
    id: "scout-18",
    name: "Sahil Kalladeen",
    slug: "kalladeen-sahil",
    parentEmails: [
      "ppkk02018@gmail.com"
    ]
  },
  {
    id: "scout-19",
    name: "Gabriel Kilanowski",
    slug: "kilanowski-gabriel",
    parentEmails: [
      "kilanowskifam@gmail.com"
    ]
  },
  {
    id: "scout-20",
    name: "Raphael Kilanowski",
    slug: "kilanowski-raphael",
    parentEmails: [
      "kilanowskifam@gmail.com"
    ]
  },
  {
    id: "scout-21",
    name: "Parker Lutz-Polizzi",
    slug: "lutz-polizzi-parker",
    parentEmails: [
      "biancapolizzi66@gmail.com"
    ]
  },
  {
    id: "scout-22",
    name: "Jack Mamay",
    slug: "mamay-jack",
    parentEmails: [
      "adriana.kuzyszyn@gmail.com"
    ]
  },
  {
    id: "scout-23",
    name: "Alex Marsh",
    slug: "marsh-alex",
    parentEmails: [
      "Joncmarsh19@gmail.com"
    ]
  },
  {
    id: "scout-24",
    name: "Jacob Mcewan",
    slug: "mcewan-jacob",
    parentEmails: [
      "yang.eva.yang@gmail.com"
    ]
  },
  {
    id: "scout-25",
    name: "Dylan McGowan",
    slug: "mcgowan-dylan",
    parentEmails: [
      "jimmcgowan@live.com",
      "khorbatt@gmail.com"
    ]
  },
  {
    id: "scout-26",
    name: "Declan Mest",
    slug: "mest-declan",
    parentEmails: [
      "jasonmest@gmail.com",
      "melissamest@gmail.com"
    ]
  },
  {
    id: "scout-27",
    name: "Carter Molchan",
    slug: "molchan-carter",
    parentEmails: [
      "chrismolchan@gmail.com"
    ]
  },
  {
    id: "scout-28",
    name: "Clay Morgan Allen",
    slug: "morgan-allen-clay",
    parentEmails: [
      "jamiemorgannj@yahoo.com"
    ]
  },
  {
    id: "scout-29",
    name: "Owen Mutz",
    slug: "mutz-owen",
    parentEmails: [
      "robmutz85@gmail.com"
    ]
  },
  {
    id: "scout-30",
    name: "Levi Peterson",
    slug: "peterson-levi",
    parentEmails: [
      "abaron26@gmail.com"
    ]
  },
  {
    id: "scout-31",
    name: "Alexander Pidiath",
    slug: "pidiath-alexander",
    parentEmails: [
      "jen.pidiath@gmail.com"
    ]
  },
  {
    id: "scout-32",
    name: "Joshua Ranallo",
    slug: "ranallo-joshua",
    parentEmails: [
      "ranallo.lee.j@gmail.com"
    ]
  },
  {
    id: "scout-33",
    name: "Julian Rodriguez",
    slug: "rodriguez-julian",
    parentEmails: [
      "evelynszabela@yahoo.com"
    ]
  },
  {
    id: "scout-34",
    name: "Sam Rodriguez",
    slug: "rodriguez-sam",
    parentEmails: [
      "briennerod@gmail.com",
      "coryrodriguez@gmail.com"
    ]
  },
  {
    id: "scout-35",
    name: "Anthony Serafyn",
    slug: "serafyn-anthony",
    parentEmails: [
      "jomauceri@gmail.com",
      "wserafyn@gmail.com"
    ]
  },
  {
    id: "scout-36",
    name: "Matthew Serafyn",
    slug: "serafyn-matthew",
    parentEmails: [
      "jomauceri@gmail.com",
      "wserafyn@gmail.com"
    ]
  },
  {
    id: "scout-37",
    name: "Nathan Shiminsky",
    slug: "shiminsky-nathan",
    parentEmails: [
      "matt.shiminsky@gmail.com"
    ]
  },
  {
    id: "scout-38",
    name: "Alistair Solberg",
    slug: "solberg-alistair",
    parentEmails: [
      "lambert7@tcnj.edu"
    ]
  },
  {
    id: "scout-39",
    name: "Rory Sullivan",
    slug: "sullivan-rory",
    parentEmails: [
      "daniel.sullivan72@gmail.com"
    ]
  },
  {
    id: "scout-40",
    name: "Garrett Thompson",
    slug: "thompson-garrett",
    parentEmails: [
      "bradthompson51@gmail.com",
      "nickithompson113@gmail.com"
    ]
  },
  {
    id: "scout-41",
    name: "Whitaker Thompson",
    slug: "thompson-whitaker",
    parentEmails: [
      "jake.taylor.thompson@gmail.com"
    ]
  },
  {
    id: "scout-42",
    name: "Maverick Uzarski",
    slug: "uzarski-maverick",
    parentEmails: [
      "genna.uzarski@gmail.com",
      "jonuzarski@gmail.com"
    ]
  },
  {
    id: "scout-43",
    name: "Jacob Waidelich",
    slug: "waidelich-jacob",
    parentEmails: [
      "tomwaidelich@gmail.com"
    ]
  },
  {
    id: "scout-44",
    name: "Ronan Wallace",
    slug: "wallace-ronan",
    parentEmails: [
      "kevinwallace01@gmail.com",
      "PTWallace34@gmail.com"
    ]
  },
  {
    id: "scout-45",
    name: "Quinn Wilson",
    slug: "wilson-quinn",
    parentEmails: [
      "theresaewilson@yahoo.com"
    ]
  }
]
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

  // Initialize configuration if not exists
  if (!localStorage.getItem('config')) {
    const config = {
      packName: 'Pack 182',
      theme: 'default'
    }
    localStorage.setItem('config', JSON.stringify(config))
  }
}

// Helper functions for accessing mock data
export const getUsers = () => {
  const users = localStorage.getItem('users')
  return users ? JSON.parse(users) : []
}

export const getScouts = () => {
  const scouts = localStorage.getItem('scouts')
  return scouts ? JSON.parse(scouts) : []
}

export const getOrders = () => {
  const orders = localStorage.getItem('orders')
  return orders ? JSON.parse(orders) : []
}

export const saveOrder = (order) => {
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))
  return order
}

export const saveScout = (scout) => {
  const scouts = getScouts()
  const existingIndex = scouts.findIndex(s => s.id === scout.id)
  if (existingIndex >= 0) {
    scouts[existingIndex] = scout
  } else {
    scouts.push(scout)
  }
  localStorage.setItem('scouts', JSON.stringify(scouts))
  return scout
}

export const updateOrder = (order) => {
  const orders = getOrders()
  const index = orders.findIndex(o => o.id === order.id)
  if (index >= 0) {
    orders[index] = order
    localStorage.setItem('orders', JSON.stringify(orders))
  }
  return order
}

export const deleteOrder = (orderId) => {
  const orders = getOrders()
  const filtered = orders.filter(o => o.id !== orderId)
  localStorage.setItem('orders', JSON.stringify(filtered))
}

export const deleteScout = (scoutId) => {
  const scouts = getScouts()
  const filtered = scouts.filter(s => s.id !== scoutId)
  localStorage.setItem('scouts', JSON.stringify(filtered))
}

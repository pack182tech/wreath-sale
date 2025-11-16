// ⚠️ ⚠️ ⚠️ DEPRECATED - DO NOT USE IN PRODUCTION ⚠️ ⚠️ ⚠️
// This file contains mock data for DEVELOPMENT/TESTING ONLY
// ALL production data comes from Google Sheets via Apps Script
// This code should NEVER execute in production builds

console.warn('❌ WARNING: mockData.js is loaded. This should NOT happen in production!')
console.warn('All data should come from Google Sheets via Apps Script')

// Initialize mock data for local development ONLY
export const initializeMockData = () => {
  console.error('❌ CRITICAL: initializeMockData() called! This should NOT happen in production!')
  console.error('Check that App.jsx is not calling this function')
  return // Exit immediately in production
  // Initialize scouts - Pack 182 Real Scout Data (Force update to latest)
  // Always update scouts to ensure we have the latest roster
  const SCOUT_DATA_VERSION = '3.1'; // Increment this to force update all users
  const currentVersion = localStorage.getItem('scoutDataVersion');

  if (!localStorage.getItem('scouts') || currentVersion !== SCOUT_DATA_VERSION) {
    // Clear sessionStorage when data version changes to prevent stale cached names
    sessionStorage.clear()
    console.log('[MockData] Data version changed from', currentVersion, 'to', SCOUT_DATA_VERSION, '- cleared all storage')

    // Scout data with parent email addresses for order notifications
    const scoutLookup = [
  {
    "id": "scout-1",
    "name": "Mason Brandt",
    "slug": "brandt-mason",
    "rank": "Bear",
    "email": "shaylynroll@yahoo.com",
    "parentName": "",
    "parentEmails": [],
    "active": true
  },
  {
    "id": "scout-2",
    "name": "Logan Cambria",
    "slug": "cambria-logan",
    "rank": "Bear",
    "email": "smithcambria2016@gmail.com",
    "parentName": "Rebecca",
    "parentEmails": [
      "smithcambria2016@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-3",
    "name": "Declan Canning",
    "slug": "canning-declan",
    "rank": "Tiger",
    "email": "",
    "parentName": "Brittany",
    "parentEmails": [
      "brittanycanning@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-4",
    "name": "SJ Cofoni",
    "slug": "cofoni-sj",
    "rank": "Bear",
    "email": "",
    "parentName": "James",
    "parentEmails": [
      "jcofoni@gmail.com",
      "mille4ja@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-5",
    "name": "Will Cofoni",
    "slug": "cofoni-will",
    "rank": "Tiger",
    "email": "",
    "parentName": "James",
    "parentEmails": [
      "jcofoni@gmail.com",
      "mille4ja@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-6",
    "name": "Beau Conte",
    "slug": "conte-beau",
    "rank": "Webelos",
    "email": "",
    "parentName": "Melissa",
    "parentEmails": [
      "mbodaj@comcast.net",
      "nconte0927@hotmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-7",
    "name": "Ethan DaGraca",
    "slug": "dagraca-ethan",
    "rank": "Bear",
    "email": "",
    "parentName": "Catherine",
    "parentEmails": [
      "cpdagraca@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-8",
    "name": "Frank DaGraca",
    "slug": "dagraca-frank",
    "rank": "Tiger",
    "email": "",
    "parentName": "Catherine",
    "parentEmails": [
      "cpdagraca@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-9",
    "name": "River Doherty",
    "slug": "doherty-river",
    "rank": "Wolf",
    "email": "dohertym1@gmail.com",
    "parentName": "Matthew",
    "parentEmails": [
      "dohertym1@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-10",
    "name": "Luca Facchina",
    "slug": "facchina-luca",
    "rank": "Bear",
    "email": "",
    "parentName": "Dianna",
    "parentEmails": [
      "dianna.facchina@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-11",
    "name": "John Gamboa",
    "slug": "gamboa-john",
    "rank": "Bear",
    "email": "",
    "parentName": "Elizabeth",
    "parentEmails": [
      "lizneub@gmail.com",
      "Mr.pcg004@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-12",
    "name": "Henry Giroud",
    "slug": "giroud-henry",
    "rank": "Webelos",
    "email": "",
    "parentName": "Jason",
    "parentEmails": [
      "jason.giroud@gmail.com",
      "lgiroud81@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-13",
    "name": "Russell Gregorio",
    "slug": "gregorio-russell",
    "rank": "Wolf",
    "email": "",
    "parentName": "Nicholas",
    "parentEmails": [
      "ngregorio70@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-14",
    "name": "Jackson Haines",
    "slug": "haines-jackson",
    "rank": "Lion",
    "email": "",
    "parentName": "Jessica",
    "parentEmails": [
      "jessicarae.haines@yahoo.com"
    ],
    "active": true
  },
  {
    "id": "scout-15",
    "name": "Arlo Herman",
    "slug": "herman-arlo",
    "rank": "Wolf",
    "email": "",
    "parentName": "Luke",
    "parentEmails": [
      "j.lucas.herman@gmail.com",
      "natalia.l.herman@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-16",
    "name": "Wesley Hettenbach",
    "slug": "hettenbach-wesley",
    "rank": "Tiger",
    "email": "",
    "parentName": "Marisa",
    "parentEmails": [
      "marisahandren@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-17",
    "name": "Zachery Hosgood",
    "slug": "hosgood-zachery",
    "rank": "Wolf",
    "email": "",
    "parentName": "Stefanie",
    "parentEmails": [
      "hosgoods2017@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-18",
    "name": "Sahil Kalladeen",
    "slug": "kalladeen-sahil",
    "rank": "Lion",
    "email": "",
    "parentName": "Priyanka",
    "parentEmails": [
      "ppkk02018@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-19",
    "name": "Gabriel Kilanowski",
    "slug": "kilanowski-gabriel",
    "rank": "Tiger",
    "email": "",
    "parentName": "Megan",
    "parentEmails": [
      "kilanowskifam@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-20",
    "name": "Raphael Kilanowski",
    "slug": "kilanowski-raphael",
    "rank": "Lion",
    "email": "",
    "parentName": "Megan",
    "parentEmails": [
      "kilanowskifam@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-21",
    "name": "Parker Lutz-Polizzi",
    "slug": "lutz-polizzi-parker",
    "rank": "Bear",
    "email": "biancapolizzi66@gmail.com",
    "parentName": "Bianca",
    "parentEmails": [
      "biancapolizzi66@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-22",
    "name": "Jack Mamay",
    "slug": "mamay-jack",
    "rank": "Webelos",
    "email": "adriana.kuzyszyn@gmail.com",
    "parentName": "Adriana",
    "parentEmails": [
      "adriana.kuzyszyn@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-23",
    "name": "Alex Marsh",
    "slug": "marsh-alex",
    "rank": "Bear",
    "email": "Joncmarsh19@gmail.com",
    "parentName": "John",
    "parentEmails": [
      "Joncmarsh19@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-24",
    "name": "Jacob Mcewan",
    "slug": "mcewan-jacob",
    "rank": "Lion",
    "email": "",
    "parentName": "Eva",
    "parentEmails": [
      "yang.eva.yang@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-25",
    "name": "Dylan McGowan",
    "slug": "mcgowan-dylan",
    "rank": "Bear",
    "email": "",
    "parentName": "James",
    "parentEmails": [
      "jimmcgowan@live.com",
      "khorbatt@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-26",
    "name": "Declan Mest",
    "slug": "mest-declan",
    "rank": "Bear",
    "email": "",
    "parentName": "Jason",
    "parentEmails": [
      "jasonmest@gmail.com",
      "melissamest@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-27",
    "name": "Carter Molchan",
    "slug": "molchan-carter",
    "rank": "Wolf",
    "email": "",
    "parentName": "Chris",
    "parentEmails": [
      "chrismolchan@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-28",
    "name": "Clay Morgan Allen",
    "slug": "morgan-allen-clay",
    "rank": "Lion",
    "email": "",
    "parentName": "Jamie",
    "parentEmails": [
      "jamiemorgannj@yahoo.com"
    ],
    "active": true
  },
  {
    "id": "scout-29",
    "name": "Owen Mutz",
    "slug": "mutz-owen",
    "rank": "Lion",
    "email": "",
    "parentName": "Robert",
    "parentEmails": [
      "robmutz85@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-30",
    "name": "Levi Peterson",
    "slug": "peterson-levi",
    "rank": "Tiger",
    "email": "",
    "parentName": "Ashley",
    "parentEmails": [
      "abaron26@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-31",
    "name": "Alexander Pidiath",
    "slug": "pidiath-alexander",
    "rank": "Tiger",
    "email": "",
    "parentName": "Jennifer",
    "parentEmails": [
      "jen.pidiath@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-32",
    "name": "Joshua Ranallo",
    "slug": "ranallo-joshua",
    "rank": "Bear",
    "email": "",
    "parentName": "Lee",
    "parentEmails": [
      "ranallo.lee.j@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-33",
    "name": "Julian Rodriguez",
    "slug": "rodriguez-julian",
    "rank": "Webelos",
    "email": "evelynszabela@yahoo.com",
    "parentName": "Evelyn",
    "parentEmails": [
      "evelynszabela@yahoo.com"
    ],
    "active": true
  },
  {
    "id": "scout-34",
    "name": "Sam Rodriguez",
    "slug": "rodriguez-sam",
    "rank": "Webelos",
    "email": "",
    "parentName": "Brienne",
    "parentEmails": [
      "briennerod@gmail.com",
      "coryrodriguez@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-35",
    "name": "Anthony Serafyn",
    "slug": "serafyn-anthony",
    "rank": "Bear",
    "email": "wserafyn@gmail.com",
    "parentName": "Josephine",
    "parentEmails": [
      "jomauceri@gmail.com",
      "wserafyn@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-36",
    "name": "Matthew Serafyn",
    "slug": "serafyn-matthew",
    "rank": "Wolf",
    "email": "wserafyn@gmail.com",
    "parentName": "Josephine",
    "parentEmails": [
      "jomauceri@gmail.com",
      "wserafyn@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-37",
    "name": "Nathan Shiminsky",
    "slug": "shiminsky-nathan",
    "rank": "Tiger",
    "email": "",
    "parentName": "Matt",
    "parentEmails": [
      "matt.shiminsky@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-38",
    "name": "Alistair Solberg",
    "slug": "solberg-alistair",
    "rank": "Bear",
    "email": "",
    "parentName": "Ashleigh",
    "parentEmails": [
      "lambert7@tcnj.edu"
    ],
    "active": true
  },
  {
    "id": "scout-39",
    "name": "Rory Sullivan",
    "slug": "sullivan-rory",
    "rank": "Wolf",
    "email": "daniel.sullivan72@gmail.com",
    "parentName": "Daniel",
    "parentEmails": [
      "daniel.sullivan72@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-40",
    "name": "Garrett Thompson",
    "slug": "thompson-garrett",
    "rank": "Webelos",
    "email": "",
    "parentName": "Brad",
    "parentEmails": [
      "bradthompson51@gmail.com",
      "nickithompson113@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-41",
    "name": "Whitaker Thompson",
    "slug": "thompson-whitaker",
    "rank": "Tiger",
    "email": "",
    "parentName": "Jake",
    "parentEmails": [
      "jake.taylor.thompson@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-42",
    "name": "Maverick Uzarski",
    "slug": "uzarski-maverick",
    "rank": "Lion",
    "email": "",
    "parentName": "Genna",
    "parentEmails": [
      "genna.uzarski@gmail.com",
      "jonuzarski@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-43",
    "name": "Jacob Waidelich",
    "slug": "waidelich-jacob",
    "rank": "Wolf",
    "email": "",
    "parentName": "Thomas",
    "parentEmails": [
      "tomwaidelich@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-44",
    "name": "Ronan Wallace",
    "slug": "wallace-ronan",
    "rank": "Webelos",
    "email": "",
    "parentName": "Kevin",
    "parentEmails": [
      "kevinwallace01@gmail.com",
      "PTWallace34@gmail.com"
    ],
    "active": true
  },
  {
    "id": "scout-45",
    "name": "Quinn Wilson",
    "slug": "wilson-quinn",
    "rank": "Bear",
    "email": "",
    "parentName": "Theresa",
    "parentEmails": [
      "theresaewilson@yahoo.com"
    ],
    "active": true
  }
]
    // Merge with existing scout data to preserve custom fields
    const existingScouts = JSON.parse(localStorage.getItem('scouts') || '[]')
    const mergedScouts = scoutLookup.map(newScout => {
      // Find existing scout data by ID
      const existing = existingScouts.find(s => s.id === newScout.id)
      if (existing) {
        // Merge: keep existing custom fields, update lookup fields
        return {
          ...existing,           // Keep all existing fields (rank, parentName, email, active, etc.)
          ...newScout,          // Update with new lookup data (name, slug, parentEmails)
        }
      }
      // New scout - add default fields
      return {
        ...newScout,
        rank: '',
        email: '',
        parentName: '',
        active: true
      }
    })

    localStorage.setItem('scouts', JSON.stringify(mergedScouts))
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

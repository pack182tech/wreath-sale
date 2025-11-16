// Initialize mock data for local development
export const initializeMockData = () => {
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
    "name": "Brandt, Mason",
    "slug": "brandt-mason",
    "rank": "Bear",
    "email": "shaylynroll@yahoo.com",
    "parentName": "",
    "parentEmails": [],
    "active": true
  },
  {
    "id": "scout-2",
    "name": "Cambria, Logan",
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
    "name": "Canning, Declan",
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
    "name": "Cofoni, SJ",
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
    "name": "Cofoni, Will",
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
    "name": "Conte, Beau",
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
    "name": "DaGraca, Ethan",
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
    "name": "DaGraca, Frank",
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
    "name": "Doherty, River",
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
    "name": "Facchina, Luca",
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
    "name": "Gamboa, John",
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
    "name": "Giroud, Henry",
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
    "name": "Gregorio, Russell",
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
    "name": "Haines, Jackson",
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
    "name": "Herman, Arlo",
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
    "name": "Hettenbach, Wesley",
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
    "name": "Hosgood, Zachery",
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
    "name": "Kalladeen, Sahil",
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
    "name": "Kilanowski, Gabriel",
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
    "name": "Kilanowski, Raphael",
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
    "name": "Lutz-Polizzi, Parker",
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
    "name": "Mamay, Jack",
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
    "name": "Marsh, Alex",
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
    "name": "Mcewan, Jacob",
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
    "name": "McGowan, Dylan",
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
    "name": "Mest, Declan",
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
    "name": "Molchan, Carter",
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
    "name": "Morgan Allen, Clay",
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
    "name": "Mutz, Owen",
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
    "name": "Peterson, Levi",
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
    "name": "Pidiath, Alexander",
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
    "name": "Ranallo, Joshua",
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
    "name": "Rodriguez, Julian",
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
    "name": "Rodriguez, Sam",
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
    "name": "Serafyn, Anthony",
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
    "name": "Serafyn, Matthew",
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
    "name": "Shiminsky, Nathan",
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
    "name": "Solberg, Alistair",
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
    "name": "Sullivan, Rory",
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
    "name": "Thompson, Garrett",
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
    "name": "Thompson, Whitaker",
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
    "name": "Uzarski, Maverick",
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
    "name": "Waidelich, Jacob",
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
    "name": "Wallace, Ronan",
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
    "name": "Wilson, Quinn",
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

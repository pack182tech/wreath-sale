// Initialize mock data for local development
export const initializeMockData = () => {
  // Initialize scouts if not exists - Pack 182 Real Scout Data
  if (!localStorage.getItem('scouts')) {
    const scouts = [{"id":"scout-1","name":"Haines, Jackson","slug":"haines-jackson","rank":"Lion","email":"","parentName":"Haines, Jessica","parentEmail":"","parents":[{"name":"Haines, Jessica","email":"","memberUrl":"https://pack182.mypack.us/member/1684"}],"memberUrl":"https://pack182.mypack.us/member/1683","active":true},{"id":"scout-2","name":"Kalladeen, Sahil","slug":"kalladeen-sahil","rank":"Lion","email":"","parentName":"Kalladeen, Priyanka","parentEmail":"","parents":[{"name":"Kalladeen, Priyanka","email":"","memberUrl":"https://pack182.mypack.us/member/1738"}],"memberUrl":"https://pack182.mypack.us/member/1737","active":true},{"id":"scout-3","name":"Kilanowski, Raphael","slug":"kilanowski-raphael","rank":"Lion","email":"","parentName":"Kilanowski, Megan","parentEmail":"","parents":[{"name":"Kilanowski, Megan","email":"","memberUrl":"https://pack182.mypack.us/member/1726"}],"memberUrl":"https://pack182.mypack.us/member/1725","active":true},{"id":"scout-4","name":"Mcewan, Jacob","slug":"mcewan-jacob","rank":"Lion","email":"","parentName":"Mcewan, Eva","parentEmail":"","parents":[{"name":"Mcewan, Eva","email":"","memberUrl":"https://pack182.mypack.us/member/1731"}],"memberUrl":"https://pack182.mypack.us/member/1730","active":true},{"id":"scout-5","name":"Morgan Allen, Clay","slug":"morgan-allen-clay","rank":"Lion","email":"","parentName":"Morgan, Jamie","parentEmail":"","parents":[{"name":"Morgan, Jamie","email":"","memberUrl":"https://pack182.mypack.us/member/1742"}],"memberUrl":"https://pack182.mypack.us/member/1741","active":true},{"id":"scout-6","name":"Mutz, Owen","slug":"mutz-owen","rank":"Lion","email":"","parentName":"Mutz, Robert","parentEmail":"","parents":[{"name":"Mutz, Robert","email":"","memberUrl":"https://pack182.mypack.us/member/1711"}],"memberUrl":"https://pack182.mypack.us/member/1710","active":true},{"id":"scout-7","name":"Uzarski, Maverick","slug":"uzarski-maverick","rank":"Lion","email":"","parentName":"Uzarski, Genna","parentEmail":"","parents":[{"name":"Uzarski, Genna","email":"","memberUrl":"https://pack182.mypack.us/member/1719"}],"memberUrl":"https://pack182.mypack.us/member/1718","active":true},{"id":"scout-8","name":"Canning, Declan","slug":"canning-declan","rank":"Tiger","email":"","parentName":"Canning, Brittany","parentEmail":"","parents":[{"name":"Canning, Brittany","email":"","memberUrl":"https://pack182.mypack.us/member/1715"}],"memberUrl":"https://pack182.mypack.us/member/1714","active":true},{"id":"scout-9","name":"Cofoni, Will","slug":"cofoni-will","rank":"Tiger","email":"","parentName":"Cofoni, James","parentEmail":"","parents":[{"name":"Cofoni, James","email":"","memberUrl":"https://pack182.mypack.us/member/1693"},{"name":"Cofoni, Jessica","email":"","memberUrl":"https://pack182.mypack.us/member/1692"}],"memberUrl":"https://pack182.mypack.us/member/1691","active":true},{"id":"scout-10","name":"DaGraca, Frank","slug":"dagraca-frank","rank":"Tiger","email":"","parentName":"DaGraca, Catherine","parentEmail":"","parents":[{"name":"DaGraca, Catherine","email":"","memberUrl":"https://pack182.mypack.us/member/1724"}],"memberUrl":"https://pack182.mypack.us/member/1723","active":true},{"id":"scout-11","name":"Hettenbach, Wesley","slug":"hettenbach-wesley","rank":"Tiger","email":"","parentName":"Hettenbach, Marisa","parentEmail":"","parents":[{"name":"Hettenbach, Marisa","email":"","memberUrl":"https://pack182.mypack.us/member/1717"}],"memberUrl":"https://pack182.mypack.us/member/1716","active":true},{"id":"scout-12","name":"Kilanowski, Gabriel","slug":"kilanowski-gabriel","rank":"Tiger","email":"","parentName":"Kilanowski, Megan","parentEmail":"","parents":[{"name":"Kilanowski, Megan","email":"","memberUrl":"https://pack182.mypack.us/member/1726"}],"memberUrl":"https://pack182.mypack.us/member/1729","active":true},{"id":"scout-13","name":"Peterson, Levi","slug":"peterson-levi","rank":"Tiger","email":"","parentName":"Peterson, Ashley","parentEmail":"","parents":[{"name":"Peterson, Ashley","email":"","memberUrl":"https://pack182.mypack.us/member/1735"}],"memberUrl":"https://pack182.mypack.us/member/1734","active":true},{"id":"scout-14","name":"Pidiath, Alexander","slug":"pidiath-alexander","rank":"Tiger","email":"","parentName":"Pidiath, Jennifer","parentEmail":"","parents":[{"name":"Pidiath, Jennifer","email":"","memberUrl":"https://pack182.mypack.us/member/1740"}],"memberUrl":"https://pack182.mypack.us/member/1739","active":true},{"id":"scout-15","name":"Shiminsky, Nathan","slug":"shiminsky-nathan","rank":"Tiger","email":"","parentName":"Shiminsky, Matt","parentEmail":"","parents":[{"name":"Shiminsky, Matt","email":"","memberUrl":"https://pack182.mypack.us/member/1728"}],"memberUrl":"https://pack182.mypack.us/member/1727","active":true},{"id":"scout-16","name":"Thompson, Whitaker","slug":"thompson-whitaker","rank":"Tiger","email":"","parentName":"Thompson, Jake","parentEmail":"","parents":[{"name":"Thompson, Jake","email":"","memberUrl":"https://pack182.mypack.us/member/1686"}],"memberUrl":"https://pack182.mypack.us/member/1685","active":true},{"id":"scout-17","name":"Doherty, River","slug":"doherty-river","rank":"Wolf","email":"","parentName":"Doherty, Matthew","parentEmail":"","parents":[{"name":"Doherty, Matthew","email":"","memberUrl":"https://pack182.mypack.us/member/1633"}],"memberUrl":"https://pack182.mypack.us/member/1632","active":true},{"id":"scout-18","name":"Gregorio, Russell","slug":"gregorio-russell","rank":"Wolf","email":"","parentName":"Gregorio, Nicholas","parentEmail":"","parents":[{"name":"Gregorio, Nicholas","email":"","memberUrl":"https://pack182.mypack.us/member/1658"}],"memberUrl":"https://pack182.mypack.us/member/1657","active":true},{"id":"scout-19","name":"Herman, Arlo","slug":"herman-arlo","rank":"Wolf","email":"","parentName":"Herman, Luke","parentEmail":"","parents":[{"name":"Herman, Luke","email":"","memberUrl":"https://pack182.mypack.us/member/1524"},{"name":"Herman, Natalia","email":"","memberUrl":"https://pack182.mypack.us/member/1525"}],"memberUrl":"https://pack182.mypack.us/member/1642","active":true},{"id":"scout-20","name":"Hosgood, Zachery","slug":"hosgood-zachery","rank":"Wolf","email":"","parentName":"Hosgood, Stefanie","parentEmail":"","parents":[{"name":"Hosgood, Stefanie","email":"","memberUrl":"https://pack182.mypack.us/member/1701"}],"memberUrl":"https://pack182.mypack.us/member/1700","active":true},{"id":"scout-21","name":"Molchan, Carter","slug":"molchan-carter","rank":"Wolf","email":"","parentName":"Molchan, Chris","parentEmail":"","parents":[{"name":"Molchan, Chris","email":"","memberUrl":"https://pack182.mypack.us/member/1733"}],"memberUrl":"https://pack182.mypack.us/member/1732","active":true},{"id":"scout-22","name":"Serafyn, Matthew","slug":"serafyn-matthew","rank":"Wolf","email":"","parentName":"Serafyn, Josephine","parentEmail":"","parents":[{"name":"Serafyn, Josephine","email":"","memberUrl":"https://pack182.mypack.us/member/1680"},{"name":"Serafyn, Walter","email":"","memberUrl":"https://pack182.mypack.us/member/1585"}],"memberUrl":"https://pack182.mypack.us/member/1643","active":true},{"id":"scout-23","name":"Sullivan, Rory","slug":"sullivan-rory","rank":"Wolf","email":"","parentName":"Sullivan, Daniel","parentEmail":"","parents":[{"name":"Sullivan, Daniel","email":"","memberUrl":"https://pack182.mypack.us/member/1673"},{"name":"Sullivan, Megan","email":"","memberUrl":"https://pack182.mypack.us/member/1674"}],"memberUrl":"https://pack182.mypack.us/member/1672","active":true},{"id":"scout-24","name":"Waidelich, Jacob","slug":"waidelich-jacob","rank":"Wolf","email":"","parentName":"Waidelich, Thomas","parentEmail":"","parents":[{"name":"Waidelich, Thomas","email":"","memberUrl":"https://pack182.mypack.us/member/1695"}],"memberUrl":"https://pack182.mypack.us/member/1694","active":true},{"id":"scout-25","name":"Brandt, Mason","slug":"brandt-mason","rank":"Bear","email":"","parentName":"","parentEmail":"","parents":[],"memberUrl":"https://pack182.mypack.us/member/1664","active":true},{"id":"scout-26","name":"Cambria, Logan","slug":"cambria-logan","rank":"Bear","email":"","parentName":"Cambria, Rebecca","parentEmail":"","parents":[{"name":"Cambria, Rebecca","email":"","memberUrl":"https://pack182.mypack.us/member/1671"}],"memberUrl":"https://pack182.mypack.us/member/1670","active":true},{"id":"scout-27","name":"Cofoni, SJ","slug":"cofoni-sj","rank":"Bear","email":"","parentName":"Cofoni, James","parentEmail":"","parents":[{"name":"Cofoni, James","email":"","memberUrl":"https://pack182.mypack.us/member/1693"},{"name":"Cofoni, Jessica","email":"","memberUrl":"https://pack182.mypack.us/member/1692"}],"memberUrl":"https://pack182.mypack.us/member/1690","active":true},{"id":"scout-28","name":"DaGraca, Ethan","slug":"dagraca-ethan","rank":"Bear","email":"","parentName":"DaGraca, Catherine","parentEmail":"","parents":[{"name":"DaGraca, Catherine","email":"","memberUrl":"https://pack182.mypack.us/member/1724"}],"memberUrl":"https://pack182.mypack.us/member/1722","active":true},{"id":"scout-29","name":"Facchina, Luca","slug":"facchina-luca","rank":"Bear","email":"","parentName":"Facchina, Dianna","parentEmail":"","parents":[{"name":"Facchina, Dianna","email":"","memberUrl":"https://pack182.mypack.us/member/1709"}],"memberUrl":"https://pack182.mypack.us/member/1708","active":true},{"id":"scout-30","name":"Gamboa, John","slug":"gamboa-john","rank":"Bear","email":"","parentName":"Gamboa, Elizabeth","parentEmail":"","parents":[{"name":"Gamboa, Elizabeth","email":"","memberUrl":"https://pack182.mypack.us/member/1713"},{"name":"Gamboa, Piercarlo","email":"","memberUrl":"https://pack182.mypack.us/member/1736"}],"memberUrl":"https://pack182.mypack.us/member/1712","active":true},{"id":"scout-31","name":"Lutz-Polizzi, Parker","slug":"lutz-polizzi-parker","rank":"Bear","email":"","parentName":"Lutz, Bianca","parentEmail":"","parents":[{"name":"Lutz, Bianca","email":"","memberUrl":"https://pack182.mypack.us/member/1655"}],"memberUrl":"https://pack182.mypack.us/member/1654","active":true},{"id":"scout-32","name":"Marsh, Alex","slug":"marsh-alex","rank":"Bear","email":"","parentName":"Marsh, John","parentEmail":"","parents":[{"name":"Marsh, John","email":"","memberUrl":"https://pack182.mypack.us/member/1631"}],"memberUrl":"https://pack182.mypack.us/member/1628","active":true},{"id":"scout-33","name":"McGowan, Dylan","slug":"mcgowan-dylan","rank":"Bear","email":"","parentName":"McGowan, James","parentEmail":"jimmcgowan@live.com","parents":[{"name":"McGowan, James","email":"jimmcgowan@live.com","memberUrl":"https://pack182.mypack.us/member/1586"},{"name":"McGowan, Katie","email":"khorbatt@gmail.com","memberUrl":"https://pack182.mypack.us/member/1682"}],"memberUrl":"https://pack182.mypack.us/member/1577","active":true},{"id":"scout-34","name":"Mest, Declan","slug":"mest-declan","rank":"Bear","email":"","parentName":"Mest, Jason","parentEmail":"","parents":[{"name":"Mest, Jason","email":"","memberUrl":"https://pack182.mypack.us/member/1596"},{"name":"Mest, Missy","email":"","memberUrl":"https://pack182.mypack.us/member/1597"}],"memberUrl":"https://pack182.mypack.us/member/1595","active":true},{"id":"scout-35","name":"Ranallo, Joshua","slug":"ranallo-joshua","rank":"Bear","email":"","parentName":"Ranallo, Lee","parentEmail":"","parents":[{"name":"Ranallo, Lee","email":"","memberUrl":"https://pack182.mypack.us/member/1601"}],"memberUrl":"https://pack182.mypack.us/member/1600","active":true},{"id":"scout-36","name":"Serafyn, Anthony","slug":"serafyn-anthony","rank":"Bear","email":"","parentName":"Serafyn, Josephine","parentEmail":"","parents":[{"name":"Serafyn, Josephine","email":"","memberUrl":"https://pack182.mypack.us/member/1680"},{"name":"Serafyn, Walter","email":"","memberUrl":"https://pack182.mypack.us/member/1585"}],"memberUrl":"https://pack182.mypack.us/member/1576","active":true},{"id":"scout-37","name":"Solberg, Alistair","slug":"solberg-alistair","rank":"Bear","email":"","parentName":"Solberg, Ashleigh","parentEmail":"","parents":[{"name":"Solberg, Ashleigh","email":"","memberUrl":"https://pack182.mypack.us/member/1721"}],"memberUrl":"https://pack182.mypack.us/member/1720","active":true},{"id":"scout-38","name":"Wilson, Quinn","slug":"wilson-quinn","rank":"Bear","email":"","parentName":"Wilson, Theresa","parentEmail":"","parents":[{"name":"Wilson, Theresa","email":"","memberUrl":"https://pack182.mypack.us/member/1697"}],"memberUrl":"https://pack182.mypack.us/member/1696","active":true},{"id":"scout-39","name":"Conte, Beau","slug":"conte-beau","rank":"Webelos","email":"","parentName":"Conte, Melissa","parentEmail":"","parents":[{"name":"Conte, Melissa","email":"","memberUrl":"https://pack182.mypack.us/member/1499"},{"name":"Conte, Nicholas","email":"","memberUrl":"https://pack182.mypack.us/member/1498"}],"memberUrl":"https://pack182.mypack.us/member/1555","active":true},{"id":"scout-40","name":"Giroud, Henry","slug":"giroud-henry","rank":"Webelos","email":"","parentName":"Giroud, Jason","parentEmail":"","parents":[{"name":"Giroud, Jason","email":"","memberUrl":"https://pack182.mypack.us/member/1561"},{"name":"Giroud, Lisa","email":"","memberUrl":"https://pack182.mypack.us/member/1562"}],"memberUrl":"https://pack182.mypack.us/member/1560","active":true},{"id":"scout-41","name":"Mamay, Jack","slug":"mamay-jack","rank":"Webelos","email":"","parentName":"Mamay, Adriana","parentEmail":"","parents":[{"name":"Mamay, Adriana","email":"","memberUrl":"https://pack182.mypack.us/member/1573"}],"memberUrl":"https://pack182.mypack.us/member/1572","active":true},{"id":"scout-42","name":"Rodriguez, Julian","slug":"rodriguez-julian","rank":"Webelos","email":"","parentName":"Rodriguez, Evelyn","parentEmail":"","parents":[{"name":"Rodriguez, Evelyn","email":"","memberUrl":"https://pack182.mypack.us/member/1575"}],"memberUrl":"https://pack182.mypack.us/member/1574","active":true},{"id":"scout-43","name":"Rodriguez, Sam","slug":"rodriguez-sam","rank":"Webelos","email":"","parentName":"Rodriguez, Brienne","parentEmail":"","parents":[{"name":"Rodriguez, Brienne","email":"","memberUrl":"https://pack182.mypack.us/member/1609"},{"name":"Rodriguez, Cory","email":"","memberUrl":"https://pack182.mypack.us/member/1610"}],"memberUrl":"https://pack182.mypack.us/member/1611","active":true},{"id":"scout-44","name":"Thompson, Garrett","slug":"thompson-garrett","rank":"Webelos","email":"","parentName":"Thompson, Brad","parentEmail":"","parents":[{"name":"Thompson, Brad","email":"","memberUrl":"https://pack182.mypack.us/member/1278"},{"name":"Thompson, Nicole","email":"","memberUrl":"https://pack182.mypack.us/member/1279"}],"memberUrl":"https://pack182.mypack.us/member/1540","active":true},{"id":"scout-45","name":"Wallace, Ronan","slug":"wallace-ronan","rank":"Webelos","email":"","parentName":"Wallace, Kevin","parentEmail":"","parents":[{"name":"Wallace, Kevin","email":"","memberUrl":"https://pack182.mypack.us/member/1539"},{"name":"Wallace, Trish","email":"","memberUrl":"https://pack182.mypack.us/member/1679"}],"memberUrl":"https://pack182.mypack.us/member/1538","active":true}]
    localStorage.setItem('scouts', JSON.stringify(scouts))
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

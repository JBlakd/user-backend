// formula taken from https://www.movable-type.co.uk/scripts/latlong.html

// returns distance in meters
const distanceBetweenCoordinates = (lat1, long1, lat2, long2) => {
  const phi1 = lat1 * Math.PI / 180, phi2 = lat2 * Math.PI / 180, deltaλ = (long2 - long1) * Math.PI / 180, R = 6371e3
  const d = Math.acos(Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaλ)) * R
  return d
}

module.exports = {
  distanceBetweenCoordinates
}
import { getDistanceBetweenPoints } from './geolocation';

const point1 = { latitude: 55.6817, longitude: 37.5154 };
const point2 = { latitude: 55.7445, longitude: 37.7184 };

describe('алгоритм', () => {
  test('getDistanceBetweenPoints', () => {
    expect(getDistanceBetweenPoints(
      { type: "Point", coordinates: [point1.longitude, point1.latitude] },
      { type: "Point", coordinates: [point2.longitude, point2.latitude] },
    ).toFixed()).toBe('14507')
  })
})
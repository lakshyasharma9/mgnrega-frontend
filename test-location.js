// Simple test script for location detection
const axios = require('axios');

async function testLocationDetection() {
  console.log('🧪 Testing Location Detection...\n');
  
  const testCoordinates = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 }
  ];

  for (const coord of testCoordinates) {
    try {
      console.log(`📍 Testing ${coord.name}:`);
      
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: coord.lat,
          lon: coord.lng,
          format: 'json',
          addressdetails: 1,
          zoom: 10
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'MGNREGA-Dashboard/1.0'
        }
      });

      if (response.data && response.data.address) {
        const address = response.data.address;
        const district = address.state_district || address.county || address.city || address.town;
        const state = address.state;
        
        console.log(`   ✅ District: ${district}`);
        console.log(`   ✅ State: ${state}`);
        console.log(`   ✅ Full: ${response.data.display_name}`);
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }
  
  console.log('🏁 Test completed!');
}

testLocationDetection();
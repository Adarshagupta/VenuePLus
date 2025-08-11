async function testPackageFlow() {
  console.log('🧪 TESTING PACKAGE BOOKING FLOW\n')
  
  const packageIds = [
    'golden-triangle-premium',
    'kerala-backwaters-hills', 
    'rajasthan-royal-heritage',
    'goa-beaches-portuguese',
    'ladakh-adventure-mountains',
    'himachal-hill-stations'
  ]
  
  console.log('🔍 Testing package API endpoints...\n')
  
  for (const packageId of packageIds) {
    try {
      console.log(`Testing package: ${packageId}`)
      
      const response = await fetch(`http://localhost:3000/api/packages/${packageId}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ ${data.name} - ₹${data.price} - ${data.duration}`)
      } else {
        console.log(`❌ Error ${response.status}: Package not found`)
      }
    } catch (error) {
      console.log(`💥 Network error: ${error.message}`)
    }
  }
  
  console.log('\n📋 Test booking URLs:')
  packageIds.forEach((packageId, index) => {
    const homepageId = index + 1
    console.log(`${homepageId}. /book-package?packageId=${packageId}`)
  })
  
  console.log('\n🚀 Manual Test Steps:')
  console.log('1. Visit: http://localhost:3000')
  console.log('2. Click on any destination card to view package details')
  console.log('3. Click "BOOK PACKAGE" button')
  console.log('4. Should redirect to booking page with proper package details')
  console.log('5. Complete the booking flow with test payment')
  
  console.log('\n✅ All packages should load without "Package not found" error!')
}

testPackageFlow()


const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:5000');
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

async function runDemoFlowTest() {
  console.log('🚀 Starting NoWaste Canteen End-to-End Demo Flow Verification...\n');

  // 1. Login as Canteen Admin
  console.log('Step 1: Authenticating as Canteen Admin (canteen@nowaste.com)...');
  const adminLogin = await request('/api/auth/login', 'POST', {
    email: 'canteen@nowaste.com',
    password: 'canteen123'
  });
  if (adminLogin.status !== 200) throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.body));
  const adminToken = adminLogin.body.token;
  console.log(`✅ Admin logged in: ${adminLogin.body.user.name} (${adminLogin.body.user.role})`);

  // 2. Post Surplus Food
  console.log('\nStep 2: Canteen Admin posting surplus food (Vegetable Biryani, 20 portions)...');
  const futureExpiry = new Date(Date.now() + 4 * 3600000).toISOString();
  const postRes = await request('/api/food', 'POST', {
    name: 'Vegetable Biryani (Demo Batch)',
    description: 'Freshly prepared aromatic basmati biryani with spiced vegetables.',
    category: 'Main Course',
    quantity: 20,
    unit: 'portions',
    dietType: 'veg',
    pickupLocation: 'Main Canteen Counter 3',
    canteen: 'Main Campus Canteen',
    expiryTime: futureExpiry,
    allergenInfo: 'Vegetarian. Dairy in raita.'
  }, adminToken);

  if (postRes.status !== 201) throw new Error('Post food failed: ' + JSON.stringify(postRes.body));
  const createdFood = postRes.body.food;
  console.log(`✅ Surplus food posted successfully: ID=${createdFood.id}, Quantity=${createdFood.quantity} portions`);

  // 3. Verify Food Listing
  console.log('\nStep 3: Checking Available Food listing...');
  const foodListRes = await request('/api/food?search=Demo Batch');
  const found = foodListRes.body.foods.find(f => f.id === createdFood.id);
  if (!found) throw new Error('Created food not found in public surplus feed!');
  console.log(`✅ Verified in public feed: "${found.name}" is ${found.status} with ${found.quantity} portions`);

  // 4. Record Impact metrics before claim
  const impactBefore = await request('/api/impact');
  const mealsBefore = impactBefore.body.impact.mealsSaved;
  console.log(`\nStep 4: Initial meals saved metric = ${mealsBefore}`);

  // 5. Login as Student
  console.log('\nStep 5: Authenticating as Student (student@nowaste.com)...');
  const studentLogin = await request('/api/auth/login', 'POST', {
    email: 'student@nowaste.com',
    password: 'student123'
  });
  if (studentLogin.status !== 200) throw new Error('Student login failed: ' + JSON.stringify(studentLogin.body));
  const studentToken = studentLogin.body.token;
  console.log(`✅ Student logged in: ${studentLogin.body.user.name}, Initial Points=${studentLogin.body.user.points}`);

  // 6. Student claims 2 portions
  console.log('\nStep 6: Student claiming 2 portions of Vegetable Biryani...');
  const claimRes = await request('/api/claims', 'POST', {
    foodId: createdFood.id,
    quantity: 2
  }, studentToken);

  if (claimRes.status !== 201) throw new Error('Claim food failed: ' + JSON.stringify(claimRes.body));
  const claim = claimRes.body.claim;
  console.log(`✅ Claim Confirmed!`);
  console.log(`   - Digital Claim ID: ${claim.claimId}`);
  console.log(`   - Food: ${claim.foodName}`);
  console.log(`   - Claimed Portions: ${claim.quantity}`);
  console.log(`   - Pickup Location: ${claim.pickupLocation}`);
  console.log(`   - Points Earned: +${claimRes.body.pointsEarned} pts (Total: ${claimRes.body.totalPoints})`);

  // 7. Verify atomic quantity decrement: 20 -> 18
  console.log('\nStep 7: Verifying available quantity updated 20 -> 18...');
  const verifyFood = await request(`/api/food/${createdFood.id}`);
  const remainingQty = verifyFood.body.food.quantity;
  console.log(`   - Available quantity is now: ${remainingQty}`);
  if (remainingQty !== 18) {
    throw new Error(`Data consistency failure! Expected 18 portions, but found ${remainingQty}`);
  }
  console.log('✅ Quantity accurately updated 20 -> 18!');

  // 8. Verify My Claims list
  console.log('\nStep 8: Checking My Claims records...');
  const myClaimsRes = await request('/api/claims/my', 'GET', null, studentToken);
  const myClaim = myClaimsRes.body.claims.find(c => c.claimId === claim.claimId);
  if (!myClaim) throw new Error('New claim missing from student claims list!');
  console.log(`✅ Found claim ${myClaim.claimId} in My Claims with status: ${myClaim.status}`);

  // 9. Verify Impact Dashboard updated
  console.log('\nStep 9: Verifying Impact Dashboard real-time calculation...');
  const impactAfter = await request('/api/impact');
  const mealsAfter = impactAfter.body.impact.mealsSaved;
  console.log(`   - Meals saved updated from ${mealsBefore} -> ${mealsAfter}`);
  if (mealsAfter !== mealsBefore + 2) {
    throw new Error(`Impact metric calculation error! Expected ${mealsBefore + 2}, got ${mealsAfter}`);
  }
  console.log(`✅ Impact metrics dynamically updated! (+2 meals saved, waste prevented: ${impactAfter.body.impact.foodRescuedKg} kg)`);

  // 10. Test overclaiming prevention
  console.log('\nStep 10: Testing data consistency (claiming 25 portions when only 18 exist)...');
  const overclaimRes = await request('/api/claims', 'POST', {
    foodId: createdFood.id,
    quantity: 25
  }, studentToken);
  if (overclaimRes.status === 400) {
    console.log(`✅ Correctly rejected invalid claim: "${overclaimRes.body.message}"`);
  } else {
    throw new Error('Overclaim was improperly permitted!');
  }

  console.log('\n🎉 ALL 10 STEPS OF THE CORE DEMO FLOW PASSED WITH 100% SUCCESS!');
}

runDemoFlowTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

const BASE_URL = "http://localhost:3000/api/v1";

async function testAuth() {
  console.log("🚀 Starting Auth Flow Verification...");

  try {
    const user = {
      email: `test_${Date.now()}@example.com`,
      username: `tester_${Date.now()}`,
      password: "Password123!"
    };

    console.log(`\n--- Testing Registration ---`);
    const registerResp = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    
    const regData = await registerResp.json();
    if (registerResp.status !== 201) {
      console.error("❌ Registration failed:", regData);
      return;
    }
    console.log("✅ Registration successful");

    console.log(`\n--- Testing Login ---`);
    const loginResp = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: user.password })
    });
    
    const loginData = await loginResp.json();
    if (loginResp.status !== 200) {
      console.error("❌ Login failed:", loginData);
      return;
    }
    console.log("✅ Login successful");
    console.log("User:", loginData.data.user.username);

    console.log(`\n🏁 Auth Verification Complete!`);

  } catch (error) {
    console.error("💥 Auth test crashed:", error);
  }
}

testAuth();

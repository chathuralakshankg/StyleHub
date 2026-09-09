async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dev@stylehub.com', password: 'developer123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const form = new FormData();
    const fs = require('fs');
    form.append('name', 'Test Product Real Image');
    form.append('category', 'Menswear');
    form.append('subCategory', 'Shirts');
    form.append('fabric', '100% Cotton');
    form.append('price', '100');
    form.append('variants', JSON.stringify([{size: 'M', color: 'Red', stock: 10}]));
    form.append('images', new Blob([fs.readFileSync('test.png')]), 'test.png');

    const productRes = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });
    
    if (productRes.ok) {
        const productData = await productRes.json();
        console.log("Product created successfully:", productData);
    } else {
        const errorText = await productRes.text();
        console.error("Product creation failed! Status:", productRes.status);
        console.error("Error response:", errorText);
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testApi();

const API_BASE = 'http://localhost:5000';

async function test() {
  try {
    const res = await fetch(`${API_BASE}/api/categories/with-counts`);
    const data = await res.json();
    console.log('API categories count:', data.categories ? data.categories.length : 'none');
    console.log('Total medicines count:', data.totalCount);
    console.log('Flash count:', data.flashCount);
    if (data.categories) {
      console.log('Samples:');
      data.categories.slice(0, 5).forEach(c => {
        console.log(`- Category: ${c.name}, Count: ${c.count}, IconName: ${c.iconName}`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();

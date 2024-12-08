const { executeQueryWithParams } = require('./config/db');

// Fungsi untuk mendapatkan pengguna dari database
async function getUserFromDb(username, password) {
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const params = [username, password];  // Menyediakan parameter untuk query
  const result = await executeQueryWithParams(query, params);
  return result[0]; // Mengembalikan user pertama jika ditemukan
}

// Fungsi untuk mendapatkan data emisi karbon berdasarkan user_id
async function getUserCarbonEmission(user_id) {
    const query = 'SELECT * FROM carbon_emission WHERE user_id = ?';
    const results = await executeQueryWithParams(query, [user_id]);
    if (results.length === 0) {
      return null; // Tidak ada data emisi karbon untuk user_id ini
    }
    return results[0]; // Mengembalikan data emisi karbon pertama yang ditemukan
  }

// Fungsi untuk menyimpan data emisi karbon ke dalam database
async function addCarbonEmission(user_id, emissionData) {
  const query = `INSERT INTO carbons 
                 (electricity, gas, transportation, food_type, food, organic_waste, inorganic_waste, carbon_footprint, user_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    emissionData.electricity,
    emissionData.gas,
    emissionData.transportation,
    emissionData.food_type,
    emissionData.food,
    emissionData.organic_waste,
    emissionData.inorganic_waste,
    emissionData.carbon_footprint,
    user_id
  ];

  await executeQueryWithParams(query, params);
}

// Fungsi untuk memperbarui data emisi karbon berdasarkan user_id
async function updateCarbonEmission(user_id, emissionData) {
  const query = `UPDATE carbons SET 
                 electricity = ?, gas = ?, transportation = ?, food_type = ?, 
                 food = ?, organic_waste = ?, inorganic_waste = ?, carbon_footprint = ?
                 WHERE user_id = ?`;

  const params = [
    emissionData.electricity,
    emissionData.gas,
    emissionData.transportation,
    emissionData.food_type,
    emissionData.food,
    emissionData.organic_waste,
    emissionData.inorganic_waste,
    emissionData.carbon_footprint,
    user_id
  ];

  await executeQueryWithParams(query, params);
}

module.exports = {
  getUserFromDb,
  getUserCarbonEmission,
  addCarbonEmission,
  updateCarbonEmission
};
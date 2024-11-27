const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserFromDb, addCarbonEmission, updateCarbonEmission, getUserCarbonEmission } = require('./carbon');

// Fungsi untuk login pengguna
async function loginHandler(req, res) {
  const { username, password } = req.body;

  try {
    const user = /*{
      username: 'Fazza', password: 'Fazza123'
    };*/
    await getUserFromDb(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Membuat token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Fungsi untuk menambah atau memperbarui data emisi karbon
async function carbonEmissionHandler(req, res) {
  const { user_id, emissionData } = req.body; // Mengambil data user_id dan emissionData dari request body

  try {
    // Cek apakah data emisi karbon sudah ada untuk user tersebut
    const existingData = await getUserCarbonEmission(user_id);

    if (existingData.length > 0) {
      // Jika data sudah ada, lakukan pembaruan
      await updateCarbonEmission(user_id, emissionData);
      res.status(200).json({ message: 'Carbon emission data updated successfully' });
    } else {
      // Jika data belum ada, simpan data baru
      await addCarbonEmission(user_id, emissionData);
      res.status(200).json({ message: 'Carbon emission data added successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fungsi untuk menampilkan data emisi karbon berdasarkan user_id
async function getCarbonEmissionHandler(req, res) {
  const { user_id } = req.params; // Mengambil user_id dari parameter URL

  try {
    // Mengambil data emisi karbon dari database berdasarkan user_id
    const emissionData = await getUserCarbonEmission(user_id);

    if (!emissionData) {
      return res.status(404).json({ message: 'Carbon emission data not found for this user' });
    }

    res.status(200).json({
      message: 'Carbon emission data retrieved successfully',
      data: emissionData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  loginHandler,
  carbonEmissionHandler,
  getCarbonEmissionHandler
};

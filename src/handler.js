const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserFromDb, addCarbonEmission, updateCarbonEmission, getUserCarbonEmission } = require('./carbon.js');
const userModel = require('./userTable.js')

const getUser = async (req, res) => {
    const { id, name } = req.query; // Using query parameters for flexibility
    try {
        if (!id && !name) {
            return res.status(400).json({
                message: 'Please provide either id or name.',
            });
        }

        const [user] = await userModel.getUserByIdOrName(id || null, name || null);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.json({
            message: 'GET user success',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error while retrieving user',
            serverMessage: error.message,
        });
    }
};

const createNewUser = async (req, res) => {
    const { body } = req;
    // Validate request body
    if (!body.name || !body.email) {
        return res.status(400).json({
            message: 'Name and Email are required.',
        });
    }
    try {
        await userModel.createNewUser(body);
        res.status(201).json({
            message: 'CREATE new user success',
            data: body,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error while creating user',
            serverMessage: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json({
            message: 'User ID is required to update.',
        });
    }

    // Validate update fields
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            message: 'No data provided to update.',
        });
    }

    try {
        const userExists = await userModel.getUserByIdOrName(id, null);
        if (!userExists[0]) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        await userModel.updateUser(body, id);
        res.json({
            message: 'UPDATE user success',
            data: {
                id,
                ...body,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error while updating user',
            serverMessage: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: 'User ID is required to delete.',
        });
    }

    try {
        const userExists = await userModel.getUserByIdOrName(id, null);
        if (!userExists[0]) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        await userModel.deleteUser(id);
        res.status(204).json({
            message: 'DELETE user success',
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error while deleting user',
            serverMessage: error.message,
        });
    }
};

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
  getCarbonEmissionHandler,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
};

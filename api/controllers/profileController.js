// controllers/profileController.js
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        id: user._id,
        name: `${user.firstname} ${user.lastname}`.trim(),  //  combine first & last names
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        profileImage: user.profileImage ? `/uploads/profiles/${user.profileImage}` : null
        });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
    console.log(' updateProfile route hit');
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, address } = req.body;let firstname = '';
        let lastname = '';

        if (name) {
        const parts = name.trim().split(' ');
        firstname = parts.shift() || '';
        lastname = parts.join(' ') || '';
        }

    const updateData = { firstname, lastname, phone, address };

    // If file was uploaded, add profile image filename
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const fullName = `${user.firstname} ${user.lastname}`;
   res.json({
    message: 'Profile updated successfully',
    user: {
        id: user._id,
        name: fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        profileImage: user.profileImage ? `/uploads/profiles/${user.profileImage}` : null
    }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
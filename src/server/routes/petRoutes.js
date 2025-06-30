// ... existing code ...

const nodemailer = require('nodemailer');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true }, // user email
  message: { type: String, required: true },
  type: { type: String, enum: ['accepted', 'rejected'], required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

// Pet Schema (add this above all routes)
const petSchema = new mongoose.Schema({
  name: String,
  category: String,
  age: String,
  location: String,
  image: String,
  ownerEmail: String,
  userEmail: String, // requester
  userName: String, // requester
  userAddress: String, // requester
  phone: String, // requester
  adopt_Req: { type: Boolean, default: false },
  adopt_Status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  adopted: { type: Boolean, default: false },
  // ... any other fields you use
});
const Pet = mongoose.models.Pet || mongoose.model('Pet', petSchema);

// ... existing code ...

// Add this new route
router.post('/match', async (req, res) => {
  try {
    const { living_situation, time_availability, experience, preferred_traits, pet_type } = req.body;
    
    // Get all available pets
    const pets = await Pet.find({ adopted: false });
    
    // Score each pet based on user preferences
    const scoredPets = pets.map(pet => {
      let score = 0;
      
      // Match pet type
      if (pet.category.toLowerCase() === pet_type) {
        score += 3;
      }
      
      // Match living situation
      if (pet.category.toLowerCase() === 'dog' && living_situation === 'house') {
        score += 2;
      } else if (pet.category.toLowerCase() === 'cat' && (living_situation === 'apartment' || living_situation === 'condo')) {
        score += 2;
      } else if (pet.category.toLowerCase() === 'bird' && (living_situation === 'apartment' || living_situation === 'condo')) {
        score += 2;
      } else if (pet.category.toLowerCase() === 'rabbit' && (living_situation === 'apartment' || living_situation === 'house')) {
        score += 2;
      }
      
      // Match time availability
      if (time_availability === 'high' && (pet.category.toLowerCase() === 'dog' || pet.category.toLowerCase() === 'bird')) {
        score += 2;
      } else if (time_availability === 'low' && (pet.category.toLowerCase() === 'cat' || pet.category.toLowerCase() === 'rabbit')) {
        score += 2;
      }
      
      // Match experience level
      if (experience === 'experienced' && (pet.category.toLowerCase() === 'dog' || pet.category.toLowerCase() === 'bird')) {
        score += 2;
      } else if (experience === 'none' && (pet.category.toLowerCase() === 'cat' || pet.category.toLowerCase() === 'rabbit')) {
        score += 2;
      }
      
      // Match preferred traits
      if (preferred_traits === 'calm' && (pet.category.toLowerCase() === 'cat' || pet.category.toLowerCase() === 'rabbit')) {
        score += 2;
      } else if (preferred_traits === 'playful' && (pet.category.toLowerCase() === 'dog' || pet.category.toLowerCase() === 'bird')) {
        score += 2;
      } else if (preferred_traits === 'independent' && (pet.category.toLowerCase() === 'cat' || pet.category.toLowerCase() === 'bird')) {
        score += 2;
      } else if (preferred_traits === 'affectionate' && (pet.category.toLowerCase() === 'dog' || pet.category.toLowerCase() === 'rabbit')) {
        score += 2;
      }
      
      return { ...pet.toObject(), matchScore: score };
    });
    
    // Sort pets by match score
    const matchedPets = scoredPets
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6) // Return top 6 matches
      .map(({ matchScore, ...pet }) => pet); // Remove matchScore from response
    
    res.json(matchedPets);
  } catch (error) {
    console.error('Error matching pets:', error);
    res.status(500).json({ message: 'Error matching pets' });
  }
});

// Email notification route
router.post('/send-notification', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    // Create a test account on Ethereal Email
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter using Ethereal Email credentials
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // Send the email
    const info = await transporter.sendMail({
      from: '"Pet Adoption Platform" <foo@example.com>',
      to,
      subject,
      text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #444;">${subject}</h2>
        <p style="color: #666;">${text}</p>
        <hr>
        <p style="color: #888; font-size: 12px;">This is an automated message from the Pet Adoption Platform.</p>
      </div>`
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    // Create a notification record
    const notification = new Notification({
      recipient: to,
      message: text,
      type: subject.toLowerCase().includes('accepted') ? 'accepted' : 'rejected'
    });
    await notification.save();

    res.json({ 
      success: true, 
      previewUrl: nodemailer.getTestMessageUrl(info),
      message: 'Email sent successfully and notification created'
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a notification
router.post('/notifications', async (req, res) => {
  try {
    const { recipient, message, type } = req.body;
    const notification = new Notification({ recipient, message, type });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notifications for a user
router.get('/notifications/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({ recipient: email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept adoption request
router.patch('/admin/accept/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Update the adoption request status
    const result = await Pet.updateOne(
      { _id: id },
      { $set: { adopt_Status: 'accepted', adopted: true, adopt_Req: false } }
    );
    res.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject adoption request
router.patch('/admin/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Update the adoption request status
    const result = await Pet.updateOne(
      { _id: id },
      { $set: { adopt_Status: 'rejected', adopt_Req: false } }
    );
    res.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH route to update adopted status (or any field) of a pet
router.patch('/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const result = await Pet.findByIdAndUpdate(id, update, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ... existing code ... 
const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");


router.get("/", async (req, res) => {
  try {
    const sortBy = req.query.sortBy;

    
    if (!sortBy) {
      const restaurants = await Restaurant.find({});
      return res.json(restaurants);
    }

    
    const sortOrder = sortBy === "DESC" ? -1 : 1;

    const data = await Restaurant.find(
      {},
      {
        _id: 1,
        cuisine: 1,         
        name: 1,
        city: 1,            
        restaurant_id: 1
      }
    ).sort({ restaurant_id: sortOrder });

    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/cuisine/:type", async (req, res) => {
  try {
    const data = await Restaurant.find({ cuisine: req.params.type });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/Delicatessen", async (req, res) => {
  try {
    const data = await Restaurant.find(
      {
        cuisine: "Delicatessen",
        city: { $ne: "Brooklyn" }   
      },
      {
        _id: 0,         
        cuisine: 1,
        name: 1,
        city: 1
      }
    ).sort({ name: 1 }); 

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

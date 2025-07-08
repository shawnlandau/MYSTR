const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get all properties
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          p.*,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses
        FROM properties p
        LEFT JOIN transactions t ON p.id = t.property_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  });

  // Get single property
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT 
          p.*,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses
        FROM properties p
        LEFT JOIN transactions t ON p.id = t.property_id
        WHERE p.id = $1
        GROUP BY p.id
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  });

  // Create property
  router.post('/', async (req, res) => {
    try {
      const {
        address,
        property_type,
        purchase_price,
        current_value,
        monthly_rent = 0,
        annual_taxes = 0,
        annual_insurance = 0,
        hoa_fees = 0
      } = req.body;

      if (!address || !property_type || !purchase_price || !current_value) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(`
        INSERT INTO properties (address, property_type, purchase_price, current_value, monthly_rent, annual_taxes, annual_insurance, hoa_fees)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [address, property_type, purchase_price, current_value, monthly_rent, annual_taxes, annual_insurance, hoa_fees]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ error: 'Failed to create property' });
    }
  });

  // Update property
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        address,
        property_type,
        purchase_price,
        current_value,
        monthly_rent,
        annual_taxes,
        annual_insurance,
        hoa_fees
      } = req.body;

      const result = await pool.query(`
        UPDATE properties 
        SET address = $1, property_type = $2, purchase_price = $3, current_value = $4, 
            monthly_rent = $5, annual_taxes = $6, annual_insurance = $7, hoa_fees = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `, [address, property_type, purchase_price, current_value, monthly_rent, annual_taxes, annual_insurance, hoa_fees, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ error: 'Failed to update property' });
    }
  });

  // Delete property
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ error: 'Failed to delete property' });
    }
  });

  return router;
}; 
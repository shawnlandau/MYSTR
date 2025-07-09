const express = require('express');

function bookingsRoutes(pool) {
  const router = express.Router();

  // Get all bookings
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT b.*, p.address as property_address 
        FROM bookings b 
        JOIN properties p ON b.property_id = p.id 
        ORDER BY b.check_in_date DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // Get bookings for a specific property
  router.get('/property/:propertyId', async (req, res) => {
    try {
      const { propertyId } = req.params;
      const result = await pool.query(
        'SELECT * FROM bookings WHERE property_id = $1 ORDER BY check_in_date DESC',
        [propertyId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching property bookings:', error);
      res.status(500).json({ error: 'Failed to fetch property bookings' });
    }
  });

  // Get a specific booking
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT b.*, p.address as property_address FROM bookings b JOIN properties p ON b.property_id = p.id WHERE b.id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  });

  // Create a new booking
  router.post('/', async (req, res) => {
    try {
      const {
        property_id,
        guest_name,
        check_in_date,
        check_out_date,
        nightly_rate,
        notes
      } = req.body;

      // Calculate total amount
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const total_amount = nights * nightly_rate;

      const result = await pool.query(
        `INSERT INTO bookings 
         (property_id, guest_name, check_in_date, check_out_date, nightly_rate, total_amount, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [property_id, guest_name, check_in_date, check_out_date, nightly_rate, total_amount, notes]
      );

      // Create income transaction for the booking
      await pool.query(
        `INSERT INTO transactions 
         (property_id, booking_id, type, category, amount, description, date)
         VALUES ($1, $2, 'income', 'rental_income', $3, $4, $5)`,
        [
          property_id,
          result.rows[0].id,
          total_amount,
          `Rental income for ${guest_name} (${nights} nights)`,
          check_in_date
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  // Update a booking
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        guest_name,
        check_in_date,
        check_out_date,
        nightly_rate,
        status,
        notes
      } = req.body;

      // Calculate new total amount
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const total_amount = nights * nightly_rate;

      const result = await pool.query(
        `UPDATE bookings 
         SET guest_name = $1, check_in_date = $2, check_out_date = $3, 
             nightly_rate = $4, total_amount = $5, status = $6, notes = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [guest_name, check_in_date, check_out_date, nightly_rate, total_amount, status, notes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  // Delete a booking
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Failed to delete booking' });
    }
  });

  // Get booking statistics
  router.get('/stats/summary', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_bookings,
          SUM(total_amount) as total_revenue,
          AVG(nightly_rate) as avg_nightly_rate,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings
        FROM bookings
      `);
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      res.status(500).json({ error: 'Failed to fetch booking statistics' });
    }
  });

  return router;
}

module.exports = bookingsRoutes; 
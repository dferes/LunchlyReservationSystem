process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const db = require('./db');

let testReservation;
let testCustomer;

beforeEach(async () => {
    const customerResult = await db.query(
      `INSERT INTO customers (first_name, last_name, phone, notes) 
       VALUES ('Some', 'Guy', '123 456 7890', 'Prefer Italian food.')
       RETURNING id, first_name, last_name, phone, notes`
    );
    testCustomer = customerResult.rows[0];
  
    await db.query(
      `INSERT INTO customers (first_name, last_name, phone, notes) 
       VALUES ('Some', 'Gal', '987 654 3210', 'Prefer Chinese food.')`
    );
  
    await db.query(
      `INSERT INTO reservations (customer_id, start_at, num_guests, notes) 
       VALUES ('${testCustomer.id}', '2018-09-08 12:30:00', '5', 'Prefer outside seating')`
    );
  
    const reservationResult = await db.query(
      `INSERT INTO reservations (customer_id, start_at, num_guests, notes)
       VALUES ('${testCustomer.id}', '2018-09-08 1:30:00', '2', 'Table seating')
       RETURNING id, customer_id, start_at, num_guests, notes`
    );
        
    testReservation = reservationResult.rows[0];
  })
  
  afterEach(async () => {
    await db.query('DELETE FROM reservations');
    await db.query(`DELETE FROM customers`);
  })
  
  afterAll(async () => {
    await db.end()
  })

  describe("GET /", () => {
    test("Get a list of all customers when no customer id variable is passed as a query parameter", async () => {
      const res = await request(app).get('/')
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain(testCustomer.first_name);
      expect(res.text).toContain(testCustomer.last_name);
    })
  })
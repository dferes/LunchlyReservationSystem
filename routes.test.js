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

  describe("GET /:id", () => {
    test("Retrieves a customer when a valid customer id variable is passed as a query parameter", async () => {
      const res = await request(app).get(`/${testCustomer.id}`)
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain(testCustomer.first_name);
      expect(res.text).toContain(testCustomer.last_name);
      expect(res.text).toContain(testCustomer.phone);
      expect(res.text).toContain(testCustomer.notes);
      expect(res.text).toContain('Reservations');
      expect(res.text).toContain('September 8th 2018, 12:30 pm');
      expect(res.text).toContain('September 8th 2018, 1:30 am');
    })
    test("Retrieves a 404 status and an error message when an invalid customer id is passed as a query parameter", async () => {
        const res = await request(app).get('/5')
        expect(res.statusCode).toEqual(404);
        expect(res.text).toContain('No such customer: 5');
    })
    test("Retrieves a 400 status and an error message when a non integer id is passed as a query parameter", async () => {
        const res = await request(app).get('/blargh')
        expect(res.statusCode).toEqual(400);
        expect(res.text).toContain('Invalid customer id. Must be of type Integer');
    })
  })

  describe("GET /:id/edit", () => {
    test("Retrieves a form for editing customer information when a valid customer id is passed as a query parameter", async () => {
      const res = await request(app).get(`/${testCustomer.id}/edit`)
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Edit Customer');
      expect(res.text).toContain(testCustomer.first_name);
      expect(res.text).toContain(testCustomer.last_name);
      expect(res.text).toContain(testCustomer.phone);
      expect(res.text).toContain(testCustomer.notes);
      expect(res.text).toContain('Add');
    })
    test("Retrieves a 404 status and an error message when an invalid customer id is passed as a query parameter", async () => {
        const res = await request(app).get('/999')
        expect(res.statusCode).toEqual(404);
        expect(res.text).toContain('No such customer: 999');
    })
    test("Retrieves a 400 status and an error message when a non integer id is passed as a query parameter", async () => {
        const res = await request(app).get('/abcdefg')
        expect(res.statusCode).toEqual(400);
        expect(res.text).toContain('Invalid customer id. Must be of type Integer');
    })
  })

  describe("GET /add", () => {
    test("Retrieves a form for adding a new customer when the '/add' endpoint is reached", async () => {
      const res = await request(app).get('/add/')
      console.log(res);
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Add a Customer');
      expect(res.text).toContain('First Name:');
      expect(res.text).toContain('Last Name:');
      expect(res.text).toContain('Phone:');
      expect(res.text).toContain('Notes:');
      expect(res.text).toContain('Add');
    })
  })

  describe("POST /:id/edit", () => {
    test("Sends form information for editing a customer and updates the database when ALL fields are updated", async () => {
      const res = await request(app).post(`/${testCustomer.id}/edit`).send({
        firstName: 'Mr. Guy',
        lastName:  'Man',
        phone:     '555 444 3333',
        notes:     'On a diet, just soup and salad now...'
      })
      expect(res.statusCode).toEqual(200);





    })
  })

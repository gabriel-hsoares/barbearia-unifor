const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Barbearia Unifor',
      version: '1.0.0',
      description: 'API RESTful do sistema de agendamentos da Barbearia Unifor'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization'
        }
      },
      schemas: {
        RegisterBody: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Gabriel' },
            email: { type: 'string', example: 'gabriel@email.com' },
            password: { type: 'string', example: '123456' }
          }
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'gabriel@email.com' },
            password: { type: 'string', example: '123456' }
          }
        },
        ServiceBody: {
          type: 'object',
          required: ['name', 'price', 'duration'],
          properties: {
            name: { type: 'string', example: 'Corte' },
            price: { type: 'number', example: 30 },
            duration: { type: 'integer', example: 30 }
          }
        },
        AppointmentBody: {
          type: 'object',
          required: ['service_id', 'date', 'time'],
          properties: {
            service_id: { type: 'integer', example: 1 },
            date: { type: 'string', example: '2026-03-25' },
            time: { type: 'string', example: '14:30' },
            status: { type: 'string', example: 'pendente' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJSDoc(options);
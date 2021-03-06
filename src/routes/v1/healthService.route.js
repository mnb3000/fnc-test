const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { healthServiceController } = require('../../controllers');
const { healthServiceValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageHealthServices'),
    validate(healthServiceValidation.createHealthService),
    healthServiceController.createHealthService
  )
  .get(
    auth('getHealthServices'),
    validate(healthServiceValidation.getHealthServices),
    healthServiceController.getHealthServices
  );

router
  .route('/:healthServiceId')
  .get(
    auth('getHealthServices'),
    validate(healthServiceValidation.getHealthService),
    healthServiceController.getHealthService
  )
  .patch(
    auth('manageHealthServices'),
    validate(healthServiceValidation.updateHealthService),
    healthServiceController.updateHealthService
  )
  .delete(
    auth('manageHealthServices'),
    validate(healthServiceValidation.deleteHealthService),
    healthServiceController.deleteHealthService
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: HealthServices
 *   description: Health Service management and retrieval
 */

/**
 * @swagger
 * path:
 *  /healthServices:
 *    post:
 *      summary: Create a health service
 *      description: Only admins can create new health services
 *      tags: [HealthServices]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *              properties:
 *                name:
 *                  type: string
 *              example:
 *                name: Vertebrology
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/HealthService'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *    get:
 *      summary: Query health services
 *      description: Query/paginate all health services
 *      tags: [HealthServices]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Health service name
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of health services
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/HealthService'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /healthServices/{id}:
 *    get:
 *      summary: Get a health service
 *      tags: [HealthServices]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Health service id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/HealthService'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a health service
 *      description: Only admins can change health service information
 *      tags: [HealthServices]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Health service id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *              example:
 *                name: Therapy
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/HealthService'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a health service
 *      description: Only admins can delete health services
 *      tags: [HealthServices]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Health service id
 *      responses:
 *        "204":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

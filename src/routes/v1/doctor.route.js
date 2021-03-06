const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { doctorController } = require('../../controllers');
const { doctorValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(auth('manageDoctors'), validate(doctorValidation.createDoctor), doctorController.createDoctor)
  .get(auth('getDoctors'), validate(doctorValidation.getDoctors), doctorController.getDoctors);

router
  .route('/:doctorId')
  .get(auth('getDoctors'), validate(doctorValidation.getDoctor), doctorController.getDoctor)
  .patch(auth('manageDoctors'), validate(doctorValidation.updateDoctor), doctorController.updateDoctor)
  .delete(auth('manageDoctors'), validate(doctorValidation.deleteDoctor), doctorController.deleteDoctor);

router
  .route('/healthService/:doctorId')
  .post(
    auth('manageDoctors'),
    validate(doctorValidation.addHealthServiceToDoctor),
    doctorController.addHealthServiceToDoctor
  )
  .delete(
    auth('manageDoctors'),
    validate(doctorValidation.removeHealthServiceFromDoctor),
    doctorController.removeHealthServiceFromDoctor
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor management and retrieval
 */

/**
 * @swagger
 * path:
 *  /doctors:
 *    post:
 *      summary: Create a doctor
 *      description: Only admins can create new doctors
 *      tags: [Doctors]
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
 *                name: John Doe
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Doctor'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *    get:
 *      summary: Query doctors
 *      description: Query/paginate all doctors
 *      tags: [Doctors]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Doctor name
 *        - in: query
 *          name: clinics
 *          schema:
 *            type: string
 *          description: Clinic ObjectId
 *        - in: query
 *          name: healthServices
 *          schema:
 *            type: string
 *          description: Health service ObjectId
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
 *          description: Maximum number of doctors
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
 *                      $ref: '#/components/schemas/Doctor'
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
 *  /doctors/{id}:
 *    get:
 *      summary: Get a doctor
 *      tags: [Doctors]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Doctor id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Doctor'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a doctor
 *      description: Only admins can change doctor information
 *      tags: [Doctors]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Doctor id
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
 *                name: Jane Doe
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Doctor'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a doctor
 *      description: Only admins can delete doctors
 *      tags: [Doctors]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Doctor id
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

/**
 * @swagger
 * path:
 *  /doctors/healthService/{id}:
 *    post:
 *      summary: Add health service to doctor
 *      description: Only admins can edit doctor's service list
 *      tags: [Doctors]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Doctor id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - healthServiceId
 *              properties:
 *                healthServiceId:
 *                  type: string
 *              example:
 *                healthServiceId: 5ebac534954b54139806c112
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Doctor'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *    delete:
 *      summary: Remove health service from doctor
 *      description: Only admins can edit doctor's service list
 *      tags: [Doctors]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Doctor id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - healthServiceId
 *              properties:
 *                healthServiceId:
 *                  type: string
 *              example:
 *                healthServiceId: 5ebac534954b54139806c112
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Doctor'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { clinicController } = require('../../controllers');
const { clinicValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(auth('manageClinics'), validate(clinicValidation.createClinic), clinicController.createClinic)
  .get(auth('getClinics'), validate(clinicValidation.getClinics), clinicController.getClinics);

router
  .route('/:clinicId')
  .get(auth('getClinics'), validate(clinicValidation.getClinic), clinicController.getClinic)
  .patch(auth('manageClinics'), validate(clinicValidation.updateClinic), clinicController.updateClinic)
  .delete(auth('manageClinics'), validate(clinicValidation.deleteClinic), clinicController.deleteClinic);

router
  .route('/doctor/:clinicId')
  .post(auth('manageClinics'), validate(clinicValidation.addDoctorToClinic), clinicController.addDoctorToClinic)
  .delete(auth('manageClinics'), validate(clinicValidation.removeDoctorFromClinic), clinicController.removeDoctorFromClinic);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: Clinic management and retrieval
 */

/**
 * @swagger
 * path:
 *  /clinics:
 *    post:
 *      summary: Create a clinic
 *      description: Only admins can create new clinics
 *      tags: [Clinics]
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
 *                name: Kyiv Vertebrology Clinic
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Clinic'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *    get:
 *      summary: Query clinics
 *      description: Query/paginate all clinics
 *      tags: [Clinics]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Clinic name
 *        - in: query
 *          name: doctors
 *          schema:
 *            type: string
 *          description: Doctor ObjectId
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
 *          description: Maximum number of clinics
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
 *                      $ref: '#/components/schemas/Clinic'
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
 *  /clinics/{id}:
 *    get:
 *      summary: Get a clinic
 *      tags: [Clinics]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Clinic id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Clinic'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a clinic
 *      description: Only admins can change clinic information
 *      tags: [Clinics]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Clinic id
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
 *                name: Kyiv General Clinic
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Clinic'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a clinic
 *      description: Only admins can delete clinics
 *      tags: [Clinics]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Clinic id
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
 *  /clinics/doctor/{id}:
 *    post:
 *      summary: Add doctor to clinic
 *      description: Only admins can edit clinic's doctor list
 *      tags: [Clinics]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Clinic id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - doctorId
 *              properties:
 *                doctorId:
 *                  type: string
 *              example:
 *                doctorId: 5ebac534954b54139806c112
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Clinic'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *    delete:
 *      summary: Remove doctor from clinic
 *      description: Only admins can edit clinic's doctor list
 *      tags: [Clinics]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Clinic id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - doctorId
 *              properties:
 *                doctorId:
 *                  type: string
 *              example:
 *                doctorId: 5ebac534954b54139806c112
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Clinic'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

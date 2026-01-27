# Swagger API Documentation Setup Guide

## Overview

This project uses **Swagger UI** (with OpenAPI 3.0.0 specification) to provide interactive API documentation.

## Accessing Swagger UI

After starting the server:

```bash
npm run dev
```

Navigate to:
```
http://localhost:3000/api-docs
```

## What's Included

### Swagger Configuration File
- **Location**: `src/swagger.js`
- **Specification**: OpenAPI 3.0.0
- **Documentation Generator**: swagger-jsdoc

### Auto-Generated from JSDoc Comments
All API routes include inline JSDoc comments with `@swagger` tags that are automatically compiled into the Swagger specification.

**Example from a route file:**
```javascript
/**
 * @swagger
 * /lights:
 *   get:
 *     summary: Get all street lights
 *     tags: [Street Lights]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of all street lights
 */
router.get('/', streetLightController.getAllLights);
```

## Swagger Features

### 1. Try It Out Functionality
- Click "Try it out" on any endpoint
- Fill in parameters directly in the UI
- Click "Execute" to send the request
- View response, headers, and curl command

### 2. Authentication
- Swagger supports Bearer token authentication
- Add JWT token in the top-right "Authorize" button
- Token is automatically included in all requests

### 3. Schema Definitions
- View complete request/response schemas
- See data types and required fields
- Understand response structures

### 4. Different Sections/Tags
Endpoints are organized by functionality:
- **Street Lights** - Light management
- **Monitoring** - Real-time data
- **Fault Detection** - Fault management
- **Energy Tracking** - Energy monitoring
- **Maintenance** - Maintenance tasks
- **Carbon Tracking** - Environmental impact

## Customizing Swagger

### Adding New Endpoints Documentation

In any route file, add JSDoc comments:

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   post:
 *     summary: Brief description
 *     tags: [Tag Name]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Bad request
 */
router.post('/endpoint', controller.handler);
```

### Updating Swagger Configuration

Edit `src/swagger.js` to:
- Change API title/description
- Add server URLs
- Define new schemas
- Configure security schemes

## Swagger File Structure

```
src/swagger.js
├── API Info (title, version, description)
├── Servers (development, production)
├── Components
│   ├── Security Schemes (JWT)
│   └── Schemas (data models)
└── API routes (auto-loaded from JSDoc)
```

## Common Swagger Tags in Routes

| Route File | Tag |
|-----------|-----|
| streetLightRoutes.js | Street Lights |
| monitoringRoutes.js | Monitoring |
| faultDetectionRoutes.js | Fault Detection |
| energyTrackingRoutes.js | Energy Tracking |
| maintenanceRoutes.js | Maintenance |
| carbonTrackingRoutes.js | Carbon Tracking |

## Testing with Swagger

### Step-by-Step Guide

1. **Start Server**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI**
   ```
   http://localhost:3000/api-docs
   ```

3. **Authorize (if needed)**
   - Click "Authorize" button
   - Paste your JWT token
   - Click "Authorize"

4. **Test Endpoint**
   - Click on endpoint name
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - Check response

## Swagger vs Postman

| Feature | Swagger UI | Postman |
|---------|-----------|---------|
| Installation | Built-in | Download required |
| Learning Curve | Lower | Higher |
| Collaboration | Cloud-based | Better |
| Sharing | Easy URL | Collections |
| Development | Great | Better |
| Documentation | Auto-generated | Manual |

## Troubleshooting

### Swagger UI Not Loading
- Check if server is running on port 3000
- Verify `swagger-ui-express` package is installed
- Check browser console for errors

### Missing Endpoints
- Ensure JSDoc comments are properly formatted
- Restart the server after adding new routes
- Check that `@swagger` tag is correctly used

### Authorization Not Working
- Verify JWT token format
- Check `src/middleware/auth.js` for token validation
- Ensure token includes necessary claims

## API Documentation Best Practices

1. ✅ Add descriptive summaries
2. ✅ Include parameter descriptions
3. ✅ Document all response codes (200, 400, 401, 404, 500)
4. ✅ Provide example request bodies
5. ✅ Clearly mark required vs optional parameters
6. ✅ Use consistent schema naming
7. ✅ Document error responses with descriptions

## Generating Swagger Spec File

To export Swagger spec as JSON:

```bash
# Use curl to get the spec
curl http://localhost:3000/api/swagger.json > swagger.json
```

Then use this spec with other tools:
- Postman import
- Backend code generation
- Frontend client generation

## Production Deployment

In production, consider:
1. Hiding Swagger UI behind authentication
2. Using environment-specific API URLs
3. Disabling "Try It Out" functionality
4. Adding rate limiting to Swagger endpoints

Example (add to server.js):
```javascript
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
```

## References

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI Documentation](https://github.com/swagger-api/swagger-ui)
- [swagger-jsdoc Package](https://github.com/Surnet/swagger-jsdoc)

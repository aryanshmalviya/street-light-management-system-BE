# Swagger Quick Reference Card

## 🚀 Quick Access

| Item | Details |
|------|---------|
| **Swagger UI URL** | `http://localhost:3000/api-docs` |
| **Server Command** | `npm run dev` |
| **Total Endpoints** | 29 endpoints |
| **Organized Tags** | 6 categories |
| **Authentication** | JWT Bearer Token |

## 📍 All Endpoints at a Glance

```
STREET LIGHTS (6 endpoints)
├── GET    /api/lights
├── GET    /api/lights/:id
├── POST   /api/lights
├── PATCH  /api/lights/:id/status
├── DELETE /api/lights/:id
└── +1 more

MONITORING (4 endpoints)
├── POST   /api/monitoring/record
├── GET    /api/monitoring/:lightId/latest
├── GET    /api/monitoring/:lightId/range
└── GET    /api/monitoring/section/status

FAULT DETECTION (5 endpoints)
├── POST   /api/faults/report
├── GET    /api/faults/open
├── GET    /api/faults/:lightId
├── PATCH  /api/faults/:faultId/resolve
└── GET    /api/faults/section/stats

ENERGY TRACKING (4 endpoints)
├── POST   /api/energy/record
├── GET    /api/energy/daily
├── GET    /api/energy/monthly
└── GET    /api/energy/trends

MAINTENANCE (5 endpoints)
├── POST   /api/maintenance/schedule
├── GET    /api/maintenance/pending
├── GET    /api/maintenance/history
├── PATCH  /api/maintenance/:id/complete
└── GET    /api/maintenance/stats

CARBON TRACKING (5 endpoints)
├── POST   /api/carbon/record
├── GET    /api/carbon/report
├── GET    /api/carbon/daily
├── GET    /api/carbon/trends
└── GET    /api/carbon/impact
```

## 🔒 Authentication Flow

```
1. Get JWT Token
   ↓
2. Click "Authorize" in Swagger
   ↓
3. Paste token in Bearer field
   ↓
4. Click "Authorize"
   ↓
5. All requests now include token
```

## 📝 Testing a Single Endpoint

```
1. Open http://localhost:3000/api-docs
2. Find desired endpoint
3. Click to expand
4. Click "Try it out"
5. Fill in parameters
6. Click "Execute"
7. Check response and status code
```

## 🎯 Common Testing Sequence

```
Create Light (POST)
    ↓
Record Monitoring (POST)
    ↓
View Latest Data (GET)
    ↓
Report Fault (POST)
    ↓
Check Open Faults (GET)
    ↓
Resolve Fault (PATCH)
```

## 📊 Request/Response Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success |
| 201 | ✅ Created |
| 400 | ❌ Bad Request |
| 401 | ❌ Unauthorized |
| 404 | ❌ Not Found |
| 500 | ❌ Server Error |

## 🔧 Configuration Files

```
Project Root
├── src/
│   ├── swagger.js          ← Main Swagger config
│   ├── server.js           ← Swagger UI integration
│   └── routes/             ← JSDoc documented routes
├── package.json            ← Swagger packages
├── SWAGGER_GUIDE.md        ← Setup guide
├── SWAGGER_EXAMPLES.md     ← Testing examples
└── README.md               ← Updated with Swagger info
```

## 💡 Key Features

| Feature | How to Use |
|---------|-----------|
| **Try It Out** | Click button under endpoint |
| **Parameters** | Fill in query/path parameters |
| **Auth** | Use Authorize button for JWT |
| **Copy cURL** | Get command from response |
| **View Schema** | Check "Schemas" section |
| **Error Codes** | See responses section |

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Swagger not loading | Verify server on port 3000 |
| Endpoints missing | Restart server after changes |
| Auth failing | Check JWT token format |
| Bad request errors | Verify parameter names & types |
| Port 3000 in use | Change PORT in .env |

## 📚 Documentation Files

- **README.md** - Project overview + Swagger section
- **SWAGGER_GUIDE.md** - Detailed setup & customization
- **SWAGGER_EXAMPLES.md** - Complete testing examples
- **SWAGGER_IMPLEMENTATION.md** - This implementation guide

## 🌐 API Base URL

```
Development:  http://localhost:3000/api
Production:   https://api.nhai-streetlight.com/api
```

## 🔑 JWT Token Format

```
Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Token contains:
{
  "id": 1,
  "email": "user@nhai.gov.in",
  "role": "admin"
}
```

## 📈 Response Format

```javascript
Success:
{
  "success": true,
  "data": { /* actual data */ }
}

Error:
{
  "error": "Error message describing what went wrong"
}
```

## 🎓 Learning Path

1. **Day 1**: Open Swagger UI, explore endpoints
2. **Day 2**: Test endpoints using "Try it out"
3. **Day 3**: Generate JWT, test auth endpoints
4. **Day 4**: Test complete workflow (create → monitor → fault)
5. **Day 5**: Understand schemas and request/response

## 📞 Quick Commands

```bash
# Start server
npm run dev

# Install dependencies
npm install

# Run migrations
npm run migrate

# Test with curl
curl -X GET http://localhost:3000/api-docs

# Check if running
curl http://localhost:3000/api/health
```

## 🎯 Swagger UI Tour

```
Top Navigation Bar:
├── Swagger UI Logo
├── API Title: "NHAI Street Lighting Management System API"
└── Authorize Button (top right)

Main Content:
├── Endpoint Categories (expandable)
├── HTTP Method (GET, POST, PATCH, DELETE)
├── Endpoint Path
├── "Try it out" button
└── Parameter/Response sections

Right Sidebar:
└── Schemas (data model definitions)
```

## 🚀 Deployment Notes

For production:
- Set NODE_ENV=production
- Hide Swagger UI (optional)
- Use environment-specific .env
- Enable HTTPS/SSL
- Setup rate limiting
- Configure CORS properly

## 📞 Support Resources

Inside Project:
- SWAGGER_GUIDE.md - Full customization guide
- SWAGGER_EXAMPLES.md - Testing examples
- README.md - Installation & setup

External:
- https://swagger.io/tools/swagger-ui/
- https://github.com/Surnet/swagger-jsdoc
- https://spec.openapis.org/oas/v3.0.3

---

**Status**: ✅ Ready to Use
**Last Updated**: January 27, 2026
**Swagger Version**: OpenAPI 3.0.0

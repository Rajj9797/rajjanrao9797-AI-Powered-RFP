# AI-Powered RFP Management System

A comprehensive web application for procurement managers to create RFPs, manage vendors, receive responses, and compare proposals using AI assistance.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Tech Stack](#tech-stack)
3. [API Documentation](#api-documentation)
4. [Decisions & Assumptions](#decisions--assumptions)
5. [AI Tools Usage](#ai-tools-usage)
6. [Features Overview](#features-overview)

---

## Project Setup

### Prerequisites

**Required:**
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Operating System**: macOS, Linux, or Windows
- **Email Client**: Any default email client (Mail, Outlook, Gmail desktop, etc.)

**Optional (for production):**
- **Database**: PostgreSQL 14+ or MongoDB 5+ (currently using JSON files)
- **AI API Keys**: OpenAI API key or Anthropic Claude API key (for production AI features)
- **Email Service**: SMTP credentials (Gmail, SendGrid, AWS SES) for automated sending
- **IMAP Access**: For automated email receiving

### Install Steps

**1. Clone the repository:**
```bash
git clone https://github.com/Rajj9797/rajjanrao9797-AI-Powered-RFP.git
cd rajjanrao9797-AI-Powered-RFP/rfpsystem
```

**2. Install frontend dependencies:**
```bash
npm install
```

**3. Install backend dependencies:**
```bash
cd server
npm install
cd ..
```

**4. Configure environment variables:**

Create `server/.env` file:
```bash
PORT=8089
VENDORS_FILE=vendors.json
RFP_FILE=rfp_requests.json
RESPONSES_FILE=vendor_responses.json

# Optional: For production AI integration
# OPENAI_API_KEY=your_openai_api_key_here
# ANTHROPIC_API_KEY=your_claude_api_key_here

# Optional: For automated email
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
# IMAP_HOST=imap.gmail.com
# IMAP_PORT=993
```

**5. Create initial data files:**
```bash
cd server
echo "[]" > vendors.json
echo "[]" > rfp_requests.json
echo "[]" > vendor_responses.json
cd ..
```

### Email Configuration

**Current Implementation (Manual):**
- Uses `mailto:` links to open default email client
- User manually sends emails
- Vendors manually submit responses via web form

**For Automated Email (Production):**

1. **Sending (SMTP):**
   ```bash
   npm install nodemailer
   ```
   Update `server/server.js` to use nodemailer with SMTP credentials from `.env`

2. **Receiving (IMAP):**
   ```bash
   npm install node-imap mailparser
   ```
   Create polling service to check IMAP inbox and parse incoming vendor emails

3. **Email Parsing:**
   - Use OpenAI API to extract structured data from email body
   - Handle attachments (PDFs, Excel files)
   - Auto-create vendor response records

### Running Locally

**Option 1: Development mode (recommended):**
```bash
npm run dev
```
This starts both frontend and backend concurrently.

**Option 2: Start separately:**

Terminal 1 - Backend:
```bash
npm run start:server
# Server runs on http://localhost:8089
```

Terminal 2 - Frontend:
```bash
npm start
# Frontend runs on http://localhost:3000
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8089

### Seed Data

To populate with sample data for testing:

```bash
cd server

# Create sample vendors
cat > vendors.json << 'EOF'
[
  {
    "id": 1733500000000,
    "name": "TechSupply Co",
    "contact": "+1-555-0100",
    "email": "sales@techsupply.example",
    "createdAt": "2025-12-06T10:00:00.000Z"
  },
  {
    "id": 1733500001000,
    "name": "Office Solutions Ltd",
    "contact": "+1-555-0200",
    "email": "contact@officesolutions.example",
    "createdAt": "2025-12-06T10:00:01.000Z"
  },
  {
    "id": 1733500002000,
    "name": "Global Vendors Inc",
    "contact": "+1-555-0300",
    "email": "info@globalvendors.example",
    "createdAt": "2025-12-06T10:00:02.000Z"
  }
]
EOF

# Create sample RFP request
cat > rfp_requests.json << 'EOF'
[
  {
    "id": 1733510000000,
    "vendorId": 1733500000000,
    "vendorName": "TechSupply Co",
    "vendorEmail": "sales@techsupply.example",
    "subject": "Request for Proposal - Office Equipment",
    "body": "We need laptops and monitors for our office...",
    "sentDate": "06/12/2025",
    "rfpDetails": "title: Office Equipment Procurement\nbudget: 50000\nproducts: 20 laptops, 15 monitors",
    "createdAt": "2025-12-06T11:00:00.000Z"
  }
]
EOF

# Create sample vendor responses
cat > vendor_responses.json << 'EOF'
[
  {
    "id": 1733520000000,
    "vendorId": 1733500000000,
    "vendorName": "TechSupply Co",
    "vendorEmail": "sales@techsupply.example",
    "response": "We can provide 20 laptops at $1200 each and 15 monitors at $300 each. Total: $28,500. We offer 2 year warranty, delivery in 14 days, and Net 45 payment terms.",
    "receivedAt": "2025-12-06T12:00:00.000Z",
    "rfpRequestId": 1733510000000
  },
  {
    "id": 1733520001000,
    "vendorId": 1733500001000,
    "vendorName": "Office Solutions Ltd",
    "vendorEmail": "contact@officesolutions.example",
    "response": "Our quote: Laptops $1100 each (total $22,000), Monitors $350 each (total $5,250). Grand total $27,250. 3 year warranty included, 10 day delivery, Net 30 terms.",
    "receivedAt": "2025-12-06T12:30:00.000Z",
    "rfpRequestId": 1733510000000
  }
]
EOF

cd ..
```

Then restart the server to see sample data.

### Initial Scripts

**Build for production:**
```bash
npm run build
```

**Run tests:**
```bash
npm test
```

**Lint code:**
```bash
npm run lint
```

---

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Routing**: React Router DOM 7.10.1
- **Styling**: CSS Modules (component-scoped styles)
- **HTTP Client**: Fetch API (native browser)
- **Build Tool**: Create React App 5.0.1 (Webpack, Babel)
- **Testing**: Jest, React Testing Library

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.x
- **Body Parser**: body-parser (JSON request handling)
- **Environment**: dotenv 17.2.3
- **CORS**: Built-in Express middleware
- **Error Handling**: Custom middleware

### Database
- **Current**: File-based JSON storage
  - `vendors.json` - Vendor master data
  - `rfp_requests.json` - Sent RFP tracking
  - `vendor_responses.json` - Received proposals
- **Production Ready**: PostgreSQL or MongoDB
  - Schemas defined in code, ready for migration
  - Supports relational or document-based models

### AI Provider
- **Current**: Pattern-matching simulation (regex-based)
  - Price extraction: `/\$?([\d,]+(?:\.\d{2})?)/g`
  - Time parsing: `/(\d+)\s*(days?|weeks?|months?)/i`
  - Warranty: `/(\d+)\s*years?\s*warranty/i`
- **Production Options**:
  - **OpenAI GPT-4**: Text analysis, structured extraction
  - **Anthropic Claude**: Document parsing, reasoning
  - **Custom Models**: Fine-tuned for procurement domain

### Email Solution
- **Current**: `mailto:` links (browser integration)
  - Opens default email client
  - Manual send by user
- **Production Options**:
  - **SMTP**: nodemailer with Gmail/SendGrid/AWS SES
  - **IMAP**: node-imap for receiving responses
  - **Webhooks**: SendGrid/Mailgun inbound parse

### Key Libraries

**Frontend:**
- `react`, `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `web-vitals` - Performance monitoring

**Backend:**
- `express` - Web server framework
- `body-parser` - JSON parsing middleware
- `dotenv` - Environment configuration
- `fs/promises` - Async file operations

**Development:**
- `concurrently` - Run frontend + backend together
- `react-scripts` - CRA build tools

---

## API Documentation

### Base URL
```
http://localhost:8089
```

### Authentication
Currently no authentication. Production would use JWT or OAuth2.

---

### Vendors

#### GET `/api/vendors`
Get all vendors from the vendor master database.

**Request:**
```bash
GET /api/vendors
```

**Response (200 OK):**
```json
[
  {
    "id": 1733500000000,
    "name": "TechSupply Co",
    "contact": "+1-555-0100",
    "email": "sales@techsupply.example",
    "createdAt": "2025-12-06T10:00:00.000Z"
  }
]
```

**Error (500):**
```json
{
  "error": "Failed to read vendors"
}
```

---

#### POST `/api/vendors`
Add a new vendor to the master database.

**Request:**
```bash
POST /api/vendors
Content-Type: application/json

{
  "name": "New Vendor Inc",
  "contact": "+1-555-9999",
  "email": "contact@newvendor.com"
}
```

**Response (201 Created):**
```json
{
  "id": 1733530000000,
  "name": "New Vendor Inc",
  "contact": "+1-555-9999",
  "email": "contact@newvendor.com",
  "createdAt": "2025-12-06T15:00:00.000Z"
}
```

**Error (400):**
```json
{
  "error": "Missing vendor name"
}
```

---

### RFP Requests

#### GET `/api/rfp-requests`
Get all sent RFP requests.

**Request:**
```bash
GET /api/rfp-requests
```

**Response (200 OK):**
```json
[
  {
    "id": 1733510000000,
    "vendorId": 1733500000000,
    "vendorName": "TechSupply Co",
    "vendorEmail": "sales@techsupply.example",
    "subject": "Request for Proposal",
    "body": "Dear TechSupply Co...",
    "sentDate": "06/12/2025",
    "rfpDetails": "title: Office Equipment...",
    "createdAt": "2025-12-06T11:00:00.000Z"
  }
]
```

---

#### POST `/api/rfp-requests`
Save a new RFP request (when sending to vendor).

**Request:**
```bash
POST /api/rfp-requests
Content-Type: application/json

{
  "vendorId": 1733500000000,
  "vendorName": "TechSupply Co",
  "vendorEmail": "sales@techsupply.example",
  "subject": "Request for Proposal",
  "body": "Dear vendor, we need...",
  "sentDate": "06/12/2025",
  "rfpDetails": "Products: laptops, monitors..."
}
```

**Response (201 Created):**
```json
{
  "id": 1733540000000,
  "vendorId": 1733500000000,
  "vendorName": "TechSupply Co",
  "vendorEmail": "sales@techsupply.example",
  "subject": "Request for Proposal",
  "body": "Dear vendor, we need...",
  "sentDate": "06/12/2025",
  "rfpDetails": "Products: laptops, monitors...",
  "createdAt": "2025-12-06T16:00:00.000Z"
}
```

**Error (400):**
```json
{
  "error": "Missing vendorId in request"
}
```

---

### Vendor Responses

#### GET `/api/vendor-responses`
Get all vendor proposal responses.

**Request:**
```bash
GET /api/vendor-responses
```

**Response (200 OK):**
```json
[
  {
    "id": 1733520000000,
    "vendorId": 1733500000000,
    "vendorName": "TechSupply Co",
    "vendorEmail": "sales@techsupply.example",
    "response": "We can provide laptops at $1200 each...",
    "attachments": [],
    "receivedAt": "2025-12-06T12:00:00.000Z",
    "rfpRequestId": 1733510000000
  }
]
```

---

#### POST `/api/vendor-responses`
Submit a vendor proposal response.

**Request:**
```bash
POST /api/vendor-responses
Content-Type: application/json

{
  "vendorId": 1733500000000,
  "vendorName": "TechSupply Co",
  "vendorEmail": "sales@techsupply.example",
  "response": "We can supply 20 laptops at $1150 each with 2 year warranty, delivery in 15 days, Net 30 payment terms.",
  "rfpRequestId": 1733510000000,
  "attachments": []
}
```

**Response (201 Created):**
```json
{
  "id": 1733550000000,
  "vendorId": 1733500000000,
  "vendorName": "TechSupply Co",
  "vendorEmail": "sales@techsupply.example",
  "response": "We can supply 20 laptops...",
  "attachments": [],
  "receivedAt": "2025-12-06T17:00:00.000Z",
  "rfpRequestId": 1733510000000
}
```

**Error (400):**
```json
{
  "error": "Missing vendorId in request"
}
```
or
```json
{
  "error": "Missing response content"
}
```

---

#### POST `/api/parse-vendor-response`
Parse free-form vendor response text using AI.

**Request:**
```bash
POST /api/parse-vendor-response
Content-Type: application/json

{
  "responseText": "We offer laptops at $1200 each, monitors $300 each. 2 year warranty, 10 day delivery, Net 45 terms."
}
```

**Response (200 OK):**
```json
{
  "pricing": [1200, 300],
  "totalPrice": 1500,
  "warranty": "2 years",
  "deliveryTime": "10 days",
  "paymentTerms": "Net 45",
  "additionalServices": []
}
```

**Error (400):**
```json
{
  "error": "Missing responseText"
}
```

**Error (500):**
```json
{
  "error": "Failed to parse response"
}
```

---

## Decisions & Assumptions

### Key Design Decisions

**1. File-Based Storage vs Database**
- **Decision**: Use JSON files for MVP, design for easy DB migration
- **Rationale**: 
  - Faster development without DB setup
  - Zero infrastructure dependencies
  - Easy to inspect/debug data
  - Production migration path clear (PostgreSQL schemas ready)
- **Trade-offs**: Not suitable for concurrent users or high load

**2. Client-Side AI Simulation vs Real API**
- **Decision**: Implement pattern-matching locally, design for API swap
- **Rationale**:
  - No API keys required for demo
  - Instant responses (no network latency)
  - Deterministic behavior for testing
  - Easy to replace with OpenAI/Claude
- **Implementation**: All AI logic isolated in pure functions

**3. Manual Email via mailto: vs Automated SMTP**
- **Decision**: Use browser `mailto:` links for MVP
- **Rationale**:
  - No SMTP credentials needed
  - Works with any email client
  - User retains control of sending
  - Simpler security model
- **Production Path**: nodemailer integration ready, SMTP config in `.env`

**4. Scoring Algorithm Design**
- **Decision**: Weighted scoring (Price 40%, Warranty 20%, Delivery 20%, Terms 20%)
- **Rationale**:
  - Price typically most important in procurement
  - Balanced consideration of other factors
  - Simple to explain to users
  - Can be customized per RFP
- **Formula**: 
  ```
  Price Score = 40 * (minPrice / vendorPrice)
  Warranty Score = 20 if ≥3yr, 15 if ≥2yr, 10 if ≥1yr
  Delivery Score = 20 if ≤14d, 15 if ≤30d, 10 if ≤45d
  Terms Score = 20 if Net≥60, 15 if Net≥45, 10 if Net≥30
  ```

**5. Single-Page Application Architecture**
- **Decision**: React SPA with client-side routing
- **Rationale**:
  - Better UX (no full page reloads)
  - Easy state management
  - Modern development workflow
  - API-first backend (reusable for mobile)

**6. CSS Modules vs Styled Components**
- **Decision**: CSS Modules for styling
- **Rationale**:
  - Built into Create React App
  - No runtime overhead
  - Familiar CSS syntax
  - Scoped styles prevent conflicts

### Assumptions

**About Emails:**
1. **Format**: Vendor responses are plain text or simple HTML
2. **Attachments**: Not critical for MVP (can be added later)
3. **Threading**: Each RFP is a separate email thread
4. **Reply-To**: Vendors reply to sender's email address
5. **Volume**: Low volume (dozens, not thousands) of RFPs

**About Vendor Responses:**
1. **Language**: Responses are in English
2. **Structure**: Responses mention price, warranty, delivery, terms
3. **Currency**: All prices in USD ($)
4. **Format**: Free-form text (AI extracts structured data)
5. **Completeness**: Vendors may omit some details (handled gracefully)

**About Data Formats:**
1. **Dates**: ISO 8601 for storage, localized for display
2. **Currency**: Stored as numbers, displayed with formatting
3. **IDs**: Timestamp-based (Date.now()) sufficient for single-user
4. **Products**: Array of objects with name/quantity/specs

**About Users:**
1. **Single User**: One procurement manager per instance
2. **Authentication**: Not required for MVP
3. **Permissions**: Full access to all features
4. **Browser**: Modern browser with JavaScript enabled
5. **Network**: Local network or internet connection

**About RFP Workflow:**
1. **Linear Process**: Create → Send → Receive → Compare
2. **Multiple Vendors**: One RFP sent to multiple vendors
3. **Response Timing**: Vendors respond within reasonable timeframe
4. **Modifications**: RFPs not editable after sending (create new version)
5. **History**: All data retained indefinitely

**About AI Parsing:**
1. **Accuracy**: 80%+ accuracy acceptable for MVP
2. **Review**: User reviews AI-extracted data
3. **Fallback**: Manual entry available if parsing fails
4. **Learning**: No ML training (static rules)
5. **Privacy**: All processing done locally (no data sent to third parties)

**System Limitations:**
1. **Concurrency**: Not optimized for multiple simultaneous users
2. **Scale**: Tested with <100 vendors, <50 RFPs
3. **File Size**: JSON files <10MB (no pagination)
4. **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge)
5. **Mobile**: Responsive but optimized for desktop

---

## AI Tools Usage

### Tools Used

**Primary AI Assistant:**
- **GitHub Copilot** - Used throughout development
  - IDE: VS Code with Copilot extension
  - Usage: Code completion, boilerplate generation, debugging

**Secondary AI Assistants:**
- **ChatGPT (GPT-4)** - Architecture planning and problem-solving
- **Claude (Anthropic)** - Code review and optimization suggestions

### What They Helped With

**1. Boilerplate Code (Copilot)**
- React component structure (useState, useEffect patterns)
- Express route handlers with error handling
- CSS module templates
- Form validation logic
- Example:
  ```javascript
  // Typed: "async function fetchVendors"
  // Copilot completed entire fetch with error handling:
  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVendors(data);
    } catch (err) {
      setError(err.message);
    }
  };
  ```

**2. Debugging (Copilot + ChatGPT)**
- React Hook dependency warnings (useEffect)
- CORS issues between frontend/backend
- CSS specificity conflicts
- File path resolution (absolute vs relative)
- Example prompt to ChatGPT:
  > "Getting 'Cannot GET /api/vendors' in browser but endpoint exists in server.js. Port 8089 is listening. What's wrong?"
  
  Response identified proxy configuration missing in package.json.

**3. Design Patterns (ChatGPT)**
- Scoring algorithm design
- Data flow architecture (RFP → Vendors → Responses → Comparison)
- State management strategy (localStorage vs Context API)
- Error handling patterns
- Example prompt:
  > "Design a scoring system for vendor proposals considering price, warranty, delivery time, and payment terms. Price should be most important."

**4. Parsing Logic (Claude)**
- Regex patterns for extracting prices, dates, terms
- Edge case handling (missing fields, malformed input)
- Currency formatting
- Date parsing across different formats
- Example prompt:
  > "Write a regex to extract prices from text like '$1,234.56' or '1234.56 dollars' or 'USD 1234'"

**5. Component Architecture (Copilot)**
- Separation of concerns (presentational vs container components)
- Props destructuring patterns
- CSS Module naming conventions
- File organization structure

**6. API Design (ChatGPT)**
- RESTful endpoint design
- Request/response schemas
- Error response standards
- Status code selection

### Notable Prompts/Approaches

**Effective Prompts:**

1. **For RFP Chat Component:**
   > "Create a React chat interface that takes user input like 'I need 20 laptops with 16GB RAM, budget $50,000, delivery in 30 days' and extracts: products array, budget number, delivery date, specs. Use regex and pattern matching, not external APIs."

2. **For Scoring Algorithm:**
   > "Implement a proposal scoring function (0-100) that weights: price (40%), warranty years (20%), delivery days (20%), payment net terms (20%). Lower price is better, higher others are better."

3. **For AI Parsing:**
   > "Extract structured data from vendor proposal text: find all dollar amounts, warranty mentions (X years), delivery timeframes (X days/weeks), payment terms (Net X). Return as JSON object."

4. **For Error Handling:**
   > "Add comprehensive error handling to Express routes: validate request body, handle file not found, catch JSON parse errors, return appropriate HTTP status codes."

### What I Learned

**1. AI as Pair Programmer:**
- AI excels at boilerplate and repetitive patterns
- Human oversight crucial for architecture decisions
- Best used iteratively (prompt → review → refine → prompt)

**2. Prompt Engineering:**
- Specific examples in prompts yield better results
- "What I want" + "Example output" works better than abstract descriptions
- Breaking complex tasks into smaller prompts more effective

**3. Code Quality:**
- AI-generated code needs review for:
  - Edge cases
  - Security (input validation)
  - Performance (unnecessary re-renders)
  - Accessibility
- Always test AI suggestions before accepting

**4. Learning Acceleration:**
- Learned React 19 hooks patterns faster with AI examples
- Discovered CSS Grid/Flexbox tricks from AI suggestions
- Found npm packages I didn't know existed (via AI recommendations)

**5. Debugging Efficiency:**
- AI helped identify root causes faster (especially CORS, async issues)
- Suggested fixes often correct on first try
- Saved hours on "Why isn't this working?" problems

### What Changed Because of AI Tools

**Before AI:**
- Would have used class components (more familiar)
- Simpler CSS (less polished UI)
- More verbose code (less DRY)
- Fewer edge cases handled

**After AI:**
- Modern functional components with hooks
- Professional-looking UI with animations
- Reusable utility functions
- Comprehensive error handling

**Specific Examples:**

1. **Regex Patterns:** AI suggested more robust patterns than I would have written
   ```javascript
   // My original: /\$\d+/
   // AI suggested: /\$?([\d,]+(?:\.\d{2})?)/g
   ```

2. **CSS Modules:** Copilot taught me CSS Module patterns I didn't know
   ```css
   /* Learned: Composition */
   .button {
     composes: baseButton from './common.module.css';
   }
   ```

3. **Error Boundaries:** ChatGPT reminded me to add try/catch to all async operations

4. **Accessibility:** Copilot added ARIA labels I would have forgotten
   ```javascript
   <button aria-label="Send RFP to vendor">
   ```

**Time Saved:** Estimated 40-50% faster development with AI assistance

**Quality Improved:** More edge cases handled, better error messages, cleaner code structure

---

## Features Overview

### Installation

```bash
cd rfpsystem
npm install
```

### Configuration

Create `server/.env`:
```
PORT=8089
VENDORS_FILE=vendors.json
RFP_FILE=rfp_requests.json
RESPONSES_FILE=vendor_responses.json
```

### Initialize Data Files

```bash
cd server
echo "[]" > vendors.json
echo "[]" > rfp_requests.json
echo "[]" > vendor_responses.json
cd ..
```

### Run the Application

**Development mode (recommended):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run start:server

# Terminal 2 - Frontend
npm start
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8089

## Usage Guide

### Creating an RFP

**Option 1: AI Assistant** (💬)
1. Click "AI Assistant" on Home page
2. Describe your needs: *"I need 20 laptops with 16GB RAM and 15 monitors, budget $50,000, delivery in 30 days"*
3. Review generated RFP
4. Select vendors

**Option 2: Manual Entry** (📝)
1. Click "Manual Entry"
2. Fill all fields (title, description, products, budget, timeline)
3. Click "Select vendor"

### Managing Vendors

1. Go to "➕ Add Vendor"
2. Enter name, contact, email
3. Click "Add Vendor"

### Sending RFPs

1. Save an RFP
2. Click "Send Request" on vendor card
3. Email client opens with pre-filled details

### Submitting Vendor Responses

1. Go to "📝 Submit Response"
2. Enter vendor details
3. Paste proposal text
4. Click "Save Response"

### Comparing Proposals

1. Go to "📊 Compare Proposals"
2. View recommended vendor (highlighted)
3. See side-by-side comparison table
4. Review detailed responses

## API Endpoints

### Vendors
- `GET /api/vendors` - List all vendors
- `POST /api/vendors` - Add vendor

### RFP Requests
- `GET /api/rfp-requests` - List all RFPs
- `POST /api/rfp-requests` - Create RFP

### Vendor Responses
- `GET /api/vendor-responses` - List all responses
- `POST /api/vendor-responses` - Submit response
- `POST /api/parse-vendor-response` - Parse with AI

## Technology Stack

- **Frontend**: React 19.2, React Router 7.10, CSS Modules
- **Backend**: Node.js, Express, dotenv
- **Storage**: JSON files (easily migratable to DB)
- **AI**: Pattern matching (ready for OpenAI/Claude integration)

## Project Structure

```
rfpsystem/
├── server/
│   ├── server.js              # Express API
│   ├── .env                   # Config
│   ├── vendors.json           # Vendor data
│   ├── rfp_requests.json      # Sent RFPs
│   └── vendor_responses.json  # Responses
├── src/Frontend/Components/
│   ├── HomePage/              # RFP creation
│   ├── RFPChat/               # AI chat
│   ├── VendorList/            # Vendor display
│   ├── VendorCard/            # Vendor item
│   ├── VendorForm/            # Add vendor
│   ├── Email/                 # View RFPs
│   ├── VendorResponse/        # Submit response
│   ├── ProposalComparison/    # Compare & recommend
│   └── Navbar/                # Navigation
└── package.json
```

## Problem Statement Compliance

✅ **Create RFPs** - Natural language + manual entry, structured data  
✅ **Manage vendors and send RFPs** - Vendor master, email integration  
✅ **Receive and interpret responses** - AI parsing, automatic extraction  
✅ **Compare and recommend** - Scoring, comparison, recommendations  

## Troubleshooting

**Port conflicts:**
```bash
lsof -i :8089
lsof -i :3000
# Kill process or change PORT in server/.env
```

**Backend issues:**
```bash
npm run start:server
# Check console for errors
```

**Frontend errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## Future Enhancements

- Real OpenAI/Claude API integration
- Email automation (SMTP/IMAP)
- File attachments
- Database migration
- Multi-user auth
- PDF generation
- Analytics dashboard

## License

MIT

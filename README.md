# Complaint Manager

A web-based **Apartment & PG Complaint Management System** for submitting, managing, searching, and tracking resident complaints.

## Features

* Submit new complaints
* Select complaint category
* Enter resident and room details
* Set complaint priority
* View all complaints
* Search complaints
* Filter by category and status
* Edit complaint information
* Update complaint status
* Delete complaints
* Input validation
* Success and error messages
* Responsive user interface
* REST API backend

## Complaint Details

Each complaint contains:

* Resident name
* Room / flat number
* Contact information
* Category
* Description
* Priority
* Status
* Date
* Additional information

## Technologies Used

**Frontend**

* HTML
* CSS
* JavaScript

**Backend**

* Node.js
* Express.js
* CORS

## Project Structure

```text
complaint-managment/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── .vscode/
```

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/NagarajPai21/Apartment-PG-complaint-manager.git
```

### 2. Open the project

```bash
cd Apartment-PG-complaint-manager
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Start the server

```bash
node server.js
```

The server runs on:

```text
http://localhost:3000
```

### 5. Open the frontend

Open:

```text
frontend/index.html
```

in your browser using a local development server.

## API Endpoints

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/complaints`            | Get all complaints           |
| GET    | `/api/complaints/:id`        | Get a specific complaint     |
| POST   | `/api/complaints`            | Create a complaint           |
| PUT    | `/api/complaints/:id`        | Update complaint information |
| PATCH  | `/api/complaints/:id/status` | Update complaint status      |
| DELETE | `/api/complaints/:id`        | Delete a complaint           |

## Complaint Status

The system supports:

* **Pending**
* **In Progress**
* **Resolved**

Status rules:

* Pending → In Progress
* Pending → Resolved
* In Progress → Resolved
* Resolved complaints cannot be changed
* Resolved complaints cannot be edited
* An In Progress complaint cannot be changed back to Pending

## Validation and Error Handling

The backend validates required complaint information and handles invalid requests.

The API returns appropriate responses when:

* Required information is missing
* A complaint does not exist
* An invalid status is provided
* A resolved complaint is modified
* An invalid status transition is attempted

## API Testing

The backend APIs were tested for:

* Retrieving complaints
* Creating complaints
* Updating complaint status
* Updating complaint information
* Deleting complaints
* Handling invalid requests

API testing screenshots are included as submission evidence.

## Data Storage

Complaint data is stored temporarily in an in-memory JavaScript data structure while the server is running.

## Demo

A demonstration video is included as part of the project submission to show the working frontend and backend functionality.

## Objective

The objective of this project is to develop a simple complaint management system for apartment or PG residents while demonstrating:

* Frontend development
* REST API development
* CRUD operations
* Request validation
* Error handling
* Status management
* Client-server communication

## Submission Contents

* Source code
* GitHub repository
* README
* Working frontend and backend
* API testing evidence
* Demonstration video

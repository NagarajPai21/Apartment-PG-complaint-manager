const express = require("express");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());


// ================= COMPLAINT DATA =================

let complaints = [
    {
        id: 1,
        residentName: "Rahul",
        roomNumber: "203",
        contact: "9876543210",
        category: "Electricity",
        description: "Fan is not working",
        priority: "High",
        status: "Pending",
        date: "2026-08-15",
        additionalInfo: ""
    },
    {
        id: 2,
        residentName: "Ravi",
        roomNumber: "105",
        contact: "9876543211",
        category: "Plumbing",
        description: "Water leakage in bathroom",
        priority: "Medium",
        status: "In Progress",
        date: "2026-08-15",
        additionalInfo: ""
    }
];


// ================= GET ALL COMPLAINTS =================

app.get("/api/complaints", (req, res) => {

    res.status(200).json(complaints);

});


// ================= GET ONE COMPLAINT =================

app.get("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(c => c.id === id);

    if (!complaint) {

        return res.status(404).json({
            message: "Complaint not found"
        });

    }

    res.status(200).json(complaint);

});


// ================= CREATE COMPLAINT =================

app.post("/api/complaints", (req, res) => {

    const {
        residentName,
        roomNumber,
        contact,
        category,
        description,
        priority,
        date,
        additionalInfo
    } = req.body;


    // Validation

    if (
        !residentName ||
        !roomNumber ||
        !contact ||
        !category ||
        !description ||
        !priority
    ) {

        return res.status(400).json({
            message: "Please provide all required complaint information"
        });

    }


    // Generate new ID

    const newId = complaints.length > 0
        ? Math.max(...complaints.map(c => c.id)) + 1
        : 1;


    // Create complaint

    const newComplaint = {

        id: newId,

        residentName,

        roomNumber,

        contact,

        category,

        description,

        priority,

        status: "Pending",

        date: date || new Date().toISOString().split("T")[0],

        additionalInfo: additionalInfo || ""

    };


    complaints.push(newComplaint);


    res.status(201).json({

        message: "Complaint created successfully",

        complaint: newComplaint

    });

});


// ================= UPDATE COMPLAINT =================

app.put("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(c => c.id === id);


    if (!complaint) {

        return res.status(404).json({
            message: "Complaint not found"
        });

    }


    // Do not allow editing a resolved complaint

    if (complaint.status === "Resolved") {

        return res.status(400).json({
            message: "Resolved complaints cannot be edited"
        });

    }


    const {
        residentName,
        roomNumber,
        contact,
        category,
        description,
        priority,
        date,
        additionalInfo
    } = req.body;


    // Validation

    if (
        !residentName ||
        !roomNumber ||
        !contact ||
        !category ||
        !description ||
        !priority
    ) {

        return res.status(400).json({
            message: "Please provide all required complaint information"
        });

    }


    complaint.residentName = residentName;

    complaint.roomNumber = roomNumber;

    complaint.contact = contact;

    complaint.category = category;

    complaint.description = description;

    complaint.priority = priority;

    complaint.date = date || complaint.date;

    complaint.additionalInfo = additionalInfo || "";


    res.status(200).json({

        message: "Complaint updated successfully",

        complaint: complaint

    });

});


// ================= UPDATE STATUS =================

app.patch("/api/complaints/:id/status", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(c => c.id === id);


    if (!complaint) {

        return res.status(404).json({
            message: "Complaint not found"
        });

    }


    // Resolved is final

    if (complaint.status === "Resolved") {

        return res.status(400).json({
            message: "Resolved complaints cannot be changed"
        });

    }


    const { status } = req.body;


    const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            message: "Invalid status"
        });

    }


    // Prevent going backwards

    if (
        complaint.status === "In Progress" &&
        status === "Pending"
    ) {

        return res.status(400).json({
            message: "Complaint cannot be changed back to Pending"
        });

    }


    complaint.status = status;


    res.status(200).json({

        message: "Complaint status updated successfully",

        complaint: complaint

    });

});


// ================= DELETE COMPLAINT =================

app.delete("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaintIndex =
        complaints.findIndex(c => c.id === id);


    if (complaintIndex === -1) {

        return res.status(404).json({
            message: "Complaint not found"
        });

    }


    complaints.splice(complaintIndex, 1);


    res.status(200).json({

        message: "Complaint deleted successfully"

    });

});


// ================= START SERVER =================

app.listen(3000, () => {

    console.log("Server is running on port 3000");

});
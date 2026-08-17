
// ================= ELEMENTS =================

const getButton = document.getElementById("getComplaints");

const complaintForm = document.getElementById("complaintForm");

const formSection = document.getElementById("formSection");

const newComplaintButton =
    document.getElementById("newComplaintButton");

const cancelButton =
    document.getElementById("cancelButton");

const formTitle =
    document.getElementById("formTitle");

const submitButton =
    document.getElementById("submitButton");

const searchInput =
    document.getElementById("search");

const categoryFilter =
    document.getElementById("filterCategory");

const statusFilter =
    document.getElementById("filterStatus");


// ================= VARIABLES =================

let editingId = null;

let allComplaints = [];


// ================= EVENTS =================

getButton.addEventListener("click", getComplaints);

complaintForm.addEventListener("submit", saveComplaint);

searchInput.addEventListener("input", filterComplaints);

categoryFilter.addEventListener("change", filterComplaints);

statusFilter.addEventListener("change", filterComplaints);


// ================= NEW COMPLAINT =================

newComplaintButton.addEventListener("click", () => {

    editingId = null;

    complaintForm.reset();

    resetForm();

    formSection.classList.remove("hidden");

    formSection.scrollIntoView({
        behavior: "smooth"
    });

});


// ================= CANCEL =================

cancelButton.addEventListener("click", () => {

    editingId = null;

    complaintForm.reset();

    resetForm();

    formSection.classList.add("hidden");

});


// ================= GET COMPLAINTS =================

async function getComplaints() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/complaints"
        );

        const complaints = await response.json();

        if (!response.ok) {

            alert("Could not load complaints");

            return;

        }

        allComplaints = complaints;

        updateDashboard(complaints);

        filterComplaints();

    }

    catch (error) {

        console.error(error);

        alert("Server is not running");

    }

}


// ================= DASHBOARD =================

function updateDashboard(complaints) {

    const total = complaints.length;

    const pending = complaints.filter(
        complaint => complaint.status === "Pending"
    ).length;

    const progress = complaints.filter(
        complaint => complaint.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
        complaint => complaint.status === "Resolved"
    ).length;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("pendingCount").textContent = pending;

    document.getElementById("progressCount").textContent = progress;

    document.getElementById("resolvedCount").textContent = resolved;

}


// ================= DISPLAY COMPLAINTS =================

function displayComplaints(complaints) {

    const complaintBox =
        document.getElementById("complaints");


    if (complaints.length === 0) {

        complaintBox.innerHTML =
            "<p>No complaints found.</p>";

        return;

    }


    let table = `

        <table>

            <tr>

                <th>ID</th>

                <th>Resident</th>

                <th>Room</th>

                <th>Contact</th>

                <th>Category</th>

                <th>Description</th>

                <th>Priority</th>

                <th>Status</th>

                <th>Date</th>

                <th>Actions</th>

            </tr>

    `;


    complaints.forEach(complaint => {


        // ================= STATUS CLASS =================

        let statusClass = "";

        if (complaint.status === "Pending") {

            statusClass = "status-pending";

        }

        else if (complaint.status === "In Progress") {

            statusClass = "status-progress";

        }

        else if (complaint.status === "Resolved") {

            statusClass = "status-resolved";

        }


        // ================= PRIORITY CLASS =================

        let priorityClass = "";

        if (complaint.priority === "High") {

            priorityClass = "priority-high";

        }

        else if (complaint.priority === "Medium") {

            priorityClass = "priority-medium";

        }

        else if (complaint.priority === "Low") {

            priorityClass = "priority-low";

        }


        // ================= STATUS CONTROL =================

        let statusControl = "";


        // RESOLVED = FINAL

        if (complaint.status === "Resolved") {

            statusControl = `

                <span class="resolved-text">

                    Completed

                </span>

            `;

        }


        // IN PROGRESS

        else if (complaint.status === "In Progress") {

            statusControl = `

                <select
                    onchange="updateStatus(${complaint.id}, this.value)"
                >

                    <option
                        value="In Progress"
                        selected
                    >

                        In Progress

                    </option>

                    <option value="Resolved">

                        Resolved

                    </option>

                </select>

            `;

        }


        // PENDING

        else {

            statusControl = `

                <select
                    onchange="updateStatus(${complaint.id}, this.value)"
                >

                    <option
                        value="Pending"
                        selected
                    >

                        Pending

                    </option>

                    <option value="In Progress">

                        In Progress

                    </option>

                    <option value="Resolved">

                        Resolved

                    </option>

                </select>

            `;

        }


        // ================= ACTION BUTTONS =================

        let actionButtons = "";


        // RESOLVED COMPLAINT

        if (complaint.status === "Resolved") {

            actionButtons = `

                <button
                    onclick="deleteComplaint(${complaint.id})"
                >

                    Delete

                </button>

            `;

        }


        // PENDING / IN PROGRESS

        else {

            actionButtons = `

                <button
                    onclick="editComplaint(${complaint.id})"
                >

                    Edit

                </button>


                <button
                    onclick="deleteComplaint(${complaint.id})"
                >

                    Delete

                </button>

            `;

        }


        // ================= TABLE ROW =================

        table += `

            <tr>

                <td>

                    ${complaint.id}

                </td>


                <td>

                    ${complaint.residentName}

                </td>


                <td>

                    ${complaint.roomNumber}

                </td>


                <td>

                    ${complaint.contact}

                </td>


                <td>

                    ${complaint.category}

                </td>


                <td>

                    ${complaint.description}

                </td>


                <td>

                    <span class="badge ${priorityClass}">

                        ${complaint.priority}

                    </span>

                </td>


                <td>

                    <span class="badge ${statusClass}">

                        ${complaint.status}

                    </span>

                    <br>

                    ${statusControl}

                </td>


                <td>

                    ${complaint.date}

                </td>


                <td>

                    ${actionButtons}

                </td>

            </tr>

        `;

    });


    table += "</table>";

    complaintBox.innerHTML = table;

}


// ================= SEARCH / FILTER =================

function filterComplaints() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filteredComplaints =
        allComplaints.filter(complaint => {


            const matchesSearch =

                complaint.residentName
                    .toLowerCase()
                    .includes(searchText)

                ||

                complaint.roomNumber
                    .toLowerCase()
                    .includes(searchText)

                ||

                complaint.description
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =

                selectedCategory === "" ||

                complaint.category === selectedCategory;


            const matchesStatus =

                selectedStatus === "" ||

                complaint.status === selectedStatus;


            return (

                matchesSearch &&

                matchesCategory &&

                matchesStatus

            );

        });


    displayComplaints(filteredComplaints);

}


// ================= SAVE COMPLAINT =================

async function saveComplaint(event) {

    event.preventDefault();


    const complaint = {

        residentName:
            document.getElementById("residentName").value,

        roomNumber:
            document.getElementById("roomNumber").value,

        contact:
            document.getElementById("contact").value,

        category:
            document.getElementById("category").value,

        description:
            document.getElementById("description").value,

        priority:
            document.getElementById("priority").value,

        date:
            document.getElementById("date").value,

        additionalInfo:
            document.getElementById("additionalInfo").value

    };


    let url =
        "http://localhost:3000/api/complaints";

    let method = "POST";


    // EDITING EXISTING COMPLAINT

    if (editingId !== null) {

        url =
            `http://localhost:3000/api/complaints/${editingId}`;

        method = "PUT";

    }


    try {

        const response = await fetch(url, {

            method: method,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(complaint)

        });


        const data = await response.json();


        if (response.ok) {


            if (editingId !== null) {

                alert(
                    "Complaint updated successfully"
                );

            }

            else {

                alert(
                    "Complaint created successfully"
                );

            }


            editingId = null;

            complaintForm.reset();

            resetForm();

            formSection.classList.add("hidden");

            getComplaints();

        }


        else {

            alert(data.message);

        }

    }


    catch (error) {

        console.error(error);

        alert("Server is not running");

    }

}


// ================= EDIT COMPLAINT =================

async function editComplaint(id) {

    try {

        const response = await fetch(

            `http://localhost:3000/api/complaints/${id}`

        );


        const complaint = await response.json();


        if (!response.ok) {

            alert(complaint.message);

            return;

        }


        // ================= RESOLVED PROTECTION =================

        if (complaint.status === "Resolved") {

            alert(
                "Resolved complaints cannot be edited"
            );

            return;

        }


        editingId = id;


        document.getElementById("residentName").value =
            complaint.residentName;


        document.getElementById("roomNumber").value =
            complaint.roomNumber;


        document.getElementById("contact").value =
            complaint.contact;


        document.getElementById("category").value =
            complaint.category;


        document.getElementById("description").value =
            complaint.description;


        document.getElementById("priority").value =
            complaint.priority;


        document.getElementById("date").value =
            complaint.date;


        document.getElementById("additionalInfo").value =
            complaint.additionalInfo;


        formTitle.textContent =
            "Edit Complaint";


        submitButton.textContent =
            "Update Complaint";


        formSection.classList.remove("hidden");


        formSection.scrollIntoView({

            behavior: "smooth"

        });

    }


    catch (error) {

        console.error(error);

        alert("Server is not running");

    }

}


// ================= RESET FORM =================

function resetForm() {

    formTitle.textContent =
        "Create Complaint";

    submitButton.textContent =
        "Create Complaint";

}


// ================= UPDATE STATUS =================

async function updateStatus(id, status) {

    try {

        const response = await fetch(

            `http://localhost:3000/api/complaints/${id}/status`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    status: status

                })

            }

        );


        const data = await response.json();


        if (response.ok) {

            alert(
                "Complaint status updated successfully"
            );

            getComplaints();

        }


        else {

            alert(data.message);

            getComplaints();

        }

    }


    catch (error) {

        console.error(error);

        alert("Server is not running");

    }

}


// ================= DELETE =================

async function deleteComplaint(id) {

    const confirmDelete = confirm(

        "Are you sure you want to delete this complaint?"

    );


    if (!confirmDelete) {

        return;

    }


    try {

        const response = await fetch(

            `http://localhost:3000/api/complaints/${id}`,

            {

                method: "DELETE"

            }

        );


        const data = await response.json();


        if (response.ok) {

            alert(
                "Complaint deleted successfully"
            );

            getComplaints();

        }


        else {

            alert(data.message);

        }

    }


    catch (error) {

        console.error(error);

        alert("Server is not running");

    }

}


// ================= LOAD DATA =================

getComplaints();


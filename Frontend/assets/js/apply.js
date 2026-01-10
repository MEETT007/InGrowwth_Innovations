/* ===================== APPLY PAGE LOGIC ===================== */
/* 1) Role data (from your spec) */
const ROLES = {
    "full-stack-developer": {
        title: "Full-Stack Developer",
        responsibilities: [
            "Design, develop, and maintain scalable web applications.",
            "Work on both frontend (React/Angular/Vue) and backend (Node.js, Express, databases).",
            "Collaborate with UI/UX designers to translate designs into functional applications.",
            "Integrate cloud services and APIs into applications.",
            "Optimize applications for performance, responsiveness, and security.",
            "Troubleshoot and debug technical issues across the stack.",
        ],
        skills: [
            "Proficiency in JavaScript, React, Node.js.",
            "Understanding of databases (SQL/NoSQL).",
            "Familiarity with cloud platforms (AWS, GCP, Azure).",
            "Strong problem-solving and debugging skills.",
        ],
    },
    "cloud-solutions-architect": {
        title: "Cloud Solutions Architect",
        responsibilities: [
            "Design and implement secure, scalable, and reliable cloud solutions.",
            "Assess client requirements and propose best-fit cloud strategies.",
            "Lead cloud migrations, infrastructure automation, and optimization.",
            "Ensure compliance with cloud security standards.",
            "Provide technical leadership on cloud architecture to development teams.",
            "Monitor and improve system performance on cloud environments.",
        ],
        skills: [
            "Expertise in AWS, Azure, or GCP.",
            "Knowledge of containerization (Docker, Kubernetes).",
            "Strong understanding of cloud networking & security.",
            "Experience in DevOps tools (CI/CD pipelines, Terraform, Ansible).",
        ],
    },
    "ui-ux-designer": {
        title: "UI/UX Designer",
        responsibilities: [
            "Create user-friendly, visually appealing mobile and web interfaces.",
            "Conduct user research to understand target audience needs.",
            "Develop wireframes, mockups, and prototypes using design tools.",
            "Collaborate with developers to ensure smooth implementation.",
            "Maintain brand consistency across all digital platforms.",
            "Conduct usability testing and iterate designs based on feedback.",
        ],
        skills: [
            "Proficiency in Figma, Sketch, Adobe XD.",
            "Strong portfolio showcasing UI/UX design projects.",
            "Understanding of design principles, typography, and color theory.",
            "Knowledge of responsive design and accessibility standards.",
        ],
    },
    "data-scientist": {
        title: "Data Scientist (AI/ML)",
        responsibilities: [
            "Collect, clean, and preprocess large datasets.",
            "Build, train, and deploy machine learning models to solve business problems.",
            "Analyze data trends and provide actionable insights.",
            "Work with engineers to integrate ML models into production systems.",
            "Research and implement cutting-edge algorithms in AI/ML.",
            "Communicate findings to stakeholders in clear and concise ways.",
        ],
        skills: [
            "Strong background in Python/R, Pandas, NumPy, Scikit-learn, TensorFlow/PyTorch.",
            "Knowledge of statistics, probability, and mathematics.",
            "Experience with big data tools (Spark, Hadoop) is a plus.",
            "Ability to visualize data with Matplotlib, Seaborn, Power BI, or Tableau.",
        ],
    },
};

/* 2) Read role from URL and render */
(function renderRole() {
    const params = new URLSearchParams(location.search);
    const key = params.get("role");
    if (!key || !ROLES[key]) {
        // If role missing/invalid, send them back to Careers
        window.location.href = "careers.html";
        return;
    }

    const role = ROLES[key];
    document.title = `Apply – ${role.title} | InGrowwth Innovations`;

    document.getElementById("jobTitle").textContent = role.title;

    const respList = document.getElementById("respList");
    const skillsList = document.getElementById("skillsList");

    role.responsibilities.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        respList.appendChild(li);
    });

    role.skills.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        skillsList.appendChild(li);
    });

    // Prefill "Applying For" (native <select>)
    const applyingFor = document.getElementById("applyingFor");
    if (applyingFor) {
        const want = role.title.toLowerCase();
        // Try to set exact value; if not, find matching option by text/value (case-insensitive)
        let set = false;
        for (const opt of applyingFor.options) {
            if (opt.value.toLowerCase() === want || opt.text.toLowerCase() === want) {
                applyingFor.value = opt.value;
                set = true;
                break;
            }
        }
        if (!set) applyingFor.selectedIndex = 0; // fallback to "-- Select --"
    }
})();

/* 3) Resume upload UX (button triggers choose; show filename) */
const resumeInput = document.getElementById("resume");
const resumeBtn = document.getElementById("resumeBtn");
const resumeName = document.getElementById("resumeName");

if (resumeBtn && resumeInput) {
    resumeBtn.addEventListener("click", () => resumeInput.click());
    resumeInput.addEventListener("change", () => {
        const f = resumeInput.files[0];
        resumeName.textContent = f ? f.name : "No file chosen";
    });
}

/* 3.1) Auto-mark required labels with red asterisk (CSS handles the red color) */
(function markRequiredLabels() {
    // Required fields (updated: workExp & applyingFor included)
    const requiredIds = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "workExp",
        "applyingFor",
        "github",
        "linkedin",
        "resume",
    ];

    requiredIds.forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;

        // Try to find label via [for]
        let label = document.querySelector(`label[for="${id}"]`);

        // Special handling (e.g., resume label has no 'for' in provided HTML)
        if (!label) {
            const fieldWrapper =
                input.closest("div")?.parentElement || input.closest("div");
            if (fieldWrapper) {
                const maybe = fieldWrapper.querySelector("label");
                if (maybe) label = maybe;
            }
        }

        if (label && !label.classList.contains("required")) {
            label.classList.add("required");
        }
    });
})();

/* 4) Validation helpers */
const form = document.getElementById("applyForm");
const submitBtn = document.getElementById("submitBtn");

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;    // name@domain.com
const phoneRegex = /^[6-9]\d{9}$/;                      // 10-digit Indian mobile starting 6–9
const urlRegex = /^https?:\/\/[^\s]+$/i;                // must start with http(s)://

// Acceptable "Work Experience" formats:
// - "Fresher", "0", "0 years", etc.
// - "6 months", "1 year", "2.5 years"
// - "2-3 years" or "2–3 years"
const expOk = (s) => {
    if (!s) return false;
    const v = s.trim();
    const patterns = [
        /^(fresher|fresh|entry[-\s]?level|0(\s*(months?|yrs?|years?))?)$/i,
        /^\d+(\.\d+)?\s*(months?|m|yrs?|years?)$/i,
        /^\d+\s*[-–]\s*\d+\s*(months?|m|yrs?|years?)$/i,
    ];
    return patterns.some((re) => re.test(v));
};

// Show/hide error helpers
function showError(name, msg) {
    const el = document.querySelector(`[data-error="${name}"]`);
    if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
    }
}
function hideError(name) {
    const el = document.querySelector(`[data-error="${name}"]`);
    if (el) {
        el.textContent = "";
        el.classList.add("hidden");
    }
}

/* 4.1) Input sanitation helpers */
function normalizePhone(raw) {
    if (!raw) return raw;
    let p = String(raw).replace(/[^\d]/g, ""); // strip non-digits
    // Handle +91 / 91 prefix
    if (p.length === 12 && p.startsWith("91")) p = p.slice(2);
    if (p.length > 10) p = p.slice(-10); // keep last 10 digits
    return p;
}
function normalizeUrl(u) {
    if (!u) return u;
    let s = u.trim();
    if (!/^https?:\/\//i.test(s)) s = "https://" + s;
    return s;
}
function trimSetValue(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v;
}

/* 4.2) Main validator (updated for workExp & applyingFor) */
function validateForm() {
    let ok = true;

    // Read
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let workExp = document.getElementById("workExp")?.value.trim() || "";
    // For <select>, .value is the selected option's value
    let applyingFor = document.getElementById("applyingFor")?.value.trim() || "";
    let github = document.getElementById("github").value.trim();
    let linkedin = document.getElementById("linkedin").value.trim();
    const resume = resumeInput?.files?.[0];

    // Sanitize (reflect back)
    firstName = firstName.replace(/\s+/g, " ");
    lastName = lastName.replace(/\s+/g, " ");
    trimSetValue("firstName", firstName);
    trimSetValue("lastName", lastName);

    phone = normalizePhone(phone);
    trimSetValue("phone", phone);

    if (github && !/^https?:\/\//i.test(github)) {
        github = normalizeUrl(github);
        trimSetValue("github", github);
    }
    if (linkedin && !/^https?:\/\//i.test(linkedin)) {
        linkedin = normalizeUrl(linkedin);
        trimSetValue("linkedin", linkedin);
    }

    // Validate names
    if (!firstName) { showError("firstName", "First name is required."); ok = false; } else hideError("firstName");
    if (!lastName) { showError("lastName", "Last name is required."); ok = false; } else hideError("lastName");

    // Validate email
    if (!email) {
        showError("email", "Email is required."); ok = false;
    } else if (!emailRegex.test(email)) {
        showError("email", "Enter a valid email (e.g., name@domain.com)."); ok = false;
    } else hideError("email");

    // Validate phone
    if (!phone) {
        showError("phone", "Contact number is required."); ok = false;
    } else if (!phoneRegex.test(phone)) {
        showError("phone", "Enter a valid 10-digit mobile (starts 6–9)."); ok = false;
    } else hideError("phone");

    // Validate work experience
    if (!workExp) {
        showError("workExp", "Work experience is required."); ok = false;
    } else if (!expOk(workExp)) {
        showError("workExp", "Use formats like 'Fresher', '6 months', '1 year', or '2-3 years'."); ok = false;
    } else hideError("workExp");

    // Validate applyingFor (must be one of the 4 titles)
    const allowedTitles = new Set(Object.values(ROLES).map(r => r.title.toLowerCase()));
    if (!applyingFor) {
        showError("applyingFor", "Please choose a role."); ok = false;
    } else if (!allowedTitles.has(applyingFor.toLowerCase())) {
        showError("applyingFor", "Pick a role from the list."); ok = false;
    } else hideError("applyingFor");

    // Validate links
    if (!github) {
        showError("github", "GitHub link is required."); ok = false;
    } else if (!urlRegex.test(github)) {
        showError("github", "URL must start with http(s)://"); ok = false;
    } else hideError("github");

    if (!linkedin) {
        showError("linkedin", "LinkedIn link is required."); ok = false;
    } else if (!urlRegex.test(linkedin)) {
        showError("linkedin", "URL must start with http(s)://"); ok = false;
    } else hideError("linkedin");

    // Validate resume
    if (!resume) {
        showError("resume", "Please upload your resume (PDF/DOC/DOCX, max 5MB)."); ok = false;
    } else {
        const types = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!types.includes(resume.type)) {
            showError("resume", "Allowed types: PDF, DOC, DOCX."); ok = false;
        } else if (resume.size > 5 * 1024 * 1024) {
            showError("resume", "File too large. Max 5MB."); ok = false;
        } else hideError("resume");
    }

    return ok;
}

/* 5) Popup + submit behaviour */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMsg = document.getElementById("modalMsg");
const modalOk = document.getElementById("modalOk");

function openModal(title, msg, redirect = false) {
    modalTitle.textContent = title;
    modalMsg.textContent = msg;
    modal.classList.remove("hidden");

    const onOk = () => {
        modal.classList.add("hidden");
        modalOk.removeEventListener("click", onOk);
        if (redirect) location.href = "index.html";
    };
    modalOk.addEventListener("click", onOk);
}

// --- Configuration ---
// Relies on assets/js/apiConfig.js to define window.API_BASE_URL
// If that file is missing, it falls back to production as a safety net.
const API_BASE_URL = window.API_BASE_URL || "https://ingrowwth-innovations-nbih.onrender.com";

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Visual “active” color change
        submitBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
        submitBtn.classList.add("bg-green-600", "hover:bg-green-700");
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Submitting...";

        if (!validateForm()) {
            openModal("Please fill the required data", "Some fields are missing or invalid. Fix them and try again.");
            // Revert color back so user can try again
            submitBtn.classList.remove("bg-green-600", "hover:bg-green-700");
            submitBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            return;
        }

        try {
            const formData = new FormData(form);

            const response = await fetch(`${API_BASE_URL}/submit_application`, {
                method: "POST",
                body: formData, // FormData automatically sets Content-Type to multipart/form-data
            });

            const result = await response.json();

            if (response.ok && result.success) {
                openModal("Application Submitted!", result.message || "Thanks for applying!", true);
                form.reset();
                if (resumeName) resumeName.textContent = "No file chosen";
            } else {
                openModal("Submission Failed", result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            openModal("Network Error", "Could not connect to the server. Please ensure the backend is running.");
        } finally {
            // restore button state
            submitBtn.classList.remove("bg-green-600", "hover:bg-green-700");
            submitBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

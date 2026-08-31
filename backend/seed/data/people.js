//The one password every seeded account shares. Demo-obvious on purpose: these
//accounts exist to be handed out, and none of them guards anything real.
export const DEMO_PASSWORD = "Learnr@2026";

//Avatars use the exact URL the signup controller builds, so a seeded account is
//indistinguishable from a registered one.
export const avatarFor = (firstName, lastName) =>
    `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`;

//--- instructors ----------------------------------------------------------
//Four, so the catalog is not authored by a single person. Each writes in a
//different area; their bios are what the course detail page prints under the
//author, so they are written as real copy rather than filler.
export const INSTRUCTORS = [
    {
        key : "ananya",
        firstName : "Ananya",
        lastName : "Iyer",
        email : "ananya.iyer@learnr.dev",
        gender : "Female",
        dateOfBirth : "1989-03-14",
        contactNumber : 9812345601,
        about : "Frontend engineer with eleven years building interfaces for payments and healthcare. I teach the parts of React that survive contact with production - state you can reason about, and tests that fail for the right reasons."
    },
    {
        key : "rohan",
        firstName : "Rohan",
        lastName : "Mehta",
        email : "rohan.mehta@learnr.dev",
        gender : "Male",
        dateOfBirth : "1985-11-02",
        contactNumber : 9812345602,
        about : "I spent eight years on backend infrastructure before moving to teaching full time. My courses are opinionated about the boring things: schema design, error handling, and knowing what your database is actually doing."
    },
    {
        key : "priya",
        firstName : "Priya",
        lastName : "Nair",
        email : "priya.nair@learnr.dev",
        gender : "Female",
        dateOfBirth : "1992-07-21",
        contactNumber : 9812345603,
        about : "Data scientist working mostly in forecasting and experimentation. I care that you can explain a model to someone who has to act on it, not just fit one that scores well offline."
    },
    {
        key : "vikram",
        firstName : "Vikram",
        lastName : "Desai",
        email : "vikram.desai@learnr.dev",
        gender : "Male",
        dateOfBirth : "1987-01-30",
        contactNumber : 9812345604,
        about : "Product designer turned educator. I came to design from architecture, which is why my courses spend so long on structure and hierarchy before anything gets coloured in."
    }
];

//--- students -------------------------------------------------------------
//The first is the primary demo login and gets the rich history in phase 05.
//The rest exist so enrolment counts and review authorship look like a real
//platform rather than one person talking to themselves.
export const STUDENTS = [
    {
        key : "aarav",
        firstName : "Aarav",
        lastName : "Sharma",
        email : "aarav.sharma@learnr.dev",
        gender : "Male",
        dateOfBirth : "2001-05-09",
        contactNumber : 9898765401,
        about : "Final-year computer science student teaching myself the things my degree skips. Currently working through backend and data science tracks."
    },
    {
        key : "diya",
        firstName : "Diya",
        lastName : "Kulkarni",
        email : "diya.kulkarni@learnr.dev",
        gender : "Female",
        dateOfBirth : "1998-09-17",
        contactNumber : 9898765402,
        about : "Career switcher moving from mechanical engineering into web development."
    },
    {
        key : "kabir",
        firstName : "Kabir",
        lastName : "Singh",
        email : "kabir.singh@learnr.dev",
        gender : "Male",
        dateOfBirth : "1995-12-04",
        contactNumber : 9898765403,
        about : "Backend developer at a logistics startup. Here mostly for the system design and database material."
    },
    {
        key : "meera",
        firstName : "Meera",
        lastName : "Reddy",
        email : "meera.reddy@learnr.dev",
        gender : "Female",
        dateOfBirth : "2000-02-26",
        contactNumber : 9898765404,
        about : "Design student picking up enough frontend to build my own portfolio work."
    },
    {
        key : "arjun",
        firstName : "Arjun",
        lastName : "Menon",
        email : "arjun.menon@learnr.dev",
        gender : "Male",
        dateOfBirth : "1993-08-11",
        contactNumber : 9898765405,
        about : "QA engineer trying to move into data. Slowly."
    },
    {
        key : "sara",
        firstName : "Sara",
        lastName : "Qureshi",
        email : "sara.qureshi@learnr.dev",
        gender : "Female",
        dateOfBirth : "1997-04-19",
        contactNumber : 9898765406,
        about : "Freelance developer. I take courses between contracts to stay current."
    }
];

//--- admin ----------------------------------------------------------------
//The only account that can reach create-category.
export const ADMIN = {
    key : "admin",
    firstName : "Neha",
    lastName : "Kapoor",
    email : "admin@learnr.dev",
    gender : "Female",
    dateOfBirth : "1990-06-08",
    contactNumber : 9800000001,
    about : "Platform administrator."
};

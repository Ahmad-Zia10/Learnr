//Purchase history and progress for the primary demo student.
//
//Phase 04 enrolled students so they could review courses, but enrolment alone
//leaves Purchase History empty. This phase puts an order behind every paid
//enrolment, and gives the demo login a deliberately mixed set of progress
//states so the dashboard filters have something to separate.

//Days ago, so the history reads as a timeline rather than everything landing
//at once. Orders are grouped: a cart checkout buys several courses together.
export const ORDER_PLAN = [
    { student : "aarav", daysAgo : 96, courses : ["python-data", "sql-analysts"] },
    { student : "aarav", daysAgo : 62, courses : ["node-apis"] },
    { student : "aarav", daysAgo : 34, courses : ["react-foundations", "web-performance"] },
    { student : "aarav", daysAgo : 11, courses : ["ml-foundations", "stats-practice", "mongodb-depth"] },
    { student : "aarav", daysAgo : 8,  courses : ["deep-learning"] },
    //a failed attempt on a course he does not own, to prove a failed order
    //grants nothing
    { student : "aarav", daysAgo : 5,  courses : ["docker-ci"], status : "Failed" },

    { student : "diya",  daysAgo : 80, courses : ["css-layout", "react-foundations"] },
    { student : "diya",  daysAgo : 41, courses : ["ts-for-react", "ui-fundamentals"] },
    { student : "diya",  daysAgo : 30, courses : ["sql-analysts"] },
    { student : "diya",  daysAgo : 9,  courses : ["node-apis", "figma-workflow", "react-native"] },

    { student : "kabir", daysAgo : 73, courses : ["node-apis", "mongodb-depth"] },
    { student : "kabir", daysAgo : 45, courses : ["docker-ci"] },
    { student : "kabir", daysAgo : 38, courses : ["react-foundations", "sql-analysts"] },
    { student : "kabir", daysAgo : 15, courses : ["ts-for-react", "testing-frontend", "ml-foundations"] },

    { student : "meera", daysAgo : 88, courses : ["ui-fundamentals", "figma-workflow"] },
    { student : "meera", daysAgo : 50, courses : ["css-layout", "react-foundations"] },
    { student : "meera", daysAgo : 20, courses : ["react-native", "flutter-intro", "testing-frontend"] },
    { student : "meera", daysAgo : 6,  courses : ["python-data"] },

    { student : "arjun", daysAgo : 67, courses : ["stats-practice", "python-data"] },
    { student : "arjun", daysAgo : 44, courses : ["sql-analysts"] },
    { student : "arjun", daysAgo : 28, courses : ["testing-frontend", "css-layout"] },
    { student : "arjun", daysAgo : 12, courses : ["ml-foundations", "deep-learning", "docker-ci", "flutter-intro"] },

    { student : "sara",  daysAgo : 91, courses : ["react-foundations", "ts-for-react"] },
    { student : "sara",  daysAgo : 55, courses : ["node-apis", "docker-ci"] },
    { student : "sara",  daysAgo : 36, courses : ["python-data", "sql-analysts"] },
    { student : "sara",  daysAgo : 24, courses : ["web-performance", "ml-foundations", "ui-fundamentals"] },
    { student : "sara",  daysAgo : 3,  courses : ["mongodb-depth"] }
];

//The dashboard filters on Pending versus Completed, and the course viewer
//shows ticks against watched lectures, so the demo login needs one course in
//each state rather than a uniform percentage.
//
//`fraction` is the share of the course's lectures marked watched, always taken
//from the start of the course - partial progress has to be a prefix of the
//lecture list, or the sidebar shows ticks scattered past where the student
//supposedly stopped.
export const PROGRESS_PLAN = [
    { student : "aarav", course : "sql-analysts",     fraction : 1    },
    { student : "aarav", course : "python-data",      fraction : 0.6  },
    { student : "aarav", course : "node-apis",        fraction : 0.15 },
    { student : "aarav", course : "react-foundations", fraction : 0.35 },
    //bought and never opened, so the Pending filter has a 0% row
    { student : "aarav", course : "ml-foundations",   fraction : 0    },

    { student : "diya",  course : "css-layout",       fraction : 1    },
    { student : "diya",  course : "react-foundations", fraction : 0.45 },
    { student : "diya",  course : "ui-fundamentals",  fraction : 0.2  },

    { student : "kabir", course : "node-apis",        fraction : 1    },
    { student : "kabir", course : "mongodb-depth",    fraction : 0.7  },
    { student : "kabir", course : "docker-ci",        fraction : 0.3  },

    { student : "meera", course : "ui-fundamentals",  fraction : 1    },
    { student : "meera", course : "figma-workflow",   fraction : 0.5  },

    { student : "arjun", course : "stats-practice",   fraction : 0.8  },
    { student : "arjun", course : "testing-frontend", fraction : 0.25 },

    { student : "sara",  course : "react-foundations", fraction : 1   },
    { student : "sara",  course : "docker-ci",        fraction : 0.55 }
];

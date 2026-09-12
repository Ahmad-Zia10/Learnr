//Reviews are written per course so they read like someone who took that
//specific course, not like generic praise pasted around. Ratings lean positive
//but not uniformly - an all-5.0 catalog is the fastest way to look fake.
//
//Each entry names a student by their key from people.js. A student may only
//review a course once, and only if they are enrolled, so the phase enrols the
//reviewer before writing the review.
export const REVIEWS = {
    "react-foundations" : [
        { student : "diya",  rating : 5, review : "The state chapter alone was worth it. I had been lifting state on instinct and getting it wrong; the section on derived state changed how I structure every component now." },
        { student : "meera", rating : 4, review : "Clear and well paced. I would have liked more on testing, but the routing section got me unstuck on a project I had parked for weeks." },
        { student : "aarav", rating : 5, review : "Best explanation of useEffect I have found. The point about effects being an escape hatch rather than a lifecycle hook finally made it click." },
        { student : "kabir", rating : 4, review : "Solid foundations. Coming from backend work I wanted more on data fetching patterns, but nothing here was wasted time." },
        { student : "sara",  rating : 5, review : "I have shipped React for two years and still picked up several things, particularly around modelling impossible states out of existence." }
    ],
    "css-layout" : [
        { student : "meera", rating : 5, review : "Grid finally makes sense. Teaching it by what problem each property solves, rather than listing the properties, is the right way round." },
        { student : "diya",  rating : 5, review : "The stacking context lesson answered a question that had annoyed me for a year. Worth it for that alone." },
        { student : "arjun", rating : 4, review : "Good course. The container queries section is slightly ahead of what I can use at work, but I am glad it is there." }
    ],
    "ts-for-react" : [
        { student : "sara",  rating : 4, review : "Practical rather than academic, which is what I wanted. The section on reading impenetrable error messages should be required watching." },
        { student : "kabir", rating : 5, review : "Typing the fetch layer properly has already caught two bugs in my own codebase. Immediately useful." },
        { student : "diya",  rating : 3, review : "Good content but assumes more React than the description suggests. I had to rewatch the generics section a few times." }
    ],
    "web-performance" : [
        { student : "aarav", rating : 5, review : "Measurement first, then fixes. I had been guessing at optimisations for months and this reframed the whole thing." },
        { student : "sara",  rating : 4, review : "The font loading section saved me about 400ms on a client site. Concrete and immediately applicable." }
    ],
    "testing-frontend" : [
        { student : "kabir", rating : 5, review : "Finally a testing course that admits most component tests are worthless. The part on tests surviving refactors is the whole point." },
        { student : "arjun", rating : 5, review : "As a QA engineer I expected to skim this. I did not. The section on removing flakiness from end to end tests is the best I have seen." },
        { student : "meera", rating : 4, review : "Clear and opinionated. Playwright section is excellent." }
    ],
    "python-data" : [
        { student : "aarav", rating : 5, review : "Built around genuinely messy data rather than clean teaching examples, which makes all the difference. The chapter on missing data decisions is excellent." },
        { student : "arjun", rating : 4, review : "Good introduction. groupby finally stopped being a mystery to me." },
        { student : "sara",  rating : 5, review : "The emphasis on analyses someone else can rerun six months later is something no other course I have taken bothers with." },
        { student : "meera", rating : 4, review : "Approachable even without much Python. I did have to pause often, but that is on me." }
    ],
    "stats-practice" : [
        { student : "arjun", rating : 5, review : "Explaining a p-value to someone who has to make a decision is a genuinely hard skill and this course teaches it directly." },
        { student : "aarav", rating : 4, review : "Careful and honest about what a result does and does not license you to say. Slower than I expected but that is the nature of the subject." }
    ],
    "sql-analysts" : [
        { student : "kabir", rating : 5, review : "Reading a query plan and acting on it is the part everyone skips. Free course, and better than paid ones I have taken." },
        { student : "aarav", rating : 5, review : "The join pitfalls section explained a bug I shipped last year. Wish I had watched this first." },
        { student : "diya",  rating : 4, review : "Started from nothing and came away able to write window functions. Very well structured." },
        { student : "sara",  rating : 5, review : "Hard to believe this is free. The performance chapter is the most useful hour I have spent this year." },
        { student : "arjun", rating : 4, review : "Good pacing. NULL and three-valued logic deserved a bit more time." }
    ],
    "node-apis" : [
        { student : "kabir", rating : 5, review : "Error handling in one place, validation at the boundary, tests against a real database. This is how it should be taught." },
        { student : "aarav", rating : 5, review : "The authentication chapter is worth the price by itself. Access and refresh tokens explained without hand waving." },
        { student : "sara",  rating : 4, review : "Thorough. The graceful shutdown and health check material is the sort of thing most courses leave out entirely." },
        { student : "diya",  rating : 4, review : "Dense but rewarding. I came in knowing very little backend and finished with something I actually deployed." }
    ],
    "mongodb-depth" : [
        { student : "kabir", rating : 4, review : "Embed or reference, decided by access patterns rather than instinct. That framing alone fixed my schema." },
        { student : "aarav", rating : 5, review : "The aggregation pipeline section is outstanding. $lookup and its cost is something I wish I had understood a year ago." }
    ],
    "docker-ci" : [
        { student : "kabir", rating : 5, review : "Multi-stage builds cut our image from 1.2GB to 180MB following this. Immediate, measurable payoff." },
        { student : "arjun", rating : 4, review : "Good practical coverage. Deploy and rollback is the section I keep coming back to." },
        { student : "sara",  rating : 5, review : "Parity between local and production is treated seriously here rather than waved at. Excellent." }
    ],
    "react-native" : [
        { student : "meera", rating : 4, review : "Honest about the platform differences you cannot abstract away, which I appreciated. The release chapter saved me days." },
        { student : "diya",  rating : 3, review : "Solid content but I hit a lot of tooling friction that the course could not really help with. Not the instructor's fault." }
    ],
    "flutter-intro" : [
        { student : "meera", rating : 4, review : "Building one real app end to end beats a tour of the widget catalogue. Wish it were longer." },
        { student : "arjun", rating : 4, review : "Good introduction to Dart and Flutter together. Choosing a state solution was the most useful part for me." }
    ],
    "ml-foundations" : [
        { student : "aarav", rating : 5, review : "The section on when machine learning is the wrong answer should open every course on the subject. Refreshingly honest." },
        { student : "arjun", rating : 5, review : "Data leakage was explained better here than anywhere else I have looked. I found leakage in my own project the next day." },
        { student : "sara",  rating : 4, review : "Well structured and rigorous about evaluation. Requires more statistics comfort than the prerequisites suggest." },
        { student : "kabir", rating : 4, review : "Good coverage. The deployment and drift monitoring chapter is a welcome addition." }
    ],
    "deep-learning" : [
        { student : "arjun", rating : 5, review : "Writing the training loop by hand before reaching for abstractions was the right call. Debugging a model that will not learn is the standout chapter." },
        { student : "aarav", rating : 4, review : "Demanding, and worth it. I would not attempt this without the foundations course first." }
    ],
    "ui-fundamentals" : [
        { student : "meera", rating : 5, review : "Hierarchy before decoration. I have been designing backwards for years and this reordered how I approach a blank canvas." },
        { student : "diya",  rating : 5, review : "As a developer who kept producing ugly interfaces, the spacing systems chapter was a revelation." },
        { student : "sara",  rating : 4, review : "Good grounding. The critique section taught me to describe what is wrong rather than just feeling it." }
    ],
    "figma-workflow" : [
        { student : "meera", rating : 5, review : "Auto layout the way it was intended, rather than the way I had been fighting it. Immediately faster." },
        { student : "diya",  rating : 4, review : "The handoff chapter improved how I work with our developers more than anything else I have tried." }
    ]
};

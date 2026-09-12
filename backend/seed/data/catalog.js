//Course thumbnails and lecture videos are remote URLs. The schema stores a
//plain string and nothing re-uploads it, so a seeded course is indistinguishable
//from one uploaded through the instructor form - and no Cloudinary quota is spent.
//
//Every URL below was checked to respond before being used here. The clips answer
//206 Partial Content, so the player can seek rather than only play from the start.
export const VIDEOS = [
    "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
    "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
];

const shot = (id) => `https://images.unsplash.com/photo-${id}?w=720&q=70&auto=format&fit=crop`;

export const CATEGORIES = [
    {
        key : "web",
        name : "Web Development",
        description : "Build for the browser - from your first component to an application you can put in front of users."
    },
    {
        key : "data",
        name : "Data Science",
        description : "Turn raw data into decisions people can act on, with the statistics and tooling the work actually needs."
    },
    {
        key : "backend",
        name : "Backend & DevOps",
        description : "The systems behind the interface: APIs, databases, and the pipelines that carry them to production."
    },
    {
        key : "mobile",
        name : "Mobile Development",
        description : "Ship to iOS and Android without pretending the two platforms are the same thing."
    },
    {
        key : "ml",
        name : "Machine Learning",
        description : "Models that hold up outside a notebook - trained, evaluated honestly, and deployed."
    },
    {
        key : "design",
        name : "Design",
        description : "Interface and product design grounded in structure, hierarchy and the people using the thing."
    }
];

//tag arrays feed the pill list on the course information form; instructions feed
//the requirements list. Both are empty on every course in the old database.
export const COURSES = [
    //--- Web Development ---------------------------------------------------
    {
        key : "react-foundations",
        category : "web",
        instructor : "ananya",
        courseName : "React Foundations",
        courseDescription : "Learn React by building interfaces that survive real users. Components, state, effects, and the mental model that keeps an application maintainable past week three.",
        whatYouWillLearn : "Compose interfaces from components you can reuse without fighting them\nModel state so that impossible UI states cannot happen\nUnderstand when effects are the wrong tool, and what to reach for instead\nShip a production build with routing and data loading in place",
        price : 2499,
        tag : ["React", "JavaScript", "Frontend", "Hooks"],
        instructions : ["Comfortable with JavaScript functions and array methods", "A code editor and Node 20+ installed"],
        thumbnail : shot("1633356122544-f134324a6cee"),
        sections : [
            { name : "Getting Oriented", lectures : ["Why React exists", "Setting up with Vite", "Your first component", "JSX in ten minutes"] },
            { name : "State and Props", lectures : ["Props are inputs", "useState in practice", "Lifting state up", "Derived state and why you rarely store it", "Forms without tears"] },
            { name : "Effects and Data", lectures : ["What useEffect is really for", "Fetching without race conditions", "Loading and error states", "Cleaning up subscriptions"] },
            { name : "Routing and Structure", lectures : ["React Router basics", "Nested routes and layouts", "Code splitting a route", "Project structure that scales"] },
            { name : "Shipping It", lectures : ["Building for production", "Environment configuration", "Deploying a static build"] }
        ]
    },
    {
        key : "css-layout",
        category : "web",
        instructor : "ananya",
        courseName : "Modern CSS Layout",
        courseDescription : "Flexbox and Grid explained by what they solve, not by their property lists. Build layouts that hold up on every screen without a pile of media queries.",
        whatYouWillLearn : "Choose between Flexbox and Grid with confidence\nBuild responsive layouts that need almost no breakpoints\nUnderstand stacking contexts and why your z-index does nothing\nUse container queries and modern units in production",
        price : 1499,
        tag : ["CSS", "Flexbox", "Grid", "Responsive"],
        instructions : ["Basic HTML and CSS", "No framework experience needed"],
        thumbnail : shot("1507721999472-8ed4421c4af2"),
        sections : [
            { name : "The Box Model, Properly", lectures : ["Content, padding, border, margin", "Margin collapse explained", "box-sizing and why border-box won"] },
            { name : "Flexbox", lectures : ["Main axis and cross axis", "flex-grow, shrink, basis", "Alignment in one dimension", "Common flex patterns"] },
            { name : "Grid", lectures : ["Rows, columns and tracks", "Named grid areas", "minmax and auto-fit", "Grid for whole-page layout"] },
            { name : "Responsive Without Breakpoints", lectures : ["Intrinsic sizing", "clamp() for fluid type", "Container queries"] }
        ]
    },
    {
        key : "ts-for-react",
        category : "web",
        instructor : "ananya",
        courseName : "TypeScript for React Developers",
        courseDescription : "Add types to a React codebase without the ceremony. Practical typing for props, hooks, and API responses, aimed at people who already ship JavaScript.",
        whatYouWillLearn : "Type components, props and children accurately\nWrite hooks that infer their own return types\nModel API responses so bad data fails at the boundary\nRead and fix the error messages that look impenetrable",
        price : 2999,
        tag : ["TypeScript", "React", "Types"],
        instructions : ["Working knowledge of React", "Some JavaScript experience"],
        thumbnail : shot("1516116216624-53e697fedbea"),
        sections : [
            { name : "Types You Will Actually Use", lectures : ["Structural typing", "Unions and narrowing", "Generics without the headache"] },
            { name : "Typing Components", lectures : ["Props and children", "Events and refs", "Polymorphic components"] },
            { name : "Typing Data", lectures : ["Validating at the boundary", "Discriminated unions for state", "Typing a fetch layer"] }
        ]
    },

    //--- Data Science ------------------------------------------------------
    {
        key : "python-data",
        category : "data",
        instructor : "priya",
        courseName : "Python for Data Analysis",
        courseDescription : "Pandas, NumPy and the habits that keep an analysis reproducible. Built around real messy datasets rather than clean teaching examples.",
        whatYouWillLearn : "Load, clean and reshape data that arrives in bad condition\nWrite analyses someone else can rerun six months later\nUse groupby and joins without guessing at the result\nProduce charts that answer a question rather than decorate a slide",
        price : 2799,
        tag : ["Python", "Pandas", "NumPy", "Analysis"],
        instructions : ["Basic Python syntax", "Jupyter or VS Code"],
        thumbnail : shot("1551288049-bebda4e38f71"),
        sections : [
            { name : "Foundations", lectures : ["Why pandas", "Series and DataFrames", "Indexing that behaves", "Reading real files"] },
            { name : "Cleaning", lectures : ["Missing data decisions", "Types and coercion", "Duplicates and keys", "Dates and time zones"] },
            { name : "Reshaping", lectures : ["groupby properly", "Joins and their pitfalls", "Long versus wide", "Window functions"] },
            { name : "Communicating", lectures : ["Charts that answer questions", "Notebooks others can run", "Exporting results"] }
        ]
    },
    {
        key : "stats-practice",
        category : "data",
        instructor : "priya",
        courseName : "Statistics You Can Defend",
        courseDescription : "The statistics that come up in product work: sampling, uncertainty, and experiments. Emphasis on what a result does and does not license you to say.",
        whatYouWillLearn : "Quantify uncertainty rather than reporting a single number\nDesign an experiment before running it\nExplain a p-value to someone who has to make a decision\nSpot the analyses that will not replicate",
        price : 1999,
        tag : ["Statistics", "Experiments", "A/B Testing"],
        instructions : ["Comfort with basic algebra", "Some Python or R helps but is not required"],
        thumbnail : shot("1460925895917-afdab827c52f"),
        sections : [
            { name : "Uncertainty", lectures : ["Sampling and what it costs you", "Confidence intervals", "Bootstrapping"] },
            { name : "Testing", lectures : ["Hypotheses in plain language", "p-values and their limits", "Power and sample size", "Multiple comparisons"] },
            { name : "Experiments", lectures : ["Designing an A/B test", "Randomisation and its failures", "Reading a result honestly"] }
        ]
    },
    {
        key : "sql-analysts",
        category : "data",
        instructor : "rohan",
        courseName : "SQL for Analysts",
        courseDescription : "From SELECT to window functions, with an eye on what the database is actually doing. Query the way people do when the table has a hundred million rows.",
        whatYouWillLearn : "Write joins you can reason about\nUse window functions for ranking and running totals\nRead a query plan and act on it\nAvoid the query shapes that quietly scan everything",
        price : 0,
        tag : ["SQL", "Postgres", "Databases"],
        instructions : ["No prior SQL needed", "Postgres or any SQL database to practise on"],
        thumbnail : shot("1544383835-bda2bc66a55d"),
        sections : [
            { name : "Querying", lectures : ["SELECT and WHERE", "ORDER and LIMIT", "NULL and three-valued logic"] },
            { name : "Combining Tables", lectures : ["Inner and outer joins", "Join pitfalls that inflate rows", "Subqueries versus CTEs"] },
            { name : "Aggregation", lectures : ["GROUP BY properly", "HAVING versus WHERE", "Window functions", "Running totals and ranks"] },
            { name : "Performance", lectures : ["Indexes and when they help", "Reading EXPLAIN", "Query shapes to avoid"] }
        ]
    },

    //--- Backend & DevOps --------------------------------------------------
    {
        key : "node-apis",
        category : "backend",
        instructor : "rohan",
        courseName : "Building APIs with Node and Express",
        courseDescription : "Design and build an HTTP API that holds up: routing, validation, authentication, error handling, and the tests that stop regressions.",
        whatYouWillLearn : "Structure an Express application that survives growth\nValidate input at the boundary and fail usefully\nImplement token authentication end to end\nWrite integration tests against a real database",
        price : 3499,
        tag : ["Node.js", "Express", "API", "Backend"],
        instructions : ["JavaScript fundamentals", "Node 20+ installed"],
        thumbnail : shot("1461749280684-dccba630e2f6"),
        sections : [
            { name : "Foundations", lectures : ["HTTP as the API contract", "Routing and middleware", "Project layout", "Configuration and secrets"] },
            { name : "Data", lectures : ["Modelling with Mongoose", "Validation at the boundary", "Transactions and consistency", "Pagination that scales"] },
            { name : "Authentication", lectures : ["Hashing passwords correctly", "Access and refresh tokens", "Protecting routes", "Common auth mistakes"] },
            { name : "Reliability", lectures : ["Error handling in one place", "Structured logging", "Integration tests", "Rate limiting"] },
            { name : "Production", lectures : ["Health checks", "Graceful shutdown", "Deploying behind a proxy"] }
        ]
    },
    {
        key : "mongodb-depth",
        category : "backend",
        instructor : "rohan",
        courseName : "MongoDB in Depth",
        courseDescription : "Schema design, indexing and the aggregation pipeline for people who have outgrown find(). Covers what actually happens on disk.",
        whatYouWillLearn : "Design documents around your access patterns\nBuild indexes that the planner will use\nWrite aggregation pipelines that read clearly\nUnderstand the trade-offs of embedding versus referencing",
        price : 2299,
        tag : ["MongoDB", "NoSQL", "Databases"],
        instructions : ["Basic MongoDB or SQL experience"],
        thumbnail : shot("1489875347897-49f64b51c1f8"),
        sections : [
            { name : "Modelling", lectures : ["Embed or reference", "Access patterns first", "Schema validation"] },
            { name : "Indexing", lectures : ["Single and compound indexes", "Index prefixes", "Reading explain output"] },
            { name : "Aggregation", lectures : ["The pipeline model", "$lookup and its cost", "$group and $facet", "Pipelines you can maintain"] }
        ]
    },
    {
        key : "docker-ci",
        category : "backend",
        instructor : "rohan",
        courseName : "Docker and CI Pipelines",
        courseDescription : "Containerise an application and get it through a pipeline into production. Practical Docker, GitHub Actions, and deployment that does not wake you at night.",
        whatYouWillLearn : "Write Dockerfiles that build fast and stay small\nCompose a local environment matching production\nBuild a CI pipeline with real gates\nDeploy with rollbacks you have actually tested",
        price : 3299,
        tag : ["Docker", "CI/CD", "DevOps", "GitHub Actions"],
        instructions : ["Command line comfort", "An application of your own to containerise"],
        thumbnail : shot("1618477388954-7852f32655ec"),
        sections : [
            { name : "Containers", lectures : ["Images and layers", "Writing a lean Dockerfile", "Multi-stage builds", "Volumes and networking"] },
            { name : "Local Environments", lectures : ["Compose for development", "Seeding a local database", "Parity with production"] },
            { name : "Pipelines", lectures : ["Anatomy of a workflow", "Caching that helps", "Gates worth enforcing", "Deploy and rollback"] }
        ]
    },

    //--- Mobile ------------------------------------------------------------
    {
        key : "react-native",
        category : "mobile",
        instructor : "ananya",
        courseName : "React Native from Scratch",
        courseDescription : "Build and ship a cross-platform app. Navigation, native modules, and the platform differences you cannot abstract away.",
        whatYouWillLearn : "Build screens that feel native on both platforms\nHandle navigation and deep links\nAccess the camera, storage and notifications\nShip to TestFlight and Play Console",
        price : 3799,
        tag : ["React Native", "Mobile", "iOS", "Android"],
        instructions : ["React experience required", "A Mac is needed for iOS builds"],
        thumbnail : shot("1512941937669-90a1b58e7e9c"),
        sections : [
            { name : "Getting Started", lectures : ["Expo or bare workflow", "Running on a device", "Styling differences from the web"] },
            { name : "Navigation", lectures : ["Stack and tab navigators", "Passing params", "Deep linking"] },
            { name : "Native Capabilities", lectures : ["Camera and media", "Local storage", "Push notifications", "Permissions"] },
            { name : "Release", lectures : ["Build configuration", "TestFlight", "Play Console submission"] }
        ]
    },
    {
        key : "flutter-intro",
        category : "mobile",
        instructor : "vikram",
        courseName : "Flutter Essentials",
        courseDescription : "Widgets, layout and state in Flutter, taught by building one real app end to end rather than a tour of the widget catalogue.",
        whatYouWillLearn : "Compose interfaces from Flutter's widget tree\nManage state without adopting four packages\nHandle async data and errors in the UI\nTheme an app so it looks intentional",
        price : 2599,
        tag : ["Flutter", "Dart", "Mobile"],
        instructions : ["Any programming experience", "Flutter SDK installed"],
        thumbnail : shot("1555949963-aa79dcee981c"),
        sections : [
            { name : "Widgets", lectures : ["Everything is a widget", "Stateless and stateful", "Layout in practice"] },
            { name : "State", lectures : ["setState and its limits", "InheritedWidget", "Choosing a state solution"] },
            { name : "Real Data", lectures : ["Async and futures", "Error and loading UI", "Persisting locally"] }
        ]
    },

    //--- Machine Learning --------------------------------------------------
    {
        key : "ml-foundations",
        category : "ml",
        instructor : "priya",
        courseName : "Machine Learning Foundations",
        courseDescription : "Supervised learning from the ground up. Regression, classification, and evaluation done honestly, with the failure modes that cost people their credibility.",
        whatYouWillLearn : "Frame a problem as a learning task, or recognise when you should not\nEvaluate a model in a way that predicts real performance\nDiagnose overfitting and leakage before deployment\nExplain a model to the people relying on it",
        price : 3999,
        tag : ["Machine Learning", "scikit-learn", "Python"],
        instructions : ["Python and pandas", "Comfort with basic statistics"],
        thumbnail : shot("1620712943543-bcc4688e7485"),
        sections : [
            { name : "Framing", lectures : ["When ML is the wrong answer", "Features and targets", "Train, validation, test"] },
            { name : "Models", lectures : ["Linear regression", "Logistic regression", "Trees and forests", "Gradient boosting"] },
            { name : "Evaluation", lectures : ["Metrics beyond accuracy", "Cross-validation", "Data leakage", "Calibration"] },
            { name : "Deployment", lectures : ["Serialising a model", "Serving predictions", "Monitoring for drift"] }
        ]
    },
    {
        key : "deep-learning",
        category : "ml",
        instructor : "priya",
        courseName : "Deep Learning with PyTorch",
        courseDescription : "Neural networks built from tensors upward. Training loops, architectures, and the debugging skills that separate a working model from a plausible one.",
        whatYouWillLearn : "Write and debug a training loop from scratch\nUnderstand backpropagation well enough to fix it\nApply transfer learning to a small dataset\nRecognise when a model is not learning and why",
        price : 4499,
        tag : ["PyTorch", "Deep Learning", "Neural Networks"],
        instructions : ["Python and NumPy", "Prior machine learning exposure recommended", "A GPU helps but is not required"],
        thumbnail : shot("1526379095098-d400fd0bf935"),
        sections : [
            { name : "Tensors", lectures : ["Tensors and autograd", "Building a model by hand", "The training loop"] },
            { name : "Architectures", lectures : ["Convolutional networks", "Sequence models", "Attention in brief"] },
            { name : "Training Well", lectures : ["Learning rates and schedules", "Regularisation", "Debugging a model that will not learn", "Transfer learning"] }
        ]
    },
    {
        key : "nlp-practical",
        category : "ml",
        instructor : "priya",
        courseName : "Practical NLP",
        courseDescription : "Working with text: embeddings, classification, and retrieval. Built around problems people are actually paid to solve.",
        whatYouWillLearn : "Represent text so a model can use it\nBuild a classifier that handles real user input\nImplement semantic search with embeddings\nEvaluate systems where the right answer is fuzzy",
        price : 3599,
        tag : ["NLP", "Embeddings", "Transformers"],
        instructions : ["Python", "Some machine learning background"],
        thumbnail : shot("1517134191118-9d595e4c8c2b"),
        status : "Draft",
        sections : [
            { name : "Text as Data", lectures : ["Tokenisation", "From counts to embeddings", "Pretrained models"] },
            { name : "Applications", lectures : ["Text classification", "Semantic search", "Extraction tasks"] }
        ]
    },

    //--- Design ------------------------------------------------------------
    {
        key : "ui-fundamentals",
        category : "design",
        instructor : "vikram",
        courseName : "UI Design Fundamentals",
        courseDescription : "Type, spacing, colour and hierarchy - the parts of interface design that make a screen readable before anything is decorated.",
        whatYouWillLearn : "Build a type scale and stay on it\nUse spacing systematically instead of by eye\nChoose colour that survives accessibility requirements\nCritique an interface with specific language",
        price : 1799,
        tag : ["UI", "Design", "Typography", "Color"],
        instructions : ["No design background needed", "Figma free account"],
        thumbnail : shot("1561070791-2526d30994b5"),
        sections : [
            { name : "Structure First", lectures : ["Hierarchy before decoration", "Grids and alignment", "Spacing systems"] },
            { name : "Type", lectures : ["Choosing typefaces", "Building a scale", "Setting readable text"] },
            { name : "Colour", lectures : ["Building a palette", "Contrast and accessibility", "Semantic colour"] },
            { name : "Critique", lectures : ["Reading an interface", "Giving useful feedback"] }
        ]
    },
    {
        key : "figma-workflow",
        category : "design",
        instructor : "vikram",
        courseName : "Figma for Product Teams",
        courseDescription : "Components, variants and design systems in Figma - set up so developers can build from your files without asking what a spacing value means.",
        whatYouWillLearn : "Build components and variants that scale\nUse auto layout the way it was intended\nDocument a system developers can implement\nHand off work without a meeting per screen",
        price : 1299,
        tag : ["Figma", "Design Systems", "Prototyping"],
        instructions : ["A Figma account", "Some interface design exposure"],
        thumbnail : shot("1613909207039-6b173b755cc1"),
        sections : [
            { name : "Working Faster", lectures : ["Auto layout properly", "Components and instances", "Variants and properties"] },
            { name : "Systems", lectures : ["Tokens and styles", "Documenting decisions", "Keeping a library healthy"] },
            { name : "Handoff", lectures : ["Specs developers can use", "Prototyping interactions"] }
        ]
    },
    {
        key : "ux-research",
        category : "design",
        instructor : "vikram",
        courseName : "UX Research Without a Lab",
        courseDescription : "Talk to users, watch them work, and turn what you learn into decisions - on a small team with no research budget.",
        whatYouWillLearn : "Run interviews that produce usable evidence\nTest a prototype with five people and learn something real\nSeparate what users say from what they do\nPresent findings so they change the roadmap",
        price : 0,
        tag : ["UX", "Research", "Interviews"],
        instructions : ["No research experience required"],
        thumbnail : shot("1552664730-d307ca884978"),
        status : "Draft",
        sections : [
            { name : "Asking", lectures : ["Interview questions that work", "Avoiding leading questions", "Recruiting on no budget"] },
            { name : "Watching", lectures : ["Usability testing basics", "Reading behaviour", "Synthesising notes"] }
        ]
    },

    //--- Web (remaining) ---------------------------------------------------
    {
        key : "web-performance",
        category : "web",
        instructor : "ananya",
        courseName : "Web Performance in Practice",
        courseDescription : "Make a site fast and keep it fast. Measurement first, then the specific fixes that move Core Web Vitals rather than folklore.",
        whatYouWillLearn : "Measure performance with numbers you trust\nDiagnose layout shift and slow paints\nOptimise images and fonts properly\nStop regressions with a performance budget",
        price : 2199,
        tag : ["Performance", "Core Web Vitals", "Optimisation"],
        instructions : ["Working knowledge of HTML, CSS and JavaScript"],
        thumbnail : shot("1460925895917-afdab827c52f"),
        sections : [
            { name : "Measuring", lectures : ["Lab versus field data", "Core Web Vitals explained", "Reading a flame chart"] },
            { name : "Loading", lectures : ["Critical path", "Images done right", "Font loading strategies", "Code splitting"] },
            { name : "Staying Fast", lectures : ["Performance budgets", "Catching regressions in CI"] }
        ]
    },
    {
        key : "testing-frontend",
        category : "web",
        instructor : "ananya",
        courseName : "Testing Frontend Applications",
        courseDescription : "Tests that catch real bugs instead of restating the implementation. Unit, integration and end-to-end, with a clear sense of what belongs where.",
        whatYouWillLearn : "Decide what is worth testing and what is not\nTest components the way users interact with them\nWrite end-to-end tests that are not flaky\nMock only at the boundaries you control",
        price : 2399,
        tag : ["Testing", "Vitest", "Playwright", "React"],
        instructions : ["React or similar framework experience"],
        thumbnail : shot("1516116216624-53e697fedbea"),
        sections : [
            { name : "What to Test", lectures : ["The testing trophy", "Tests that survive refactors", "Coverage as a signal, not a target"] },
            { name : "Components", lectures : ["Testing Library approach", "Queries and accessibility", "Async and user events"] },
            { name : "End to End", lectures : ["Playwright basics", "Removing flakiness", "Running in CI"] }
        ]
    }
];

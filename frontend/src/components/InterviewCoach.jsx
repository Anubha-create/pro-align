import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, ChevronDown, ChevronUp, Mic, Compass, 
  Award, XCircle, Lightbulb, Users, Send, RefreshCw, 
  CheckCircle, Play, Sparkles, MessageSquare, ShieldAlert
} from 'lucide-react';
import { interviewService } from '../services/api';

const InterviewCoach = ({ questions = [], jdText = "", resumeText = "" }) => {
  const [activeTab, setActiveTab] = useState('prep'); // 'prep', 'chat', 'mock'
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activePrepTabs, setActivePrepTabs] = useState({});

  // Chat Coach states
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: "Hello! I am your PRO-ALIGN AI Career Coach. Ask me anything about this Job Description, request help drafting answers, or practice questions." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Mock Interview states
  const [mockStarted, setMockStarted] = useState(false);
  const [currentMockQuestionIdx, setCurrentMockQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [recording, setRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Speech Recognition reference
  const recognitionRef = useRef(null);

  // 15 Interactive Questions Fallback with fully populated content
  const LOCAL_15_QUESTIONS = [
    {
      type: "Technical", difficulty: "Medium",
      question: "Can you describe your experience with scaling applications?",
      ideal_answer: "I scale applications by implementing database indexing, query optimization, horizontal pod autoscaling in Kubernetes, caching layers using Redis, and decomposing heavy workloads into asynchronous task queues.",
      key_points: ["Database query optimization", "Caching strategies", "Horizontal scaling", "Asynchronous worker queues"],
      follow_up_questions: ["How do you handle data synchronization across cached instances?", "What metrics do you monitor first when diagnosing scaling bottlenecks?"],
      star_answer: {
        situation: "We needed to scale our primary transactional database throughput under a 3x traffic surge during a seasonal marketing campaign.",
        task: "My task was to decrease API response times below 100ms and establish cache buffers to prevent database thread starvation.",
        action: "I refactored the query execution logic to use proper composite indexing, migrated static configuration lookups to a Redis cache-aside layer, and deployed Celery background task workers to handle long-running PDF downloads.",
        result: "Overall API response latency decreased by 45%, and the database CPU load remained stable below 40% throughout the entire campaign."
      },
      short_answer: "I design scalable applications by profiling query execution times, caching static read-heavy paths with Redis, and deploying stateless microservices that can scale horizontally based on active container CPU metrics.",
      detailed_answer: "Scaling applications requires identifying and resolving resource bottlenecks. First, analyze query execution plans using database profiling tools. Next, introduce in-memory caching layers like Redis to store static or expensive calculation results. Additionally, implement horizontal scaling for application instances and move CPU-intensive operations (such as media processing or report generation) into asynchronous worker queues like Celery or RabbitMQ to execute out-of-band.",
      common_mistakes: ["Focusing only on code syntax rather than database locking and architecture", "Failing to mention caching and queue-based decoupling"],
      confidence_tips: "Speak clearly about specific bottleneck metrics. Use terms like 'concurrency', 'latency', and 'stateless architecture' with conviction."
    },
    {
      type: "Behavioral", difficulty: "Medium",
      question: "Describe a time you led a team through a complex project under tight deadlines.",
      ideal_answer: "Under tight deadlines, I align the engineering and product teams on the minimal viable release scope. I map dependencies using an Agile board, schedule short daily syncs to unblock members immediately, and act as a shield to prevent scope creep.",
      key_points: ["Agile planning", "Task delegation", "Communication and unblocking team members", "Scope management"],
      follow_up_questions: ["How did you handle developers who were falling behind their deadlines?", "What would you do differently if faced with the same deadline tomorrow?"],
      star_answer: {
        situation: "Our main API gateway failed right before a critical product launch, and we had less than 24 hours to rebuild the authorization flow.",
        task: "I had to coordinate a team of 4 engineers to rebuild and test the OAuth integration under extreme time constraints.",
        action: "I set up a war room, split tasks based on individual strengths, automated testing scripts, and managed all external communications with leadership to protect the team from distractions.",
        result: "We redeployed the gateway with 4 hours to spare, achieving 99.9% uptime during launch and establishing clear test coverage."
      },
      short_answer: "I handle tight deadlines by defining the MVP deliverables, running 10-minute standups to resolve immediate blocks, and aligning the team around a clear Kanban board.",
      detailed_answer: "Faced with tight deadlines, I start by defining the MVP (Minimum Viable Product) and locking the scope. I map dependencies using an Agile board and hold daily syncs. I ensure there is constant communication between frontend and backend engineers, and I act as a buffer against scope creep from product management.",
      common_mistakes: ["Saying 'I did it all myself' instead of highlighting team collaboration", "Not quantifying the outcome with metrics"],
      confidence_tips: "Use the 'We' structure for effort but 'I' structure for leadership decisions. Maintain strong eye contact."
    },
    {
      type: "Role Specific", difficulty: "Hard",
      question: "How do you approach modernizing legacy systems using containerization?",
      ideal_answer: "Modernizing legacy monoliths requires containerizing components with lightweight base images, externalizing environment configurations, setting up automated CI/CD pipelines, and routing traffic incrementally using canary releases.",
      key_points: ["Containerization principles", "CI/CD integration", "Canary deployment strategies", "Multi-stage builds"],
      follow_up_questions: ["What security practices do you use in container configurations?", "How do you monitor container health in orchestration environments?"],
      star_answer: {
        situation: "The deployment process for our legacy monolith was slow, manual, and prone to environmental inconsistencies.",
        task: "My task was to containerize the application to improve environment consistency and automate deployments using CI/CD pipelines.",
        action: "I wrote multi-stage Dockerfiles to minimize image sizes, externalized configurations to environment variables, and configured GitHub Actions pipelines to run unit tests and build images automatically.",
        result: "Deployment times went from 45 minutes to under 5 minutes, and configuration errors in production fell to absolute zero."
      },
      short_answer: "I containerize services using Docker, automate pipeline builds with GitHub Actions, and execute canary rollouts to guarantee zero downtime.",
      detailed_answer: "Modernization begins with dependency isolation. I write multi-stage Dockerfiles to minimize container weight and ensure consistent environments. I declare environment variables for configurations, implement automated test gates in CI/CD, and route production traffic incrementally using reverse proxies to ensure seamless system cutovers.",
      common_mistakes: ["Using bloated container base images that slow down builds", "Hardcoding configuration secrets in the Dockerfile"],
      confidence_tips: "Explain the differences between dev and prod configurations. Speak with structured, step-by-step clarity."
    },
    {
      type: "HR", difficulty: "Easy",
      question: "Why do you want to join our organization and what makes you a good fit?",
      ideal_answer: "I want to join because your team builds high-performance, user-first match portals and values clean engineering. I can leverage my experience in Python backend development and API optimization to contribute to your core scaling goals immediately.",
      key_points: ["Aligning company values", "Stating technical overlap", "Focusing on collaboration", "Contributing to scaling goals"],
      follow_up_questions: ["Where do you see yourself in 5 years?", "What are your salary expectations?"],
      star_answer: {
        situation: "I was looking for a role that combined my passion for AI systems and backend scaling challenges.",
        task: "My goal was to find a team leading the matches space that valued architectural standards.",
        action: "I researched your match scoring portal and aligned my background in spaCy and Flask to your job description requirements.",
        result: "I prepared concrete ideas on how I can immediately add value to your team's backend performance."
      },
      short_answer: "I want to leverage my backend experience to build scale and join a company with a high-growth tech culture.",
      detailed_answer: "I want to join because your team is solving complex scalability challenges. My background in building clean APIs, implementing ML matchers, and optimizing database pipelines directly matches the requirements. I am excited to collaborate with a team that values clean architecture.",
      common_mistakes: ["Giving a generic answer without mentioning the company's specific product or mission", "Focusing too much on what the company can do for you rather than what you bring to the table"],
      confidence_tips: "Smile and show genuine enthusiasm. Speak about the company's achievements with interest."
    },
    {
      type: "Technical", difficulty: "Hard",
      question: "How do you handle database concurrency and prevent race conditions in high-traffic APIs?",
      ideal_answer: "Database concurrency is managed using transactions with appropriate isolation levels, database-level locking patterns (pessimistic SELECT FOR UPDATE or optimistic version columns), and distributed locks using Redis for cross-node synchronization.",
      key_points: ["Optimistic vs Pessimistic locking", "Transaction isolation levels", "Distributed locking", "Database constraints"],
      follow_up_questions: ["What is a deadlock and how do you resolve it?", "When would you choose optimistic locking over pessimistic?"],
      star_answer: {
        situation: "Our booking API suffered double-booking race conditions during high-volume flash sales.",
        task: "I had to guarantee absolute inventory consistency under concurrent requests.",
        action: "I implemented optimistic concurrency control using a version integer and configured database index constraints.",
        result: "Race conditions fell to absolute zero, protecting transaction integrity and user experience."
      },
      short_answer: "I resolve API race conditions using optimistic concurrency locking, unique database constraints, and Redis distributed locks.",
      detailed_answer: "In high-traffic systems, database level safety is key. For low-conflict updates, I use optimistic locking where transactions check a version counter before writing. For high-conflict paths, I apply pessimistic SELECT FOR UPDATE locks. If coordinating multiple services, I implement a Redlock algorithm using Redis to guarantee exclusive lock execution.",
      common_mistakes: ["Handling locking only in application memory", "Configuring overly strict isolation levels"],
      confidence_tips: "Explain the trade-offs of performance vs consistency. Use terms like ACID and isolation levels."
    },
    {
      type: "Behavioral", difficulty: "Medium",
      question: "Describe a time you had a technical disagreement with a team member and how you resolved it.",
      ideal_answer: "I handle technical disagreements objectively by discussing design tradeoffs, identifying key constraints (like performance, budget, or timelines), and building quick benchmark POCs to let empirical data decide the direction.",
      key_points: ["Active listening", "POC comparisons", "Data-driven decision making", "Objectivity"],
      follow_up_questions: ["What would you do if the conflict remained unresolved?", "How do you handle disagreement from senior stakeholders?"],
      star_answer: {
        situation: "A team member wanted NoSQL while I proposed SQL for our relational ledger data.",
        task: "We needed to align on the database architecture within 3 days.",
        action: "I set up benchmark queries showing SQL outperformed NoSQL joins by 5x.",
        result: "The team aligned on SQL, leading to robust data consistency."
      },
      short_answer: "I approach conflicts by evaluating design pros/cons and setting up quick benchmark tests to compare solutions objectively.",
      detailed_answer: "I treat technical arguments as opportunities to collaborate. I map the architectural trade-offs of both options on a shared document. If the path forward is unclear, I write a simple prototype to run benchmark tests (evaluating response latency, memory footprints, and readability). This removes personal bias and aligns the team around concrete data.",
      common_mistakes: ["Becoming defensive", "Escalating conflicts to management immediately"],
      confidence_tips: "Express respect for different design patterns. Highlight collaboration."
    },
    {
      type: "Role Specific", difficulty: "Medium",
      question: "How do you secure API endpoints against common OWASP vulnerabilities?",
      ideal_answer: "I secure endpoints using input validation decorators, prepared statements to prevent injection, OAuth2 or JWT token validation, rate-limiting middleware, CORS policies, and secure HTTPS transport.",
      key_points: ["SQL injection prevention", "Rate limiting and throttling", "JWT verification", "CORS headers"],
      follow_up_questions: ["What is CORS and why is it important?", "How do you protect endpoints from brute force attacks?"],
      star_answer: {
        situation: "Our legacy endpoints suffered payload injections and lack of rate limits.",
        task: "My task was to audit and secure our entire backend API catalog.",
        action: "I implemented validator decorators, parameterized all raw queries, and configured rate-limiting middleware.",
        result: "Vulnerabilities dropped to zero on security scans, blocking malicious requests."
      },
      short_answer: "I protect endpoints using input validation, signed token validation, rate limiting, and secure CORS headers.",
      detailed_answer: "Security requires a defense-in-depth approach. I validate all incoming payloads to block SQL injection and XSS. I implement rate-limiting middleware at the gateway to prevent denial-of-service attacks. Endpoints are authenticated with cryptographically signed JWT tokens, and CORS is configured to only allow authorized client domains.",
      common_mistakes: ["Storing secret tokens in frontend client code", "Failing to check request payload sizes"],
      confidence_tips: "Enumerate specific measures. Speak about security as a continuous lifecycle process."
    },
    {
      type: "HR", difficulty: "Medium",
      question: "Where do you see yourself professionally in the next five years?",
      ideal_answer: "In five years, I aim to become a Principal Engineer leading major architectural designs, mentoring junior engineers, and establishing standard software practices across engineering organizations.",
      key_points: ["Deepening technical skills", "Leadership growth", "Long-term commitment", "Mentoring"],
      follow_up_questions: ["What specific technologies do you want to learn next?", "How do you plan to develop your leadership?"],
      star_answer: {
        situation: "I wanted to define a clear roadmap for my growth as a staff engineer.",
        task: "My task was to balance technical contributions with leadership experience.",
        action: "I set milestones for system architecture design and peer mentoring.",
        result: "I am looking for a company where I can execute this roadmap and deliver quality code."
      },
      short_answer: "I see myself taking on leadership roles in backend architecture and mentoring junior developers.",
      detailed_answer: "My five-year goal is to grow from a senior contributor to a principal systems architect. I want to design resilient infrastructure that handles millions of active users and establish coding standards across teams. I also look forward to mentoring other developers and acting as a bridge between technical designs and business strategy.",
      common_mistakes: ["Giving a generic response that lacks ambition", "Expressing plans that don't align with the role"],
      confidence_tips: "Demonstrate passion for engineering. Frame your growth as a benefit to the engineering team."
    },
    {
      type: "Technical", difficulty: "Medium",
      question: "What is the difference between REST, GraphQL, and gRPC architectures?",
      ideal_answer: "REST is best for simple, standard public endpoints. GraphQL is ideal when client frontends need to query customized nested fields to avoid round-trips. gRPC is optimal for high-performance internal microservices due to its low serialization overhead over HTTP/2.",
      key_points: ["REST CRUD simplicity", "GraphQL request flexibility", "gRPC Protocol Buffers performance"],
      follow_up_questions: ["What is HTTP/2 and how does gRPC leverage it?", "What is under-fetching and over-fetching?"],
      star_answer: {
        situation: "Our internal microservice REST endpoints suffered high serialization latency.",
        task: "We needed to refactor communications to support higher concurrency.",
        action: "I migrated internal communications to gRPC with binary serialization.",
        result: "Latency fell by 60% and CPU utilization on microservices dropped by 15%."
      },
      short_answer: "I use REST for public routes, GraphQL for client-heavy interfaces, and gRPC for high-performance microservices.",
      detailed_answer: "REST remains standard for typical client interfaces due to HTTP caching. GraphQL is powerful for frontend dashboards where page designs change frequently, preventing data over-fetching. gRPC uses Protocol Buffers and binary serialization over HTTP/2 multiplexed streams, reducing latency dramatically for server-to-server microservices.",
      common_mistakes: ["Using GraphQL for simple APIs where it adds unnecessary complexity", "Exposing raw gRPC endpoints directly to standard web clients"],
      confidence_tips: "Contrast serialization methods. Explain specific use cases clearly."
    },
    {
      type: "Behavioral", difficulty: "Hard",
      question: "Tell me about a major production outage you were involved in and how you handled it.",
      ideal_answer: "During outages, my focus is immediate resolution and open communication. I analyze metrics logs, rollback the last deploy if it caused the failure, isolate the failure node, and write a thorough post-mortem to prevent future occurrences.",
      key_points: ["Calm coordination", "Root cause analysis", "Post-mortem prevention", "Incident management"],
      follow_up_questions: ["How did you prevent the outage from recurring?", "How did you communicate with stakeholders?"],
      star_answer: {
        situation: "Our payment gateway crashed during Black Friday due to database deadlocks.",
        task: "I had to restore service while protecting transaction ledger records.",
        action: "I scaled the replica pool, routed traffic to static retry queues, and patched the database lock.",
        result: "Outage was resolved in 14 minutes, saving thousands in potential transaction losses."
      },
      short_answer: "I handle incidents by analyzing metrics, rolling back faulty deployments, restoring nodes, and creating preventive post-mortems.",
      detailed_answer: "During an outage, I immediately join the incident bridge. I check error rates in Datadog or ELK. If the issue started right after a release, I execute a safe rollback. Once resolved, I lead a post-mortem to set up alerts and unit test coverage to prevent it from ever happening again.",
      common_mistakes: ["Blaming other team members for the crash", "Failing to explain the preventive actions taken"],
      confidence_tips: "Focus on the recovery process. Show resilience, leadership, and a focus on operational stability."
    },
    {
      type: "Role Specific", difficulty: "Medium",
      question: "How do you design a CI/CD pipeline to automate testing and zero-downtime deployment?",
      ideal_answer: "A robust pipeline runs unit tests on every commit, checks lint rules, builds multi-stage Docker images, runs integration tests in staging, and automates zero-downtime rolling deploys to production.",
      key_points: ["Automated test suites", "Zero downtime deployments", "Infrastructure as Code", "Docker containers"],
      follow_up_questions: ["What is a rollback trigger in a pipeline?", "How do you handle migrations during zero-downtime deploys?"],
      star_answer: {
        situation: "Our legacy deployments were manual and caused 5 minutes of downtime each release.",
        task: "My task was to automate deployments and guarantee zero downtime.",
        action: "I configured GitHub Actions and set up rolling updates on our container cluster.",
        result: "Deployments became fully automated, executing in under 3 minutes with zero downtime."
      },
      short_answer: "I automate pipelines with automated test suites, lint checkers, and rolling container updates to guarantee zero downtime.",
      detailed_answer: "I design CI/CD pipelines to validate changes continuously. The pipeline executes test suites on branch push. If they pass, it builds a container image and deploys it to a staging environment. The production release is triggered automatically using rolling updates, keeping active pods running while new pods start up.",
      common_mistakes: ["Failing to automate rollbacks", "Exposing API keys in pipeline code repositories"],
      confidence_tips: "Outline pipeline phases: Build, Test, Release, Monitor. Speak with operational confidence."
    },
    {
      type: "HR", difficulty: "Medium",
      question: "What are your salary expectations for this position?",
      ideal_answer: "I expect a competitive package that aligns with my experience building scalable backend microservices and matching systems. I am open to discussing the full benefits, equity, and performance bonuses.",
      key_points: ["Focusing on total compensation", "Setting reasonable market ranges", "Keeping negotiation open", "Market standards"],
      follow_up_questions: ["What is your current compensation?", "Are you open to equity options?"],
      star_answer: {
        situation: "I needed to address compensation expectations without locking myself in too early.",
        task: "My task was to share a professional range based on market research.",
        action: "I researched average compensation for senior Python engineers in similar hubs.",
        result: "I am confident we can reach a mutually beneficial agreement once we align on the role."
      },
      short_answer: "I am looking for a market-rate package that reflects my technical experience, and I'm open to discussing the complete benefits plan.",
      detailed_answer: "Based on my research and experience building scalable backend microservices, I am looking for a package in the range of $110,000 to $130,000. However, I view compensation as a whole and am happy to discuss equity, performance bonuses, and other benefits to reach a fair agreement.",
      common_mistakes: ["Giving a single hard number too early", "Appearing rigid or refusing to discuss benefits"],
      confidence_tips: "Deliver your range calmly. Position the discussion around the mutual value you bring."
    },
    {
      type: "Technical", difficulty: "Medium",
      question: "How do you use Redis or caching layers to improve API performance and reduce database load?",
      ideal_answer: "I use Redis to store database read query results under a cache-aside pattern. I configure appropriate TTL expirations, write-through invalidation rules, and handle connection failures gracefully with fallbacks.",
      key_points: ["Cache aside strategy", "Cache invalidation", "Handling Cache stampede", "TTL policies"],
      follow_up_questions: ["What is TTL and how do you choose it?", "How do you prevent cache stampede?"],
      star_answer: {
        situation: "Our reporting API database was overloaded with identical read queries.",
        task: "I had to reduce database query load by caching common static calculations.",
        action: "I implemented Redis cache-aside with a 5-minute TTL invalidation strategy.",
        result: "Database load dropped by 80% and API response times fell from 800ms to 45ms."
      },
      short_answer: "I cache heavy read queries in Redis using a cache-aside pattern and apply TTLs to ensure data freshness.",
      detailed_answer: "To optimize read latency, I implement a cache-aside pattern. When a query arrives, the app checks Redis. If it's a hit, it returns the data instantly. If it's a miss, it queries the database, updates the cache, and returns the data. I set Time-To-Live (TTL) policies and ensure database write operations invalidate the cache immediately.",
      common_mistakes: ["Caching highly dynamic data without an invalidation policy", "Not handling cache connection failures gracefully"],
      confidence_tips: "Discuss cache stampede and TTL invalidation. Speak about scaling read operations."
    },
    {
      type: "Behavioral", difficulty: "Medium",
      question: "How do you explain complex technical concepts to non-technical stakeholders?",
      ideal_answer: "I explain tech concepts to non-technical partners by avoiding jargon, using real-world analogies, and focusing on the business metrics—like load times, system stability, cost savings, or customer conversion rates.",
      key_points: ["Using analogies", "Focusing on business outcomes", "Avoiding jargon", "Active communication"],
      follow_up_questions: ["How do you handle stakeholders who demand technical details?", "Can you give an example of an analogy you've used?"],
      star_answer: {
        situation: "I needed to explain why migrating to microservices was worth a 2-month engineering investment.",
        task: "I had to get sign-off from the product manager who cared about user features.",
        action: "I compared monolithic code to a single highway where a crash stops all traffic, and microservices to bypass roads.",
        result: "The PM approved the migration, which later prevented two major launch day outages."
      },
      short_answer: "I communicate with non-technical teams by using real-world analogies and focusing on user impact and business outcomes.",
      detailed_answer: "I bridge the gap between engineering and business by translating code concepts into visual analogies. If I am explaining api latencies, I compare them to checkout lines at a grocery store. I focus the conversation on how architectural changes improve user engagement, decrease server costs, or prevent launch downtime.",
      common_mistakes: ["Using acronyms or details that confuse the audience", "Over-simplifying to the point of being patronizing"],
      confidence_tips: "Speak clearly and check for understanding. Focus on the value the change brings."
    },
    {
      type: "Role Specific", difficulty: "Hard",
      question: "How do you manage database migrations in a production environment with millions of active rows?",
      ideal_answer: "I execute large database migrations by writing backward-compatible scripts. I add new columns as nullable, deploy the updated code that writes to both columns, backfill old data in batches, and apply constraints in a final transaction.",
      key_points: ["Online migrations", "Avoiding table locks", "Backward compatibility", "Batch updates"],
      follow_up_questions: ["What is a lock timeout and why set it?", "How do you rollback a failed migration on large tables?"],
      star_answer: {
        situation: "We needed to add a foreign key constraint to a table with 25 million rows.",
        task: "I had to deploy the database change with zero table lock time and zero downtime.",
        action: "I added the column as nullable, populated data in batches, and added the constraint afterward.",
        result: "The migration completed successfully in production with zero impact on active api queries."
      },
      short_answer: "I run migrations by adding nullable columns first, backfilling data in chunks, and applying constraints later.",
      detailed_answer: "To migrate tables with millions of rows without locking the database, I deploy changes in phases. First, add the column as nullable. Second, update the app code to read from the old schema and write to both. Third, run a background script to backfill data in batches of 1000. Finally, deploy a constraint migration and remove the old database columns.",
      common_mistakes: ["Executing ALTER TABLE constraints directly on large active production tables", "Failing to test rollback pathways"],
      confidence_tips: "Detail the nullable-then-constraint strategy. Mention batching."
    }
  ];

  // Use custom analysis questions if available, otherwise fall back to static list
  const mockQuestionsList = (questions && questions.length > 0) ? questions : LOCAL_15_QUESTIONS;

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setUserAnswer(prev => prev + " " + transcript);
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition error:", e);
        setRecording(false);
      };

      rec.onend = () => {
        setRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const handleStartRecording = () => {
    if (recognitionRef.current) {
      if (recording) {
        recognitionRef.current.stop();
      } else {
        setRecording(true);
        recognitionRef.current.start();
      }
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = chatMessages.map(m => ({ sender: m.sender, text: m.text }));
      const data = await interviewService.askCoach(
        chatInput,
        resumeText,
        jdText,
        history
      );
      setChatMessages(prev => [...prev, { sender: 'coach', text: data.response }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'coach', text: "Sorry, I had trouble processing that query. Please make sure the backend is active." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSubmitMockAnswer = async () => {
    if (!userAnswer.trim() || evaluating) return;
    
    setEvaluating(true);
    setEvaluationResult(null);
    const qText = mockQuestionsList[currentMockQuestionIdx].question;
    
    try {
      const data = await interviewService.evaluateAnswer(qText, userAnswer, jdText);
      setEvaluationResult(data);
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const getQuestionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'technical': return <Mic className="w-4 h-4 text-blue-500" />;
      case 'behavioral': return <Users className="w-4 h-4 text-teal-500" />;
      case 'role specific': return <Compass className="w-4 h-4 text-purple-500" />;
      default: return <Award className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm h-[680px] flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 justify-between items-center">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-teal-500 animate-pulse" /> Interview Hub
          </span>
          <div className="flex gap-2">
            {['prep', 'chat', 'mock'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setEvaluationResult(null);
                  setUserAnswer('');
                }}
                className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300 bg-slate-100 dark:bg-slate-900/60'
                }`}
              >
                {tab === 'prep' ? 'Prep Q&A' : (tab === 'chat' ? 'Ask Coach' : 'Mock Mode')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: PREP Q&A LIST */}
      {activeTab === 'prep' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {mockQuestionsList.map((q, idx) => {
            const isExpanded = expandedIndex === idx;
            const currentTab = activePrepTabs[idx] || 'star';
            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border transition ${
                  isExpanded 
                    ? 'bg-slate-50 dark:bg-slate-900 border-blue-500/20 shadow-sm' 
                    : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/60 hover:border-slate-700'
                }`}
              >
                <button 
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full flex items-start justify-between text-left gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      {getQuestionIcon(q.type)}
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Q{idx + 1} ({q.type}) • {q.difficulty}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">"{q.question}"</h4>
                  </div>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-950 p-1 rounded-lg">
                        {['star', 'detailed', 'short', 'tips'].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActivePrepTabs(prev => ({ ...prev, [idx]: tab }))}
                            className={`flex-1 py-1 text-[8px] font-black uppercase rounded transition ${
                              currentTab === tab ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {currentTab === 'star' && q.star_answer && (
                          <div className="p-2.5 bg-blue-500/5 rounded-xl border border-blue-500/10 space-y-1">
                            <p className="font-extrabold text-[9px] uppercase tracking-wide text-blue-500">STAR Format</p>
                            <p className="text-[11px]"><strong>S:</strong> {q.star_answer.situation}</p>
                            <p className="text-[11px]"><strong>T:</strong> {q.star_answer.task}</p>
                            <p className="text-[11px]"><strong>A:</strong> {q.star_answer.action}</p>
                            <p className="text-[11px]"><strong>R:</strong> {q.star_answer.result}</p>
                          </div>
                        )}
                        {currentTab === 'detailed' && <p className="italic bg-slate-950/20 p-2.5 rounded-xl border border-slate-800/10">"{q.detailed_answer || q.ideal_answer}"</p>}
                        {currentTab === 'short' && <p className="italic bg-slate-950/20 p-2.5 rounded-xl border border-slate-800/10">"{q.short_answer || q.ideal_answer}"</p>}
                        {currentTab === 'tips' && <p className="italic text-teal-600 dark:text-teal-400">"{q.confidence_tips}"</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {mockQuestionsList.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-20">No prep questions found. Run your analysis first.</p>
          )}
        </div>
      )}

      {/* VIEW 2: AI CHAT COACH */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4 h-[440px]">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-800/80'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-900 text-slate-400 p-3 rounded-2xl text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-500" />
                  <span>Coach is formulating answer...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input field */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about this JD (e.g. explain Question 1)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-slate-850 dark:text-slate-200 transition"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition disabled:bg-blue-800"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* VIEW 3: INTERACTIVE MOCK INTERVIEW */}
      {activeTab === 'mock' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden h-full">
          {!mockStarted ? (
            <div className="text-center py-20 space-y-6">
              <Sparkles className="w-12 h-12 text-teal-400 mx-auto animate-pulse" />
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Interactive Mock Interview Engine</h4>
                <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  Practice oral or written answers. Receive detailed feedback on technical correctness and STAR formatting.
                </p>
              </div>
              <button
                onClick={() => setMockStarted(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition shadow"
              >
                Start Mock Interview
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between h-full">
              {/* Question card */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Interviewer Card ({mockQuestionsList[currentMockQuestionIdx].type})</span>
                  <span>Question {currentMockQuestionIdx + 1} of {mockQuestionsList.length}</span>
                </div>
                
                <div className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold leading-relaxed text-slate-850 dark:text-slate-200 italic shadow-inner">
                  "{mockQuestionsList[currentMockQuestionIdx].question}"
                </div>

                {/* Input with record controls */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Your Answer Response</span>
                    {speechSupported && (
                      <button 
                        onClick={handleStartRecording}
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1.5 transition ${
                          recording 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse font-black' 
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <Mic className="w-3 h-3" />
                        {recording ? 'Recording... click to stop' : 'Record Voice'}
                      </button>
                    )}
                  </div>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type or record your verbal answer here..."
                    rows={4}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-600 transition resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Evaluation Card View */}
              <div className="flex-1 overflow-y-auto max-h-[180px] my-3 pr-1">
                {evaluating ? (
                  <div className="text-center py-6 text-slate-400 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-500" />
                    <span>Gemini is evaluating grammar, structure and accuracy...</span>
                  </div>
                ) : evaluationResult ? (
                  <div className="space-y-3 p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                    <div className="flex justify-between items-center border-b border-teal-500/10 pb-2">
                      <span className="text-[10px] font-black uppercase text-teal-500 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Performance Report
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded">
                        Score: {evaluationResult.overall_score}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div><strong>Confidence:</strong> {evaluationResult.confidence?.rating}/5 - <span className="text-slate-400">{evaluationResult.confidence?.feedback}</span></div>
                      <div><strong>Grammar:</strong> {evaluationResult.grammar?.rating}/5 - <span className="text-slate-400">{evaluationResult.grammar?.feedback}</span></div>
                      <div><strong>Technical:</strong> {evaluationResult.technical_accuracy?.rating}/5 - <span className="text-slate-400">{evaluationResult.technical_accuracy?.feedback}</span></div>
                      <div><strong>STAR Setup:</strong> {evaluationResult.star_structure?.rating}/5 - <span className="text-slate-400">{evaluationResult.star_structure?.feedback}</span></div>
                    </div>

                    {evaluationResult.suggestions && (
                      <div className="pt-1.5 border-t border-teal-500/10 text-[9px] text-slate-400 space-y-0.5">
                        {evaluationResult.suggestions.map((s, i) => <p key={i}>{s}</p>)}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                {!evaluationResult ? (
                  <button
                    onClick={handleSubmitMockAnswer}
                    disabled={!userAnswer.trim() || evaluating}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition active:scale-[0.98] disabled:opacity-40"
                  >
                    Submit Answer for Review
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEvaluationResult(null);
                      setUserAnswer('');
                      if (currentMockQuestionIdx + 1 < mockQuestionsList.length) {
                        setCurrentMockQuestionIdx(prev => prev + 1);
                      } else {
                        // Reset mock
                        setCurrentMockQuestionIdx(0);
                        setMockStarted(false);
                      }
                    }}
                    className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition"
                  >
                    {currentMockQuestionIdx + 1 < mockQuestionsList.length ? "Next Question" : "Complete Session"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewCoach;

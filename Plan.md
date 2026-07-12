Role: You are an expert hackathon strategist, technical project manager, and senior software engineer.
My Profile: I am a Computer Science B.Tech student. My technical foundation is in mobile frontend development using Kotlin and hardware prototyping, so I understand application logic, but I am avoiding complex web backend deployments for this 8-hour sprint. I also have a strong background in graphic design—specifically creating high-impact, cinematic posters and parodying official government campaign aesthetics. I want to leverage this eye for design to make the UI look premium, authoritative, and visually striking. I will be presenting the final project locally on my laptop.
The Objective: I have exactly 8 hours to build a working MVP for "TransitOps", a Smart Transport Operations Platform.
Core Requirements (from the brief):

* Users Roles: Fleet Manager, Driver, Safety Officer, Financial Analyst.
* Features Required: Authentication (Mocked RBAC), Dashboard with KPIs, Vehicle Registry, Driver Management, Trip Management, Maintenance logs, Fuel & Expense Management.
* Mandatory Business Rules:
   1. Strict state management: A vehicle in maintenance must be marked "In Shop" and hidden from dispatch.
   2. Dispatching a trip must automatically change the vehicle and driver status to "On Trip".
   3. Completing or cancelling a trip reverts them to "Available".
   4. Cargo weight cannot exceed vehicle capacity.
* Analytics Formula: Vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
* Form Factor: Responsive web interface.
Your Task: Provide a ruthlessly prioritized, highly detailed 8-hour battle plan. I need you to break down the strategy as follows:
1. The Zero-Setup Tech Stack:
Recommend the absolute easiest architecture for me to use in VS Code (e.g., React + Tailwind via CDN, using `localStorage` for state management). Explain how we will mock the database and auth so I don't waste time on cloud deployments.
2. The 8-Hour Execution Timeline:
Break the 8 hours down into strict, time-boxed blocks. Tell me exactly what to build in hours 1-2, hours 3-5, and so on. Include buffer time for testing the mandatory business rules.
3. The "Smoke and Mirrors" Strategy:
Tell me exactly which features I must build perfectly (e.g., the state transitions), which features I should fake or hardcode (e.g., historical fuel logs), and what I can completely ignore to save time without losing points.
4. The Visual Edge:
Give me a specific UI/UX design direction that utilizes my graphic design skills. How can I use typography, color palettes, and layout to make this dashboard look like a high-end, cinematic, or official government transport system?
5. The Final Pitch:
Outline a 3-minute presentation script structure that highlights the mandatory business rules and the visual polish of the MVP.
Ask me any clarifying questions you need before we start executing this plan.
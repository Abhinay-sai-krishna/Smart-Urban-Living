
<div align="center">
  <h1> Smart Urban Living</h1>
</div>

---

<p align="center">
  <strong>    </strong><br/>
  <em>Building the sustainable city of today, tomorrow.</em>
</p>

---

## 📖 Project Description
✨ **Problem Statement:** Cities struggle to manage complex urban systems like traffic, waste, and energy due to disconnected data silos and reactive, inefficient decision-making. This leads to congestion, wasted resources, and a lower quality of life for citizens.

💡 **Proposed Solution:** An AI-powered, centralized dashboard that transforms real-time city data into actionable insights. Our platform unifies key metrics—from traffic flow to air quality—and uses the Gemini API to provide predictive alerts and optimized solutions, enabling proactive and sustainable urban management.

🎯 **Target Users / Use Cases:**

**City Officials & Urban Planners:**

**Use Case:** Instantly analyze city-wide trends, receive AI-optimized waste collection routes, and implement intelligent traffic rerouting to reduce congestion.

**Citizens:**

**Use Case:** Stay informed about real-time air quality and traffic conditions, and receive AI-generated tips on how to save energy and live more sustainably.

---

## 🔬 Methodology
1. **Research & Ideation** –

    **Problem Discovery:** We identified that city management is often fragmented and reactive. Officials lack a unified view of urban systems, leading to inefficiencies in handling traffic, waste, and energy, which negatively impacts citizens' quality of life.

    **Market Analysis:** We analyzed existing smart city solutions, finding many were either single-purpose, had outdated user interfaces, or lacked the advanced analytical power of modern AI. This revealed a clear opportunity for an integrated, AI-driven platform.

    **Brainstorming & Solution Concept:** Our core idea was to create a single pane of glass dashboard. We brainstormed key modules (Transport, Energy, Waste, Pollution) and determined that leveraging a powerful generative AI model like the Gemini API could transform raw data into predictive, actionable insights, moving from reactive to proactive governance.

2. **Design** –

    **User Experience (UX):** We designed two primary user flows: an in-depth, control-oriented view for City Officials (Admin) and a simplified, informational view for Citizens. Wireframes were developed to map out navigation, data hierarchy, and interaction patterns for each module.

    **User Interface (UI):** A modern, dark-themed UI was chosen to reduce eye strain in control room environments and enhance data visualization. We used a clean, card-based layout with high-contrast elements, ensuring that critical information is immediately accessible on both desktop and mobile devices.

    **System Architecture:** We architected a scalable, client-side React application. The system is designed to be modular, allowing for future expansion. It integrates multiple external services:

    **Google Gemini API:** For all AI-powered suggestions and alerts.

    **Google Maps & Routes API:** For geospatial visualization and route planning.


    **Third-Party Data APIs:** For real-time weather and air quality.

3. **Develop** –

    **Frontend Implementation:** The application was built using React and TypeScript for a robust, type-safe, and maintainable codebase. Tailwind CSS was used for rapid, utility-first styling to create a responsive and consistent UI.

    **Core Feature Implementation:** We developed the five key modules (Dashboard, Transport, etc.), each with its own dedicated components, data visualizations using Recharts, and interactive elements.

    **AI & API Integration:** We successfully integrated the @google/genai SDK to handle all communication with the Gemini API, implementing features like AI-optimized waste routes and predictive pollution alerts. We also integrated the Google Maps and external data APIs to feed the dashboard with real-time information.

    **Data Simulation:** To ensure a dynamic user experience for the demo, we created a dataService that simulates continuous, realistic data streams for traffic, energy, and waste, mimicking a live IoT network.

4. **Test** –

    **Component & Integration Testing:** Each component was tested in isolation, and end-to-end tests were performed on key user flows. This included verifying that data filtering in the Waste module worked correctly and that the generated output from the Gemini API was displayed properly.
 
    **User Acceptance Testing (UAT):** We conducted feedback sessions based on the two user roles. We confirmed that officials could easily access AI generation features and that citizens received clear, concise information.
  
    **API Health & Usability:** A unique API Key Health Check component was built. This diagnostic tool proactively tests the Google Cloud API configuration, guiding developers to fix common setup errors like disabled APIs or billing issues, which significantly improves the developer setup experience.
  
5. **Deploy** –

   **Hosting Strategy:** As a static, client-side application, the dashboard is optimized for simple and cost-effective hosting on platforms like Vercel, Netlify, or Google Cloud Storage. The project uses import maps, eliminating the need for a complex build step.

   **Environment Configuration:** The application is designed to securely use API keys via environment variables. This ensures that sensitive credentials are not hard-coded and can be managed securely in the deployment environment.

   **Live Demo:** A publicly accessible demo is deployed, allowing stakeholders to interact with the dashboard's features in real-time. We are continuously monitoring performance metrics like load time and API responsiveness..
   
6. **Future Scope** –
  
    **Citizen Engagement Portal:** Develop a mobile-first interface allowing citizens to report issues (e.g., potholes, broken streetlights) by submitting photos, which the Gemini API can analyze and categorize automatically.
  
    **Advanced Predictive Analytics:** Leverage the Gemini API for long-term forecasting, such as predicting energy consumption during a heatwave or modeling the traffic impact of a major city event.
  
    **IoT & Real Data Integration:** Transition from simulated data to live feeds from real-world IoT sensors and municipal databases for a true, production-grade smart city implementation.
  
    **Automated Actions & Workflows:** Enable officials to not only view AI suggestions but also to trigger actions directly from the dashboard—for example, automatically dispatching a waste collection team or updating digital traffic signs.

## 🛠️ Technology Stack
`React & TypeScript` | `Google Gemini API` | `Google Maps Platform` | ` Tailwind CSS` | `Recharts`

---

## 📹 Demonstration Video
▶️ https://drive.google.com/file/d/13wsEEXkcgzsWGzQsbH_idwhtjAif9l7O/view?usp=sharing

---

## 🌐 Deployment
🔗 https://drive.google.com/file/d/13wsEEXkcgzsWGzQsbH_idwhtjAif9l7O/view?usp=sharing

---

## 🖼️ Screenshots

<img width="1919" height="957" alt="1" src="https://github.com/user-attachments/assets/a83b176b-4b7c-4c18-be9b-d425779b8d57" />
<img width="1893" height="969" alt="2" src="https://github.com/user-attachments/assets/9d6f902c-fafc-4618-b289-354ae453f4dd" />
<img width="1868" height="891" alt="3" src="https://github.com/user-attachments/assets/f7cd3767-41c2-4fb0-a2e7-99e238d0a0fa" />
<img width="1893" height="945" alt="4" src="https://github.com/user-attachments/assets/9c1d17a0-d1fd-424d-b97b-9d852f176e54" />
<img width="1903" height="968" alt="5" src="https://github.com/user-attachments/assets/6dfc03db-234d-4174-b581-10318af94fb7" />
<img width="1890" height="931" alt="6" src="https://github.com/user-attachments/assets/35545c99-ef8e-4fce-90a9-af251635c0f8" />





---

<p align="center">
  <b>Hackathon:</b> AIGNITE 2K25 | Organized by MLSC<br/>
</p>

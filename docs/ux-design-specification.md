---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
inputDocuments: ["docs/sprint-artifacts/prd.md", "docs/sprint-artifacts/product-brief.md"]
workflowType: 'ux-design'
lastStep: 0
project_name: 'budget'
user_name: 'Danielaroko'
date: '2025-12-06'
---

# UX Design Specification budget

**Author:** Danielaroko
**Date:** 2025-12-06

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->
## Executive Summary

### Project Vision
To empower users with full control over their personal finances through an automated, flexible, and easily searchable transaction management system, leveraging SimpleFin Bridge for data synchronization.

### Target Users
Individuals, primarily Danielaroko, seeking robust personal finance management. Users are comfortable with technology (self-hosting, SimpleFin configuration) and require flexible organization beyond standard categorization to track specific expenses.

### Key Design Challenges
- **Tag Visibility:** Displaying multiple tags clearly on transaction lists without overwhelming the UI.
- **Input Mechanism:** Designing an intuitive and efficient way for users to add, create, and manage tags directly within transaction interfaces (e.g., autocomplete, multi-select).
- **Consistency:** Ensuring a cohesive user experience for tag management that aligns with existing categorization patterns.
- **Scalability:** Maintaining performant UI/UX as the number of tags and transactions grows.

### Design Opportunities
- **Enhanced Filtering:** Utilizing tags to provide powerful, granular transaction filtering and analytical capabilities.
- **Visual Cues:** Implementing color-coding or other visual distinctions for tags to improve scannability and quick identification.
- **Inline Management:** Offering seamless inline editing and creation of tags within transaction displays for improved workflow.

## Core User Experience

### Defining Experience
- **Core User Action:** Quickly and accurately assigning, editing, and creating tags for transactions.
- **Critical Interaction:** The "TagInput" component, enabling seamless selection of existing tags and creation of new ones.
- **Effortless Goal:** Users should effortlessly find, select, and create tags, making the process feel integrated and natural within the transaction management flow.

### Platform Strategy
- **Primary Platform:** Web application (React frontend) accessible via desktop and mobile browsers.
- **Interaction:** Designed for both mouse/keyboard input on desktop and touch-friendly gestures on mobile.
- **Integration:** Must integrate seamlessly with the existing transaction list and filter bar UI.

### Effortless Interactions
- **Tag Input:** Autocomplete/suggestion for existing tags as the user types, with a clear option to create a new tag if not found.
- **Filtering:** Instantaneous filtering of transactions when a tag is selected from a filter dropdown or clicked on a transaction badge.
- **Visual Feedback:** Clear visual cues (e.g., colored badges) for assigned tags on transaction rows.

### Critical Success Moments
- **"Aha!" Moment:** A user effortlessly applies multiple tags to a transaction and then uses one of those tags to quickly filter a large list, immediately finding the desired expenses.
- **First-Time Success:** A new user easily creates their first custom tag and applies it to a transaction without confusion.
- **Flow Resilience:** The tagging and filtering process remains smooth and responsive even with a growing number of tags and transactions.

### Experience Principles
- **Efficiency:** Tagging and filtering must be fast, intuitive, and minimize user effort.
- **Clarity:** Tags should be easily discernible and their application clear within the transaction interface.
- **Contextual Relevance:** Tag suggestions and filtering options should intelligently adapt to user input and transaction data.

## Desired Emotional Response

### Primary Emotional Goals
- **Empowerment:** Users feel they have the tools to master their financial data.
- **Clarity:** Users feel a sense of relief and understanding when viewing their organized transactions.
- **Control:** Users feel they own the organization structure, not the app.

### Emotional Journey Mapping
- **Discovery:** "Finally, a way to track my specific trips!" (Curiosity/Hope)
- **Action (Tagging):** "Click, type, enter. Done. That was easy." (Flow/Satisfaction)
- **Result (Filtering):** "Show me 'Vacation'. Ah, there it is. 000 total." (Relief/Accomplishment)

### Micro-Emotions
- **Confidence:** Knowing a transaction is correctly labeled.
- **Trust:** Believing the system will retrieve exactly what is asked for.
- **Delight:** Seeing a color-coded tag instantly identify a transaction type.

### Design Implications
- **Control:** Allow users to create tags on the fly (don't force them to settings page first).
- **Clarity:** Use distinct colors and clear typography for tags.
- **Confidence:** Immediate visual feedback when a tag is applied.

### Emotional Design Principles
- **Respect User Intent:** Never auto-tag incorrectly; let the user define the meaning.
- **Reward Organization:** Make the organized view visually pleasing.
- **Minimize Friction:** Tagging should never feel like a chore.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
- **Trello/Jira (Task Management):** Renowned for their intuitive and flexible tagging/labeling systems. Users can quickly add, create, and manage tags, often with color-coding for visual distinction. Filtering by tags is a core function.
- **GitHub (Code Hosting):** Utilizes labels for issues and pull requests, offering clear visual identification and powerful filtering capabilities.
- **Mint/YNAB (Personal Finance):** While primarily category-driven, they offer robust filtering and some support for notes/tags, providing a good reference for financial data presentation.

### Transferable UX Patterns
- **Inline Tag Creation & Selection:** Allow users to add new tags or select existing ones directly from the transaction edit interface, similar to Trello's quick-add feature.
- **Color-Coded Badges:** Display tags as visually distinct, color-coded badges (pills) on transaction list items for quick identification, inspired by Trello/GitHub labels.
- **Filtering Integration:** Integrate tag filtering directly into the main transaction list's filter bar, similar to how financial apps handle categories or dates.
- **Search-as-you-type:** Implement an autocomplete or suggestion feature for tags to speed up selection.

### Anti-Patterns to Avoid
- **Forced Pre-definition:** Do not require users to create all tags in a separate settings area before use. Tag creation should be contextual and on-the-fly.
- **Visual Clutter:** Avoid dense, overlapping, or excessively large tag displays that detract from transaction readability.
- **Performance Lag:** Ensure the tagging input and filtering mechanisms are highly responsive.
- **Isolated Tags:** Tags without corresponding search/filter functionality are an anti-pattern.

### Design Inspiration Strategy
- **Adopt:** Inline tagging workflow, color-coded visual presentation, and integrated filtering from Trello/GitHub.
- **Adapt:** The overall data display and filtering principles from personal finance aggregators like Mint/YNAB, tailoring them for custom tag functionality.
- **Avoid:** Any patterns that introduce friction into tag creation or display clutter.

## Design System Foundation

### Design System Choice
- **Current Foundation:** The project currently utilizes **Bootstrap 5** with **React-Bootstrap** components.
- **Decision:** We will continue to leverage this existing design system to maintain visual and functional consistency across the application, and to optimize development speed.

### Rationale for Selection
- **Existing Integration:** Bootstrap 5 and React-Bootstrap are already integrated into the frontend, making it the most efficient choice.
- **Component Availability:** Bootstrap provides a comprehensive set of components, including badges/pills which are directly applicable for displaying transaction tags.
- **Consistency:** Ensures that new UI elements for the tagging system will align seamlessly with the existing application's aesthetic and behavior.
- **Developer Familiarity:** Leveraging an existing system reduces the learning curve and accelerates implementation.

### Implementation Approach
- **Utilize React-Bootstrap Components:** Prioritize the use of existing React-Bootstrap components for common UI patterns.
- **Custom Components (Bootstrap-styled):** For unique interactions like the "TagInput" (which combines selection and creation), custom React components will be developed, adhering to Bootstrap's styling guidelines and utility classes.

### Customization Strategy
- **Theme Variables:** Utilize Bootstrap's SASS variables for any global theme adjustments to ensure consistency.
- **Utility Classes:** Rely heavily on Bootstrap's utility classes for spacing, typography, and responsive design.

## 2. Core User Experience

### 2.1 Defining Experience
- **Core Interaction:** Seamlessly applying and managing custom tags on individual transactions.
- **What users will tell friends:** "It's like categories, but totally flexible! I just type, and all my trip expenses show up instantly."
- **One thing perfectly right:** The "TagInput" component, making tag selection, creation, and assignment intuitive, fast, and integrated.

### 2.2 User Mental Model
- **Expectations:** Users expect an autocomplete-like experience for tags with immediate visual feedback (e.g., badges) and direct filtering capabilities, similar to task management or social media apps.
- **Frustrations avoided:** No separate screens for tag management; fluid, inline interaction.

### 2.3 Success Criteria
- **"This just works":** Typing in the tag field immediately shows suggestions, and new tags are created with a simple 'Enter'.
- **Feedback:** Tags appear instantly as visual badges on the transaction; transaction list filters dynamically.
- **Speed:** Tag assignment/creation takes less than 1-2 seconds per tag.

### 2.4 Novel vs. Established Patterns
- **Established:** Autocomplete inputs, visual tag badges, and filtering mechanisms.
- **Innovative Integration:** The seamless combination of these established patterns into a single, highly efficient "TagInput" component that enables both selection and creation in one fluid motion, deeply integrated into the existing transaction CRUD UI.

### 2.5 Experience Mechanics
- **Initiation:** User clicks an "Add Tag" button or directly into a tag input field within a transaction's detail or inline edit view.
- **Interaction:** User types; system suggests existing tags or offers to create a new one. User selects or creates (via Enter), and a tag badge appears. User can remove tags by clicking 'x' on the badge.
- **Feedback:** Real-time suggestions, instant badge appearance, and dynamic list filtering (if applicable).
- **Completion:** User saves the transaction, and the assigned tags are persisted.

## Visual Design Foundation

### Color System
- **Base:** Utilize Bootstrap 5's default color palette to maintain consistency with the existing application.
- **Tag Colors:** Leverage Bootstrap's contextual background and text color utility classes (e.g., `bg-primary`, `bg-secondary`, `bg-success`, `bg-info`, `bg-warning`, `bg-danger`) for visually differentiating tags. Ensure good contrast for readability.
- **Accessibility:** Verify color contrast ratios for text and background, especially for tags, to meet WCAG AA standards.

### Typography System
- **Font Family:** Employ Bootstrap's default native font stack (system fonts) for optimal performance and integration with the operating system.
- **Hierarchy:** Maintain existing Bootstrap typographic scale for headings (h1-h6), body text, and form labels, ensuring clear visual hierarchy.
- **Readability:** Prioritize readability for transaction details and tag displays, leveraging Bootstrap's responsive typography features.

### Spacing & Layout Foundation
- **Grid System:** Utilize Bootstrap's responsive grid system for all layout needs, ensuring components are well-aligned and adapt to various screen sizes.
- **Spacing Utilities:** Consistently apply Bootstrap's spacing utilities (e.g., `m-`, `p-` classes) for margins and padding to maintain a harmonious visual rhythm and sufficient white space.
- **Density:** Aim for a balanced content density that is efficient without feeling cluttered, especially in the transaction list with new tags.

### Accessibility Considerations
- **Color Contrast:** Ensure all text and interactive elements meet minimum contrast ratios.
- **Keyboard Navigation:** Components, particularly the TagInput, must be fully navigable and operable via keyboard.
- **Semantic HTML:** Use appropriate semantic HTML elements for structure and assistive technology compatibility.

## Design Direction Decision

### Design Directions Explored
- Direction 1: "Clean & Functional" (Bootstrap Default Aesthetic)
- Direction 2: "Subtle & Integrated" (Harmonious Flow)
- Direction 3: "Prominent & Actionable" (High Visibility)

### Chosen Direction
Direction 2: "Subtle & Integrated"

### Design Rationale
This direction balances visual appeal with seamless integration into the existing UI, aligning with the "effortless" goal. It aims for a modern feel while using Bootstrap's capabilities to present tags clearly without clutter.

### Implementation Approach
Focus on using React-Bootstrap's `badge` or `pill` components with potential custom styling for a softer, rounded appearance. Integrate the `TagInput` component to appear contextually, perhaps expanding on focus to minimize initial visual footprint.

## User Journey Flows

### User Creates and Assigns a New Tag to a Transaction
```mermaid
graph TD
    A[User views Transaction Detail/Edit] --> B{Click "Add Tag" or Tag Input};
    B --> C[User types new tag name];
    C --> D{Tag not found};
    D -- Yes --> E[System suggests "Create 'NewTag'"];
    E --> F[User presses Enter/Clicks Create];
    F --> G[New Tag created];
    G --> H[Tag assigned to Transaction];
    H --> I[Tag appears as badge on Transaction];
    I --> J[Transaction Saved];
    D -- No --> H;
```

### User Assigns an Existing Tag to a Transaction
```mermaid
graph TD
    A[User views Transaction Detail/Edit] --> B{Click "Add Tag" or Tag Input};
    B --> C[User types partial tag name];
    C --> D[System suggests existing tags];
    D --> E[User selects existing tag];
    E --> F[Tag assigned to Transaction];
    F --> G[Tag appears as badge on Transaction];
    G --> H[Transaction Saved];
```

### User Filters Transactions by Tag
```mermaid
graph TD
    A[User views Transaction List] --> B{Click "Tags" filter dropdown};
    B --> C[Filter dropdown shows available tags];
    C --> D[User selects one or more tags];
    D --> E[Transaction list updates to show only tagged transactions];
    E --> F[User can remove tags from filter/clear filter];
```

### Journey Patterns
- **Interaction Pattern:** "Type-to-Search-or-Create" for efficient tag input and management.
- **Display Pattern:** "Contextual Badges" where tags are visually integrated directly on transaction items.
- **Filtering Pattern:** "Dynamic List Filtering" providing real-time updates to the transaction list based on selected tags.

### Flow Optimization Principles
- **Minimize Steps:** Combine tag creation and selection into a single, fluid input interaction.
- **Clear Visual Feedback:** Provide immediate visual cues for tag assignment and filtering results.
- **Intuitive Discovery:** Tags and filtering options should be easily discoverable within the transaction UI.

## Component Strategy

### Design System Components
- **Bootstrap Badges/Pills:** Directly usable for displaying individual tags on transactions.
- **React-Bootstrap Dropdown:** Suitable for the tag filter selection in the transaction list.
- **React-Bootstrap FormControl/InputGroup:** Will serve as the base for the text input part of the custom TagInput component.
- **React-Bootstrap Buttons:** For various actions (e.g., "Add Tag", "Remove Filter").

### Custom Components
- **TagInput:**
    - **Purpose:** Enables users to search for existing tags, select multiple, and create new tags on-the-fly within a single input field.
    - **Usage:** Primarily within transaction detail/edit views.
    - **Anatomy:** Combines a text input, a dropdown for suggestions, and displayed selected tags as badges within the component.
    - **States:** Default, focused, with suggestions, with selected tags, empty, disabled.
    - **Accessibility:** Comprehensive ARIA labels, keyboard navigation (Tab, Arrow keys, Enter, Esc), and clear focus states.
- **TagList:**
    - **Purpose:** A presentation component for rendering an array of tags as interactive badges.
    - **Usage:** Displaying tags on transaction rows, in detail views.
    - **Anatomy:** A container for multiple `Badge` components.
- **TagFilter:**
    - **Purpose:** Integrates into the existing transaction filter bar to allow filtering by one or multiple tags.
    - **Usage:** Top-level transaction list filter.
    - **Anatomy:** A dropdown menu with checkboxes or multi-select capabilities for tags.

### Component Implementation Strategy
- **React-Bootstrap Integration:** Build custom components to seamlessly integrate with the existing React-Bootstrap environment.
- **Styling Consistency:** Adhere to Bootstrap's styling conventions and utilize its utility classes to ensure a unified visual design.
- **Accessibility First:** Prioritize accessibility features (keyboard navigation, ARIA attributes) during development.
- **Reusability:** Design custom components to be highly reusable across the application.

### Implementation Roadmap
- **Phase 1 (Core Functionality):** Develop the `TagInput` component and the `TagList` display component, enabling users to add/remove tags on individual transactions.
- **Phase 2 (Filtering & Management):** Develop the `TagFilter` component for the transaction list and basic tag management UI (e.g., a simple screen to view all tags with rename/delete options).

## UX Consistency Patterns

### TagInput Form Pattern
- **When to Use:** For assigning new or existing tags to transactions.
- **Visual Design:** An input field with real-time suggestions for existing tags, allowing for new tag creation. Selected tags are displayed as Bootstrap `pill` badges below or within the input area.
- **Behavior:** Users type to filter suggestions; click to select; press `Enter` to confirm selection or create a new tag. Clicking 'x' on a tag badge removes it. Suggestions disappear when focus is lost or a tag is selected.
- **Accessibility:** Full keyboard navigation (Tab to focus, arrow keys for suggestions, Enter to select/create, Esc to close), ARIA attributes for dynamic content updates.

### Feedback Patterns (Tagging)
- **When to Use:** For confirming tag actions or indicating errors.
- **Visual Design:**
    - **Success:** Subtle, immediate visual confirmation (e.g., tag badge appears instantly, or a brief outline highlight on the input).
    - **Error:** Clear visual cues like a red outline around the TagInput field with a small, concise error message (e.g., "Tag name too long") below.
- **Behavior:** Feedback should be non-disruptive, allowing the user to continue their workflow.

### Search and Filtering Patterns (Tags)
- **When to Use:** On the transaction list view to narrow down displayed transactions.
- **Visual Design:** A filter dropdown, integrated into the existing filter bar, providing a multi-select list of available tags. Selected filter tags are displayed as compact badges next to the filter dropdown button.
- **Behavior:** Selecting/deselecting tags from the dropdown instantly updates the transaction list. A "Clear Filters" option is available to reset tag filters.
- **Accessibility:** Standard keyboard navigation for dropdowns, clear focus states.

### General Consistency Guidelines
- **Visual Hierarchy:** Maintain clear visual hierarchy for all interactive elements, consistent with Bootstrap's primary/secondary/tertiary button conventions.
- **Responsiveness:** All tag-related components and patterns must adapt gracefully across different screen sizes, leveraging Bootstrap's responsive utilities.

## Responsive Design & Accessibility

### Responsive Strategy
- **Mobile-First Approach:** The design will prioritize the mobile experience and progressively enhance for larger screens, leveraging Bootstrap's inherent mobile-first grid system.
- **Adaptation:** All components, especially the new TagInput, TagList, and TagFilter, will be designed to adapt gracefully across various screen sizes (mobile, tablet, desktop) without loss of functionality or clarity.

### Breakpoint Strategy
- **Standard Bootstrap Breakpoints:** Utilize Bootstrap's default breakpoints (`sm`, `md`, `lg`, `xl`, `xxl`) to manage layout shifts, component stacking, and visibility based on screen width.
- **Fluid Layouts:** Implement fluid layouts within breakpoints to ensure content scales smoothly between fixed sizes.

### Accessibility Strategy
- **WCAG 2.1 Level AA Compliance:** Aim for this industry-standard level of accessibility to ensure the product is usable by the widest possible audience.
- **Key Considerations:**
    - **Color Contrast:** Ensure all new UI elements, particularly tag badges and filter selections, meet WCAG 4.5:1 contrast ratios for normal text.
    - **Keyboard Navigation:** All interactive elements, especially the TagInput and TagFilter, must be fully operable and navigable using only the keyboard.
    - **Screen Reader Compatibility:** Use appropriate semantic HTML elements and ARIA attributes to convey the purpose and state of interactive components to screen reader users.
    - **Touch Target Sizes:** Ensure interactive areas, such as clickable tags and filter buttons, meet the minimum recommended touch target size of 44x44 pixels.
    - **Focus Indicators:** Implement clear and visible focus indicators for all interactive elements.

### Testing Strategy
- **Responsive Testing:** Conduct testing using browser developer tools' device emulation mode and and, where feasible, on actual mobile and tablet devices across Chrome, Firefox, and Safari.
- **Accessibility Testing:** Employ automated accessibility checkers (e.g., Google Lighthouse, axe DevTools) and conduct manual testing using keyboard-only navigation and screen readers (e.g., NVDA, VoiceOver).

### Implementation Guidelines
- **Responsive Development:** Utilize Bootstrap's responsive utility classes extensively. Employ relative units (rem, em, 
Figma Make Prompt

Create a complete enterprise web application UI/UX prototype for an AI-powered Consumer Sentiment Analysis Platform called "CIPHER".

Generate this application as a React.js + Tailwind CSS based UI with reusable components, scalable folder structure, responsive design, and production-ready UX patterns.

Use the attached reference design/PDF as the visual guideline.

Follow:

Same UI theme
Same colors
Same typography style
Same analytics/dashboard visual style
Same card-based design approach

Support:

Light theme
Dark theme
Theme switch toggle
React Application Structure

Design the UI based on this folder structure:

src/

components/

common/
Button
Card
Modal
Table
SearchBox
Filter
Dropdown
ThemeToggle
Chart components
product/
ProductCard
ProductGrid
SentimentChart
AttributeAnalysis
ReviewCard
AIChat
admin/
SBUCard
UserTable
InvitationModal
UsageDashboard

pages/

Login
Home
ProductAnalysis
ProductComparison
AggregateAnalysis
Collections
SBUDashboard
SBUDetails
AdminDashboard

theme/

light
dark

styles/

globals.css
tailwind.css

assets/

images
icons
fonts

Create reusable React components and avoid duplicate UI elements.

Authentication UI

Create only Microsoft SSO login.

Do not create:

Username input
Password input
Manual registration form

Login screen:

Include:

CIPHER logo
Welcome message
"Sign in with Microsoft" button

Authentication flow:

Login →
Microsoft SSO →
Role based redirect

User Roles

Create three user experiences.

System Admin

Capabilities:

Create SBU
Assign SBU Admin
Create users
Manage SBU
View all analytics
View all product analysis
SBU Admin

Capabilities:

Invite users
Manage users
View SBU dashboard
View collections
View analysis history
SBU User

Capabilities:

View dashboard
Analyze products
Save collections
Compare products
Remove Global Navigation

Do not create:

Top navigation menu
Sidebar navigation

After login:

Open directly into the correct landing page.

Use only:

Header:

Left:
Page title

Right:

Theme toggle
Role-based action button
System Admin Home Page

After login:

Open Product Home.

Page contains:

Brand Selection

Display:

Brand logos
Single brand selection
Multiple brand selection
Product Search

Create:

Search by:

Keyword
Product URL
Product Result Cards

Display:

Product image
Product name
Brand
Category
Review count
Sentiment summary

On hover display:

Actions:

Add to Collection
Analyze Product
View Product Website
Product Analysis Page

Create detailed single product analysis UI.

Header:

Display:

Product image
Product name
Brand
Category
Review count

Actions:

Share Product
Add Collection
Open AI Assistant
Sentiment Dashboard

Create:

Pie chart:

Positive
Neutral
Negative
Product Attribute Analysis

Create analytics cards for:

Fit & Sizing
Material Quality
Comfort
Design Aesthetic
Value Perception
Performance
Functionality
Workmanship
Overall Quality
Durability

Show:

Positive %
Neutral %
Negative %

Low usage attributes should have reduced opacity.

Review Analysis

Create review explorer.

Features:

Search review text.

Filters:

Sentiment:

Positive
Neutral
Negative

Attribute filters.

Review cards:

Highlight sentiment sections.

Product Comparison Page

Allow:

Minimum products:
2

Maximum products:
10

Layout:

Horizontal comparison view.

Features:

Product cards side-by-side
Horizontal scrolling
Pin one product
Compare against pinned product
Aggregate Analysis Page

Allow selecting multiple products.

Display:

Combined sentiment
Combined attributes
Combined reviews

Create impact visualization:

Example:

Attribute:
Comfort

Show:

Which product contributes most to negative sentiment.

Use:

Heatmap
Contribution charts
AI Assistant

Create floating chatbot.

Visible only inside:

Product Analysis
Comparison Analysis
Aggregate Analysis

Chat:

Right side drawer.

Text chat only.

Saved Collections

Create collections management UI.

Features:

Create collection
Add products
Reuse collections

Collection card:

Show:

Collection name
Product count
Owner
Created date

Actions:

Analyze
Compare
Aggregate
SBU Dashboard

Used by:

SBU Admin
SBU User

No product search here.

Dashboard sections:

Users

Table:

Name
Email
Role
Status
Saved Collections

Show:

Collection name
Owner
Products
Analytics History

Show:

Product analysis
Comparison analysis
Aggregate analysis
User Activities

Timeline:

Examples:

Login
Product analyzed
Collection created
System Admin SBU Management

Create SBU Management page.

Display:

SBU cards/list.

Each SBU:

Show:

SBU name
Assigned admin
User count
Status

Header button:

Create SBU

SBU Details Page

When clicking SBU:

Display:

SBU name

Sections:

Users

Show:

Active users
Pending invitations

Actions:

Invite User
Disable User
Remove User
Saved Collections

Show all SBU collections.

Analysis History

Table:

User
Product
Analysis type
Date
Activity Timeline

Show user activities.

Invitation Management

System Admin:

Can invite:

SBU Admin
Users

SBU Admin:

Can invite:

Users

Invitation modal:

Fields:

Email
Role
SBU

Statuses:

Pending
Accepted
Expired
Header Actions

System Admin:

Show:

Create SBU button

SBU Admin:

Show:

Invite User button

SBU User:

No admin actions

Responsive Design

Create:

Desktop-first design

Support:

1440px desktop
Tablet
Mobile
Final Output Required

Generate:

Complete UI screens
React component structure
Tailwind CSS styling
Reusable components
Role-based screens
Light/Dark themes
Interactive prototype flows
Enterprise dashboard design
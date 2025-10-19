# Grind - Online Coding Platform

**Grind** is a full-stack competitive programming platform where developers can solve DSA problems, participate in coding contests, and practice their skills with a built-in multi-language compiler.

##  Features

###  Problem Solving
- **Extensive Problem Library**: Browse and solve Data Structures & Algorithms (DSA) problems
- **Multiple Difficulty Levels**: Problems categorized as Easy, Medium, and Hard
- **Tags & Filtering**: Filter problems by topics like arrays, trees, dynamic programming, etc.
- **Test Cases**: Public and hidden test cases for each problem
- **Submission History**: Track your progress and view past submissions

### Contests
- **Weekly & Monthly Contests**: Participate in regularly scheduled coding competitions
- **Live Leaderboards**: Real-time ranking system during contests
- **Prize Pools**: Win rewards for top performances
- **Contest History**: View past contests and results

###  Built-in Compiler
- **Multi-Language Support**: Write and execute code in 8+ programming languages
  - Python
  - JavaScript
  - TypeScript
  - Java
  - C++
  - C
  - Go
  - Rust
- **Real-time Execution**: Run your code instantly with custom inputs
- **Code Editor**: Syntax-friendly textarea with download and copy features
- **Output Display**: Separate panels for input, output, and error messages

### Admin Dashboard
- **Problem Management**: Create, edit, and delete problems with rich descriptions
- **Contest Management**: Schedule and manage contests with multiple problems
- **Analytics**: View submission statistics, acceptance rates, and user metrics
- **User Management**: Monitor platform activity and user progress

### Modern UI/UX
- **Dark/Light Theme**: Toggle between themes for comfortable coding
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Smooth Navigation**: Intuitive user interface with React Router

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Recoil** - State management
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database
- **PostgreSQL** - Database
- **E2B Sandbox** - Secure code execution

### Architecture
- **Turborepo** - Monorepo management
- **pnpm** - Package manager
- **Shared Packages**: UI components, database client, configs


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm 8+
- PostgreSQL database
- E2B API key (sign up at [e2b.dev](https://e2b.dev))

### Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/shuklatul1021/Grind.git
cd Grind
npm install

# 2. Setup database
cd packages/db
npm prisma migrate dev
npm prisma generate
cd ../..

# 4. Start development servers
npm install 
npm dev
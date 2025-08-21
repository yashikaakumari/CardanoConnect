# Overview

This is a full-stack Cardano wallet application with cross-chain FLO compatibility. The system enables users to manage Cardano wallets using FLO private keys, providing a unique bridge between the FLO and Cardano blockchains. The application features a modern React frontend with a TypeScript Express backend, supporting wallet creation, transaction management, asset tracking, and blockchain exploration capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management with custom hooks
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints for wallet operations, transactions, and assets
- **Validation**: Zod schemas for request validation and type safety

## Data Storage Solutions
- **ORM**: Drizzle with PostgreSQL dialect configuration
- **Schema**: Type-safe database schema with automatic TypeScript generation
- **Migration**: Drizzle Kit for database schema migrations
- **Connection**: Neon Database serverless PostgreSQL connection

## Core Features
- **Wallet Management**: Create, import, and manage multiple Cardano wallets
- **FLO Integration**: Import wallets using FLO private keys with cryptographic compatibility
- **Transaction Processing**: Send and receive ADA with fee estimation and status tracking
- **Asset Management**: Support for native Cardano tokens and multi-asset transactions
- **Blockchain Explorer**: Search and view transaction history for any Cardano address
- **Cross-Chain Compatibility**: Derive Cardano addresses from FLO private keys

## Security Architecture
- **Key Management**: Secure private key storage and cryptographic operations
- **Address Validation**: Comprehensive Cardano address format validation
- **Transaction Signing**: Client-side transaction signing with private key protection
- **Cross-Chain Security**: Safe derivation of Cardano keys from FLO private keys

# External Dependencies

## Blockchain SDKs
- **@meshsdk/core**: Cardano blockchain interaction and wallet management
- **@meshsdk/wallet**: Browser wallet integration for Cardano
- **bitcoinjs-lib**: Bitcoin/FLO cryptographic operations and address handling
- **bip32**: Hierarchical deterministic key derivation
- **bip39**: Mnemonic seed phrase generation and validation

## Database and Storage
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **drizzle-kit**: Database migration and schema management

## UI and Styling
- **@radix-ui/***: Comprehensive accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **lucide-react**: Modern icon library

## Development Tools
- **vite**: Fast development server and build tool
- **tsx**: TypeScript execution for Node.js
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation and TypeScript inference
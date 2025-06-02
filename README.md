# Blogify 📝

Blogify is a modern blogging application inspired by platforms like Medium, designed to empower users to share their ideas and stories with the world.

**Live Demo:** [https://blogify-x-two.vercel.app/](https://blogify-x-two.vercel.app/)

---

## Tech Stack 💻

### Frontend

* **React**: A JavaScript library for building user interfaces, providing a flexible and efficient way to create dynamic web applications.
* **TypeScript**: A statically typed superset of JavaScript that enhances code quality, maintainability, and developer productivity.
* **Zod**: A TypeScript-first schema declaration and validation library, enabling robust type checking and validation of frontend data.
* **JWT (JSON Web Tokens)**: A standard for securely transmitting information between parties as a JSON object, commonly used for authentication in web applications.

### Backend

* **Cloudflare Workers**: A serverless execution environment allowing JavaScript code to run at the edge of Cloudflare's network, providing scalable and efficient backend logic. Powered by [Hono](https://hono.dev/top).
* **TypeScript**: Leveraged for backend development, ensuring consistent type safety and code integrity across the entire application.
* **Prisma**: A modern ORM (Object-Relational Mapping) tool that simplifies database access and manipulation, offering type-safe database queries and schema migrations. Learn more at [Prisma](https://www.prisma.io/).
* **PostgreSQL**: A powerful open-source relational database management system, chosen for its reliability, scalability, and extensive feature set. Hosted via [Aiven](https://aiven.io/).

---

## Getting Started 🚀

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Shivam1817/BlogifyX](https://github.com/Shivam1817/BlogifyX)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd BlogifyX
    ```
3.  **Install dependencies:**

    For the frontend:
    ```bash
    cd frontend
    npm install
    ```
    For the backend:
    ```bash
    cd ../backend
    npm install
    ```
4.  **Set up environment variables:**

    Create a `.env` file and a `wrangler.toml` file inside the `backend` directory.

    * **Inside `.env`:** (Primarily for local Prisma Studio or direct DB access if needed, though Workers use `wrangler.toml`)
        * Use your [Aiven](https://aiven.io/) PostgreSQL database URL.
        ```env
        DATABASE_URL="YOUR_AIVEN_DATABASE_URL"
        ```

    * **Creating Connection Pool with Prisma Accelerate:**
        1.  Go to the [Prisma Data Platform](https://www.prisma.io/data-platform/accelerate) and create a new project.
        2.  Click **Enable Accelerate**.
        3.  Under **Database Connection String**, paste your Aiven Database URL.
        4.  Click **ENABLE ACCELERATE**.
        5.  Click **Generate API Key**.
        6.  A URL (connection pool URL) will be generated.

    * **Inside `wrangler.toml`:**
        * Paste the Prisma Accelerate connection pool URL. This is crucial as Cloudflare Workers use this file for environment variables.
        ```toml
        name = "backend"
        compatibility_date = "2023-12-01" # Ensure this date is appropriate for your Worker

        [vars]
        DATABASE_URL="YOUR_PRISMA_ACCELERATE_CONNECTION_POOL_URL"
        JWT_SECRET="your_strong_jwt_secret" # It's highly recommended to use a strong, unique secret
        ```
        > **Important**: Cloudflare Workers do **not** use `.env` files for environment variables during deployment. They rely on the `[vars]` section in `wrangler.toml`.

5.  **Start the backend server (Cloudflare Workers):**
    (Ensure you are in the `backend` directory)
    ```bash
    npm run dev
    ```

6.  **Start the frontend development server:**
    (Ensure you are in the `frontend` directory)
    ```bash
    npm run dev
    ```
    Access the application in your browser. Common default ports are `http://localhost:5173` (Vite) or `http://localhost:3000` (Create React App). Please verify the port for your frontend setup.

---

## Database Migrations (Prisma) 🛠️

* **NOTE**: If you make changes to your database schema in the `schema.prisma` file, you need to create a new migration and apply it:
    ```bash
    npx prisma migrate dev --name your_migration_name
    ```
    (Replace `your_migration_name` with a descriptive name for your changes, e.g., `add_user_profile_table`)
    * This will create a new migration file in the `prisma/migrations` folder.

* Then, **generate the Prisma Client** to reflect the schema changes in your TypeScript types:
    ```bash
    # Ensure you are in the backend directory
    npx prisma generate --no-engine
    ```
    (The `--no-engine` flag is often used when deploying to serverless environments like Cloudflare Workers where the binary query engine might not be needed or desired directly in the bundle, relying on Data Proxy or Accelerate).

---

## Deployment ☁️

### Backend (Cloudflare Workers)

1.  **Authenticate with Wrangler (if you haven't already):**
    ```bash
    npx wrangler whoami
    ```
    If not logged in:
    ```bash
    npx wrangler login
    ```
2.  **Deploy the backend to Cloudflare Workers:**
    (Ensure you are in the `backend` directory)
    ```bash
    npm run deploy
    ```

### Frontend (e.g., Vercel, Netlify)

Deployment for the frontend will depend on your chosen hosting provider (like Vercel, which you've used). Generally, you'll connect your Git repository and configure build settings.

For Vercel (as indicated by your live demo URL):
1. Push your `frontend` code to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your Git repository.
3. Configure the project settings (e.g., root directory should be `frontend`, build command `npm run build`, output directory `dist` or `build` depending on your setup).
4. Deploy.

---

### Important Considerations:

* **Connection Pooling with Cloudflare Workers**:
    * Cloudflare Workers can create multiple instances globally. Direct database connections from each instance can be inefficient and may overwhelm your database.
    * Using a connection pooler like **Prisma Accelerate** is highly recommended. It manages database connections efficiently, providing a stable and scalable way for your distributed Workers to interact with your PostgreSQL database. This project is configured to use Prisma Accelerate via the `DATABASE_URL` in `wrangler.toml`.

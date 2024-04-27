## Description 

**Car rent management system** is an online platform provided to the user for searching and booking cars for their beautiful trips and other works , without actually buying it and spending lots of money.

User will able to search the cars based on cars price, features, ratings and many more things  which makes users to choose the cars efficiently as per their demand and budget.

The user will also able to add and edit cars on this platform  , if they want to give that on rent. 


## Features

- User Sign in and Sign up is implemented with different validation parameters and password is being stored in hash format.
- The Home page will show the latest cars added by the users dynamically.
- User can search all the cars available and also based on the destination , dates and the capacity of passengers.
- Added pagination for easier browsing and smoother navigation through car listings.
- I added Cloudinary to make sure all the car images are stored and managed well. It helps keep things organized and makes the app run smoothly.
- I integrated Stripe for secure payment processing. This ensures that users can safely book cars and complete transactions hassle-free.

## Tech Stack

**Frontend :** React, TailwindCSS

**Backend :** Node, Express

**Database :** MongoDB Atlas

**External :** multer, cors, bcryptjs, cloudinary, stripe , etc., 

## Setting Up the Project
This will guide you how to setup this project on your local machine.

### Prerequisites
Before start check if you have Node.js installed on your system.

### Clone the Repository 
Clone the project and go to the project directory.
```bash
  git clone https://github.com/sonu4312/mern-car-booking.git
  cd mern-car-booking
```
### Backend Configuration

1. **Environment Files**: Navigate to the `backend` folder and create two files: `.env` and `.env.e2e`. Add the following contents to both files:

    ```plaintext
    MONGODB_CONNECTION_STRING=
    JWT_SECRET_KEY=
    FRONTEND_URL=
    
    # Cloudinary Variables
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    # Stripe
    STRIPE_API_KEY=
    ```

2. **MongoDB Setup**:
- Sign up for an account at MongoDB Atlas [Mongo Atlas](https://www.mongodb.com/cloud/atlas) and create a cluster.
- Afer setting up the account , obtain you MongoDB connection string and add it to the `MONGODB_CONNECTION_STRING` variable in your `.env` files.
- For the `.env.e2e` setup see "running automated tests" below.

3. **Cloudinary Setup**:
- Create an account at [Cloudinary](https://cloudinary.com/).
- Navigate to your dashboard to find your cloud name, API key, and API secret.
- Add these details to the respective `CLOUDINARY_*` variables in your `.env` and `.env.e2e` files.

4. **Stripe Setup**:
- Sign up for a Stripe account at [Stripe](https://stripe.com/).
- Find your API keys in the Stripe dashboard.
- Add your Stripe API key to the `STRIPE_API_KEY` variable in your `.env` and `.env.e2e` files.

5. **JWT_SECRET_KEY**:
- This just needs to be any long, random string. You can google "secret key generator" and add it to the `.env` and `.env.e2e` files.

6. **Frontend URL**:
- The `FRONTEND_URL` should point to the URL where your frontend application is running (typically `http://localhost:5173` if you're running it locally).

### Frontend Configuration

1. **Environment Files**: Navigate to the `frontend` folder and create a file: `.env`:
```plaintext
    VITE_API_BASE_URL=
    VITE_STRIPE_PUB_KEY=
```
2. **VITE_API_BASE_URLL**:
- The `VITE_API_BASE_URL` should point to the URL where your backend application is running (typically `http://localhost:7000` if you're running it locally).

3. **VITE_STRIPE_PUB_KEY**:
- This key public api key that will be obtained from the Stripe dashboard.


### Running the Application

1. **Backend**:
   - Navigate tp the `backend` directory.
   - Install the dependencies: `npm install` .
   - Start the server :  `npm start`.
  
2. **Frontend**:
   - Open a new terminal and navigate to the `frontend ` directory.
   - Install dependencies: `npm install`.
   - Start the frontend application: `npm run dev`.
   - Check the terminal and navigate to the running url i.e. `http://localhost:5173`.
  

### Running automated tests

1. **MongoDB Setup**:
   - Create a new mongodb database for the run that will run your tests.
   - Create a new project (e.g- e2e tests).
   - Obtain the connnection string and add it to the `MONGODB_CONNECTION_STRING` variable in your `env.e2e` file.

2. **Running tests**
   - In VS code install the [Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
   - Navigate to the `backend` directory.
   - Install dependencies: `npm install`
   - Start the frontend and backend as :
     - ../frontend>`npm run dev`.
     - ../backend>`npm run e2e`.
   - Navigate to the frontend url and add some cars and data for running the test and see the steps for running test in playwright. [steps for running playwright test](https://playwright.dev/docs/getting-started-vscode#running-tests).
  

### Deployement

- Deployed frontend and backend both on same server by compiling typescript code to the javascript and host the application in live environment using [render](https://render.com/)
- My Web Application is now live on: **[https://renthub-7gz2.onrender.com](https://renthub-7gz2.onrender.com)**
    

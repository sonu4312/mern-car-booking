import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddCar from "./pages/AddCar";
import { useAppContext } from "./contexts/AppContext";
import MyCars from "./pages/MyCar";
import EditCar from "./pages/EditCar";
import Search from "./pages/Search";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        {/* <Route
          path="/search"
          element={
            <Layout>
              <Search/>
            </Layout>
          }
        /> */}

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        {isLoggedIn && (
          <> 
          <Route
          path="/search"
          element={
            <Layout>
              <Search/>
            </Layout>
          }
        />
          <Route
              path="/add-car"
              element={
                <Layout>
                  <AddCar />
                </Layout>
              }
            />
            <Route
              path="/edit-car/:carId"
              element={
                <Layout>
                  <EditCar />
                </Layout>
              }
            />
            <Route
              path="/my-cars"
              element={
                <Layout>
                  <MyCars />
                </Layout>
              }
            />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
export default App;

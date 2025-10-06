import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext"; // import AuthProvider
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import BlogList from "./pages/Blogs/BlogList";
import PrivateRoute from "./components/auth/PrivateRoute";
import UserDashBoard from "./pages/userPages/UserDashboard";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import ChangePasswordForm from './components/header/ChangePasswordForm';
import AddBlogs from "./components/AddBlogs";
import NewsletterLisging from "./components/tables/BasicTables/NewsletterLisging";
import AddNewsletter from "./components/addNewsletter";
import UserMetaCard from "./components/UserProfile/UserMetaCard";
import ContactEnquiryListing from "./components/tables/BasicTables/ContactEnquiryListing";
import AddContactEnquiry from "./components/AddContactEnquiry";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* Dashboard Layout protected by role */}
          <Route
            element={
              <PrivateRoute roles={["admin", "editor"]}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index path="/userdashboard" element={<UserDashBoard />} />
            <Route index path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/edit/:id" element={<AddBlogs />} />
            <Route path="/addblog" element={<AddBlogs />} />
            <Route path="/newsletter" element={<NewsletterLisging/>} />
            <Route path="/addnewsletter" element={<AddNewsletter/>} />
            <Route path="/contactenquiry" element={<ContactEnquiryListing/>} />
            <Route path="/addcontactenquiry" element={<AddContactEnquiry/>} />


            <Route path="/profile" element={<UserProfiles />} />
            {/* <Route path="/profile" element={<UserMetaCard/>} /> */}

            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/change-password" element={<ChangePasswordForm/>} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

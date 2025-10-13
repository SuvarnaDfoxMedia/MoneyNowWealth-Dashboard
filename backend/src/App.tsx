import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Pages Routing
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";

import Home from "./pages/Dashboard/Home";
import UserDashBoard from "./pages/userPages/UserDashboard";
import BlogList from "./pages/Blogs/BlogList";
import AddBlogs from "./components/AddBlogs";

import NewsletterLisging from "./components/tables/BasicTables/NewsletterLisging";
import AddNewsletter from "./components/AddNewsletter";
import ContactEnquiryListing from "./components/tables/BasicTables/ContactEnquiryListing";
import AddContactEnquiry from "./components/AddContactEnquiry";
import ChangePasswordForm from "./components/header/ChangePasswordForm";

import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";

import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import PreviewBlog from "./components/PreviewBlog";
import BlogCategoryListing from "./components/tables/BasicTables/BlogCategoryListing";
import AddBlogCategory from "./components/AddBlogCategory";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-5 text-center">Loading...</p>;

  const role = user?.role;

  return (
    <Routes>
  {/* Default landing */}
  <Route
    path="/"
    element={
      user ? (
        role === "admin" || role === "editor" ? (
          <Navigate to={`/${role}/dashboard`} replace />
        ) : (
          <Navigate to="/user/dashboard" replace />
        )
      ) : (
        <Navigate to="/signin" replace />
      )
    }
  />

  {/* Public Routes */}
  <Route path="/signin" element={<SignIn />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />

  {/* Admin & Editor Routes */}
  <Route element={<PrivateRoute roles={["admin", "editor"]}><AppLayout /></PrivateRoute>}>
    <Route path="/:role/dashboard" element={<Home />} />
    <Route path="/:role/blogcategories" element={<BlogCategoryListing/>} />
    <Route path="/:role/blogcategories/create" element={<AddBlogCategory/>} />
    <Route path="/:role/blogcategories/edit/:id" element={<AddBlogCategory />} />


    <Route path="/:role/blogs" element={<BlogList />} />
    <Route path="/:role/blogs/create" element={<AddBlogs />} />
    <Route path="/:role/blog/edit/:id" element={<AddBlogs />} />
    <Route path="/:role/blogs/preview/:id" element={<PreviewBlog />} />
    <Route path="/:role/profile" element={<UserProfiles />} />  
    <Route path="/:role/change-password" element={<ChangePasswordForm />} />

    {/* Admin-only routes */}
    {role === "admin" && (
      <>
        <Route path="/:role/newsletter" element={<NewsletterLisging />} />
        <Route path="/:role/addnewsletter" element={<AddNewsletter />} />
        <Route path="/:role/contactenquiry" element={<ContactEnquiryListing />} />
        <Route path="/:role/addcontactenquiry" element={<AddContactEnquiry/>} />

        <Route path="/form-elements" element={<FormElements />} />
        <Route path="/basic-tables" element={<BasicTables />} />
        <Route path="/blank" element={<Blank />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/avatars" element={<Avatars />} />
        <Route path="/badge" element={<Badges />} />
        <Route path="/buttons" element={<Buttons />} />
        <Route path="/images" element={<Images />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/line-chart" element={<LineChart />} />
        <Route path="/bar-chart" element={<BarChart />} />
        <Route path="/calendar" element={<Calendar />} />
      </>
    )}
  </Route>

  {/* User Routes */}
  <Route element={<PrivateRoute roles={["user"]}><AppLayout /></PrivateRoute>}>
    <Route path="/user/dashboard" element={<UserDashBoard />} />
    <Route path="/user/profile" element={<UserProfiles />} />          
    <Route path="/user/change-password" element={<ChangePasswordForm />} /> 
  </Route>

  {/* Fallback */}
  <Route path="*" element={<NotFound />} />
</Routes>

  );
}

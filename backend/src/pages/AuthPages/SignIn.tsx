import PageMeta from "../../components/common/PageMeta";
<<<<<<< HEAD
=======
import AuthLayout from "./AuthPageLayout";
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | MoneyNowWealth"
        description="MoneyNowWealth"
      />
      {/* <AuthLayout> */}
        <SignInForm />
      {/* </AuthLayout> */}
    </>
  );
}

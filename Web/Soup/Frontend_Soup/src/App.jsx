import NewPasswordPage from './NewPasswordPage.jsx'
import ForgotPasswordPage from './ForgotPasswordPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import ListMenuClassPage from './ListMenuClassPage.jsx'
import LandingPage from './LandingPage'
import LoginPage from './LoginPage.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import DefaultLayout from './layout/DefaultLayout.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DetailPage from './DetailPage.jsx'
import CheckoutPage from './CheckoutPage.jsx'
import Footer from './Komponen/Footer/Footer';
import SuccessfullPayment from './Komponen/Checkout/SuccessfullPayment.jsx'
import DefaultLayoutEmptyNav from './layout/DefaultLayoutEmptyNav.jsx'
import SuccessConfirmation from './SuccessConfirmation.jsx'
import DefaultLayoutAdminNav from './layout/DefaultLayoutAdminNav.jsx'
import AdminCategory from './AdminCategory.jsx'
import AdminCourse from './AdminCourse.jsx'
import Invoice from './Komponen/InvoicePage/Invoice.jsx'
import MyClass from './Komponen/MyClassPage/MyClass.jsx'
import AuthCheck from './layout/AuthCheck.jsx'
import DetailsInvoice from './Komponen/InvoicePage/DetailsInvoice.jsx'
import AdminPaymentMethod from './AdminPaymentMethod.jsx'
import AdminInvoice from './AdminInvoice.jsx'
import AdminUser from './AdminUser.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
      <Route
          path="/"
          element={
            <DefaultLayout>
              <LandingPage />
              <Footer/>
            </DefaultLayout>
          }
        />
        <Route
          path="/menu-list/:type_name"
          element={
            <DefaultLayout>
              <ListMenuClassPage />
              <Footer/>
            </DefaultLayout>
          }
        />
        <Route
          path="/detail/:type_name/:id"
          element={
            <DefaultLayout>
              <AuthCheck>
              <DetailPage/>
              <Footer/>
              </AuthCheck>
            </DefaultLayout>
          }
        />
          <Route
          path="/login"
          element={
            <DefaultLayout>
              <LoginPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/register"
          element={
            <DefaultLayout>
              <RegisterPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <DefaultLayout>
              <ForgotPasswordPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/new-password/:token"
          element={
            <DefaultLayout>
              <NewPasswordPage />
            </DefaultLayout>
          }
          
        />
        <Route
          path="/checkout"
          element={
            <DefaultLayout>
              <AuthCheck>
              <CheckoutPage />
              </AuthCheck>
            </DefaultLayout>
          }
          
        />
        {/* <Route
          path="payment-method"
          element={
              <PaymentMethodPage/>
          }
        /> */}
        <Route
          path="/successfull"
          element={
            <DefaultLayoutEmptyNav>
              <AuthCheck>
              <SuccessfullPayment />
              </AuthCheck>
            </DefaultLayoutEmptyNav>
          }
        />
        <Route
          path="/invoice"
          element={
            <DefaultLayout>
              <AuthCheck>
              <Invoice />
              <Footer/>
              </AuthCheck>
            </DefaultLayout>
          }
        />
        <Route
          path="/details-invoice/:id/:created_at"
          element={
            <DefaultLayout>
              <AuthCheck>
              <DetailsInvoice />
              <Footer/>
              </AuthCheck>
            </DefaultLayout>
          }
        />
        <Route
          path="/my-class"
          element={
            <DefaultLayout>
              <AuthCheck>
              <MyClass />
              <Footer/>
              </AuthCheck>
            </DefaultLayout>
          }
        />
        <Route
          path="/success-confirmation/:token"
          element={
            <DefaultLayoutEmptyNav>
              <SuccessConfirmation />
            </DefaultLayoutEmptyNav>
          }
        />
        <Route
          path="/admin/category"
          element={
            <DefaultLayoutAdminNav>
              <AdminCategory/>
            </DefaultLayoutAdminNav>
          }
        />
        <Route
          path="/admin/course"
          element={
            <DefaultLayoutAdminNav>
              <AdminCourse/>
            </DefaultLayoutAdminNav>
          }
        />
        <Route
          path="/admin/payment-method"
          element={
            <DefaultLayoutAdminNav>
              <AdminPaymentMethod/>
            </DefaultLayoutAdminNav>
          }
        />
        <Route
          path="/admin/invoice"
          element={
            <DefaultLayoutAdminNav>
              <AdminInvoice/>
            </DefaultLayoutAdminNav>
          }
        />
        <Route
          path="/admin/user"
          element={
            <DefaultLayoutAdminNav>
              <AdminUser/>
            </DefaultLayoutAdminNav>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
//test
export default App;

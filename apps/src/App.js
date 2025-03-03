import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginScreen from "./screens/loginScreen";
import HomeScreen from "./screens/homeScreen";
import FoodScreen from "./screens/foodScreen";
import DrinkScreen from "./screens/drinkScreen";
import HistoryScreen from "./screens/historyScreen";
import ReceiptScreen from "./screens/receiptScreen";
import AdminHomeScreen from "./screens/adminHomeScreen";
import AdminIncomeScreen from "./screens/adminIncomeScreen";
import AdminMenuManagerScreen from "./screens/adminMenuManager";
import AdminRestaurantScreen from "./screens/adminRestaurantScreen";
import SuccessPaymentScreen from "./screens/successPaymentScreen.js";
import CancelPaymentScreen from "./screens/cancelPaymentScreen.js";
import AdminUserScreen from "./screens/adminUserScreen.js";
import ForgotPasswordScreen from "./screens/forgotPasswordScreen.js";
import { ListProvider } from "./components/ListContext";
import ResetPasswordScreen from "./screens/resetPasswordScreen.js";
const App = () => {
	return (
		<BrowserRouter>
			<ListProvider>
				<Routes>
					<Route path="/" element={<HomeScreen />} />
					<Route path="/home" element={<HomeScreen />} />
					<Route path="/login" element={<LoginScreen />} />
					<Route path="/food" element={<FoodScreen />} />
					<Route path="/drink" element={<DrinkScreen />} />
					<Route path="/history" element={<HistoryScreen />} />
					<Route path="/receipt" element={<ReceiptScreen />} />
					<Route path="/admin" element={<AdminHomeScreen />} />
					<Route path="/income" element={<AdminIncomeScreen />} />
					<Route path="/user" element={<AdminUserScreen />} />
					<Route
						path="/menuManager"
						element={<AdminMenuManagerScreen />}
					/>
					<Route
						path="/restaurant"
						element={<AdminRestaurantScreen />}
					/>
					<Route path="/success" element={<SuccessPaymentScreen />} />
					<Route path="/cancel" element={<CancelPaymentScreen />} />
					<Route
						path="/forgot-password"
						element={<ForgotPasswordScreen />}
					/>
					<Route
						path="/reset-password"
						element={<ResetPasswordScreen />}
					/>
				</Routes>
			</ListProvider>
		</BrowserRouter>
	);
};

export default App;

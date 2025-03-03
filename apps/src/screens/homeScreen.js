import React, { useState, useEffect } from "react";
import "./../styles/screens/homeScreen.css";
import Header from "./../components/header";
import { useNavigate } from "react-router-dom";
import HomeBanner from "../components/homeBanner";
import Category from "../components/category";
import SpecialDishes from "../components/specialDishes";
import Service from "../components/service";
import Footer from "../components/footer";

const HomeScreen = () => {
	const navigate = useNavigate();
	const [loadingLogin, setLoadingLogin] = useState(true); // True if user is logged in

	const isAccessTokenExpired = (token) => {
		const currentTime = Math.floor(Date.now() / 1000);
		const decode = JSON.parse(atob(token.split(".")[1]));
		return decode.exp < currentTime;
	}

	const refreshAccessToken = async () => {
		try {
			const refreshToken = localStorage.getItem("refreshToken");
			// console.log(refreshToken);
			if (!refreshToken){
				throw new Error("No refresh token found");
			}

			const response = await fetch(`http://localhost:8080/auth/refresh-token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refreshToken }),
			})

			const res = await response.json();
			if (res.status !== "Success") {
				throw new Error("Failed to refresh access token");
			} else {
				localStorage.setItem("accessToken", res.data.accessToken);
				localStorage.setItem("refreshToken", res.data.refreshToken);
			}
		} catch (e) {
			console.error(e);
		}
	}

	useEffect(() => {
		// Refresh access token if it is expired
		const refreshAccessToken = async () => {
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                // console.log(refreshToken);
                if (!refreshToken) {
                    throw new Error("No refresh token found");
                }

                const response = await fetch(
                    `http://localhost:8080/auth/refresh-token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refreshToken }),
                    }
                );

                const res = await response.json();
                if (res.status !== "Success") {
                    throw new Error("Failed to refresh access token");
                } else {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                }
            } catch (e) {
                console.error(e);
            }
        };


		const token = localStorage.getItem("accessToken");
		// Refresh access token if it is expired
		if (token && isAccessTokenExpired(token)){
			refreshAccessToken();
		}
		// Redirect to login if token is null
		if (token === null) {
			// console.log("token is null");
			navigate("/login");
		} else {
			setLoadingLogin(false);
		}
	}, []);
	if (loadingLogin) {
		return <div></div>;
	}
	return (
		<div className="home-screen">
			<Header />
			{/* Nội dung khác của HomeScreen */}
			<HomeBanner />
			<Category />
			<SpecialDishes />
			<Service />
			<Footer />
		</div>
	);
};

export default HomeScreen;

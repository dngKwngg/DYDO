import React, { useEffect, useState } from "react";
import "./../styles/components/category.css";
const Category = () => {
	const [foodMenu, setFoodMenu] = useState([]);
	const [drinks, setDrinks] = useState([]);
	useEffect(() => {
		const getFoodMenu = async () => {
			try {
				const token = localStorage.getItem("accessToken");
				console.log(token);
				const response = await fetch(
					"http://localhost:8080/menu/listFood",
					{
						headers: {
							"Content-Type": "application/json",
							Authorization:
								"Bearer " + localStorage.getItem("accessToken"),
						},
					}
				);
				const data = await response.json();
				setFoodMenu(data.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		const getDrink = async () => {
			try {
				const response = await fetch(
					"http://localhost:8080/menu/listDrink",
					{
						headers: {
							"Content-Type": "application/json",
							Authorization:
								"Bearer " + localStorage.getItem("accessToken"),
						},
					}
				);
				const data = await response.json();
				setDrinks(data.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		getFoodMenu();
		getDrink();
	}, []);
	const lauFoods = foodMenu.filter((food) => food.type === "Lẩu Thái Tomyum");
	const nuongFoods = foodMenu.filter(
		(food) => food.type === "Đồ nướng than hoa"
	);

	return (
		<div className="home-category">
			<div className="home-category-title">
				<p>Danh mục</p>
			</div>
			<div className="home-category-content">
				<div className="home-category-card">
					<div className="card-image">
						<img
							src={`${process.env.PUBLIC_URL}/images/bo-nuong.png`}
						></img>
					</div>
					<p>Bò nướng than hoa</p>
					<p>({nuongFoods.length} món)</p>
				</div>
				<div className="home-category-card">
					<div className="card-image">
						<img
							src={`${process.env.PUBLIC_URL}/images/lau-thai.png`}
						></img>
					</div>
					<p>Lẩu thái Tomyum</p>
					<p>({lauFoods.length} món)</p>
				</div>
				<div className="home-category-card">
					<div className="card-image">
						<img
							src={`${process.env.PUBLIC_URL}/images/nuoc.png`}
						></img>
					</div>
					<p>Nước giải khát</p>
					<p>({drinks.length} món)</p>
				</div>
			</div>
		</div>
	);
};
export default Category;

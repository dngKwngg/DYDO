import React, { useEffect, useState } from "react";
import "./../styles/components/footer.css";
const Footer = () => {
	const [centre, setCentre] = useState({});
	useEffect(() => {
		const user = localStorage.getItem("user");
		console.log(user);
		let staff = JSON.parse(user);
		const centre_id = staff.centre_id;

		const getCentre = async () => {
			try {
				const response = await fetch(
					"http://localhost:8080/restaurant/getAllRestaurant",
					{
						headers: {
							"Content-Type": "application/json",
							Authorization:
								"Bearer " + localStorage.getItem("accessToken"),
						},
					}
				);
				const data = await response.json();
				let centre = data.data.filter((item) => {
					return item.centre_id === centre_id;
				})[0];
				setCentre(centre);
			} catch (error) {
				console.log("error", error);
			}
		};
		getCentre();
	}, []);
	return (
		<div className="footer">
			<div className="footer-logo">
				<img src={`${process.env.PUBLIC_URL}/images/dydo.png`}></img>
			</div>
			<div className="footer-menu">
				<p>Bò nướng than hoa</p>
				<p>Lẩu thái Tomyum</p>
				<p>Nước giải khát</p>
			</div>
			<div className="footer-information">
				<p>Hotline</p>
				<span>{centre.hotline}</span>
				<p>Email</p>
				<span>{centre.email}</span>
			</div>
			<div className="footer-copyright">
				<p>© 2024 DyDo Restaurant</p>
			</div>
		</div>
	);
};
export default Footer;

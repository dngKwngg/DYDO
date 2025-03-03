import prisma from "../shared/prisma.js";

// async function queryDatabase(query, params) {
// 	return new Promise((resolve, reject) => {
// 		connection.query(query, params, (err, result, fields) => {
// 			if (err) reject(err);
// 			resolve(result);
// 		});
// 	});
// }

async function updateParam(key, value, item_id) {
	// const result = await queryDatabase(`SELECT * FROM menu WHERE item_id = ?`, [
	// 	item_id,
	// ]);
	const result = await prisma.menu.findMany({
		where: {item_id}
	})
	if (result.length === 0) {
		return res.status(404).json({
			status: "Failed",
			message: "No menu item found",
		});
	}
	// await queryDatabase(`UPDATE menu SET ${key} = ? WHERE item_id = ?`, [
	// 	value,
	// 	item_id,
	// ]);
	await prisma.menu.update({
		where: {item_id},
		data: {
			[key]: value
		}
	})
}
// {
// "item_id" : 1,
// "price" : 15000
//	"item_name": "Revive"
//	"type": "Đồ uống"
// }
// chỉnh sửa món ăn
//http://localhost:8080/menu/updatePrice
const updateInfoMenu = async (req, res) => {
	const { item_id, price, item_name, type, src } = req.body;
	if (price !== undefined) {
		//Kiểm tra item_id có phải là số nguyên lớn hơn 0 hay không
		if (!Number.isInteger(item_id) || item_id <= 0) {
			return res.status(400).json({
				status: "Failed",
				message: "Item ID must be an integer greater than 0",
			});
		}
		//Kiểm tra price có phải là số thực hay không
		if (isNaN(price) || price <= 0) {
            return res.status(400).json({
                status: "Failed",
                message: "Price must be a positive number",
            });
        }

		try {
			await updateParam("price", price, item_id);
			if (item_name !== undefined) {
				await updateParam("item_name", item_name, item_id);
			}
			if (type !== undefined) {
				await updateParam("type", type, item_id);
			}
			if(src !== undefined){
				await updateParam("src", src, item_id);
			}
			return res.status(200).json({
				status: "Success",
				message: "Done update",
			});
		} catch (err) {
			return res.status(500).json({
				status: "Failed",
				error: err,
			});
		}
	}
	
	
};

// {
// "type" : "Đồ uống",
// "item_name": "Apple meo meo",
// "price": "50000"
// }
// Thêm một món ăn vào menu
//http://localhost:8080/menu/addMenuItem

const addMenuItem = async (req, res) => {
	const { type, item_name, price, src } = req.body;
	//Kiểm tra type có phải là chuỗi hay không
	if (typeof type !== "string") {
		return res.status(400).json({
			status: "Failed",
			message: "Type must be a string",
		});
	}
	//Kiểm tra item_name có phải là chuỗi hay không
	if (typeof item_name !== "string") {
		return res.status(400).json({
			status: "Failed",
			message: "Item name must be a string",
		});
	}
	//Kiểm tra price có phải là số thực hay không
	if (isNaN(price) || price <= 0) {
        return res.status(400).json({
            status: "Failed",
            message: "Price must be a positive number",
        });
    }
	try {
		await prisma.menu.create({
			data: {
				type,
				item_name,
				price,
				src
			}
		})
		return res.status(200).json({
			status: "Success",
			message: "Done add",
		});
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err,
		});
	}
};

// {
//     "item_id": 15
// }
//Xóa món ăn khỏi menu
// http://localhost:8080/menu/deleteMenuItem
const deleteMenuItem = async (req, res) => {
	const { item_id } = req.body;
	//Kiểm tra item_id có phải là số nguyên lớn hơn 0 hay không
	if (!Number.isInteger(item_id) || item_id <= 0) {
		return RegExp.status(400).json({
			status: "Failed",
			message: "Item ID must be an integer greater than 0",
		});
	}
	try {
		//Kiểm tra item_id có tồn tại hay không
		const result = await prisma.menu.findUnique({
			where: {item_id}
		})
		//Kiểm tra nếu không tìm thấy bản ghi phù hợp
		if (!result) {
			return res.status(404).json({
				status: "Failed",
				message: "No menu item found",
			});
		}
		await prisma.menu.update({
			where: {item_id},
			data: {
				active: false
			}
		})
		return res.status(200).json({
			status: "Success",
			message: "Done delete",
		});
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err.message,
		});
	}
};

// lấy danh sách món ăn
//http://localhost:8080/menu/listFood
const listFood = async (req, res) => {
	try {
		const result = await prisma.menu.findMany({
			where: {
				type: {not: "Đồ uống"},
				active: true
			}
		})
		return res.status(200).json({
			status: "Success",
			data: result,
		});
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err,
		});
	}
};

// lấy danh sách đồ uống
//http://localhost:8080/menu/listDrink
const listDrink = async (req, res) => {
	try {
		const result = await prisma.menu.findMany({
			where: {
				type: "Đồ uống",
				active: true
			}
		})
		return res.status(200).json({
			status: "Success",
			data: result,
		});
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err,
		});
	}
};

// lấy danh sách món ăn theo item_id
//http://localhost:8080/menu/listFoodById
const listFoodById = async (req, res) => {
	const { list_item } = req.body;

	// Tạo danh sách ID từ list_item
	const list_id = list_item.map((item) => item.item_id).reverse();
	// console.log(list_id);
	//đảo ngược mảng list_item
	// const list_id_reverse = list_id.reverse();

	// Chuyển danh sách ID thành chuỗi để sử dụng trong câu lệnh SQL
	// const listIdString = list_id_reverse.join(",");

	try {
		// Thực hiện truy vấn và sắp xếp theo thứ tự danh sách ID
		// const query = `
        //     SELECT * 
        //     FROM menu 
        //     WHERE item_id IN (${listIdString}) and active = 1
        //     ORDER BY FIELD(item_id, ${listIdString})
        // `;

		// // Thực thi câu lệnh SQL
		// const result = await queryDatabase(query);
		const result = await prisma.menu.findMany({
			where: {
				item_id: {
					in: list_id
				},
				active: true
			},
			orderBy: {
				item_id: {
					in: list_id
				}
			}
		})

		return res.status(200).json({
			status: "Success",
			// add property quantity to data: result
			data: result,
		});
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err,
		});
	}
};

// lấy danh sách món ăn
//http://localhost:8080/menu/listMenu
const listMenu = async (req, res) => {
	try {
		const result = await prisma.menu.findMany({
			where: {
				active: true
			}
		})
		return res.status(200).json({
			status: "Success",
			data: result,
		});
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err,
		});
	}
};
// http://localhost:8080/menu/highlightMenu
const getHighlightMenu = async (req, res) => {
	try {
		const result = await prisma.menu.findMany({
			where: {
				item_id: {
					in: [8, 11, 14, 24, 25, 26]
				}
			},
			select: {
				item_name: true,
				price: true,
				src: true
			}
		})
		return res.status(200).json({
			status: "Success",
			data: result,
		});
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err,
		});
	}
}

export default {
	updateInfoMenu,
	addMenuItem,
	deleteMenuItem,
	listFood,
	listDrink,
	listFoodById,
	listMenu,
	getHighlightMenu
}
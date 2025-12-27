import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart2, PlusSquare, Box, TrendingUp, Settings, LogOut, Home } from 'lucide-react'
import { IoCloudUploadOutline } from "react-icons/io5";
import { logo } from '../../assets/index'






	const Sidebar = () => {
		const menu = [
		{ id: 1, icon: Home, label: 'Dashboard', to: '/dashboard' },
		{ id: 2, icon: PlusSquare, label: 'Add Product', to: '/addproduct' },
		{ id: 3, icon: Box, label: 'Product', to: '/product' },
		{ id: 4, icon: TrendingUp, label: 'Analytics', to: '/analytics' },
	]

	return (
		<aside className="w-full bg-white rounded-lg shadow-sm">
			<div className="flex items-center gap-4 p-5">
				<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200">
					<img src={logo} alt="CasaLux" className="w-full h-full object-cover" />
				</div>
				<div>
					<p className="font-medium">CasaLux</p>
					<p className="text-sm text-gray-400">Company</p>
				</div>
			</div>

			<nav className="mt-6 flex flex-col gap-2 px-2">
				{menu.map(item => {
					const Icon = item.icon
					return (
						<NavLink
							key={item.id}
							to={item.to}
							className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white bg-gradient-to-r from-[#46B6BD] to-[#205457] shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
						>
							<Icon className="h-4 w-4 flex-shrink-0" />
							<span>{item.label}</span>
						</NavLink>
					)
				})}
			</nav>

			<div className="mt-6 border-t p-6">
				<NavLink to="/analytics/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
					<Settings className="h-4 w-4" />
					<span>Settings</span>
				</NavLink>

				<button className="w-full mt-3 flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200">
					<LogOut className="h-4 w-4" />
					<span>Log out</span>
				</button>
			</div>
		</aside>
	)
}

const Profile = () => {
	const [name, setName] = useState('')
	const [category, setCategory] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [color, setColor] = useState('')
	const [images, setImages] = useState([])

	const handleImageChange = (e) => setImages(Array.from(e.target.files))
	const handleSave = (e) => { e.preventDefault(); console.log({ name, category, description, price, color, images }); alert('Saved (check console)') }

	return (
		<div className="min-h-screen bg-[#f6f6f6]">
			<div className="w-full lg:w-[85%] mx-auto py-8 mt-28 lg:mt-32">
				

				<div className="bg-[#f6f6f6] text-black rounded-md shadow-sm">
				<div className="grid grid-cols-12 gap-8 p-6">
					<div className="col-span-12 lg:col-span-3">
						<Sidebar />
					</div>
					<main className="col-span-12 lg:col-span-9">
						<h2 className="w-[925px] h-10 ps-2 bg-white text-2xl font-semibold mb-4 text-black">Add Products</h2>

						<form onSubmit={handleSave} className="space-y-4">
							<div className="flex flex-col sm:flex-row gap-4">
								<input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter the Product Name ..."
									className="flex-1 rounded-lg px-4 py-3 bg-white  placeholder-gray-400"
								/>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="w-80 rounded-lg px-4 py-3 bg-white  text-black text-gray-400"
								>
									<option value="" >Select the category of the added item</option>
									<option>1</option>
									<option>2</option>
									<option>3</option>
								</select>
							</div>

							<div className="border border-white rounded p-6 bg-white">
								<label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded cursor-pointer bg-white">
									<input type="file" multiple onChange={handleImageChange} className="hidden" />
									<div className="text-center text-black">
										<div className="mb-2 flex justify-between"> <IoCloudUploadOutline className="h-5 w-5" /> Click here to upload images</div>
										<div className="text-xs">{images.length > 0 ? images.map((f)=>f.name).join(', ') : ''}</div>
									</div>
								</label>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Product Description"
									className="rounded-lg p-3 h-15 bg-white border border-gray-200 text-black w-full"
								/>

								<input
									type="number"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder="Product Price"
									className="rounded-lg p-3 h-15 bg-white border border-gray-200 text-black w-full"
								/>

								<input
									value={color}
									onChange={(e) => setColor(e.target.value)}
									placeholder="Product Color"
									className="rounded-lg p-3 h-15 bg-white border border-gray-200 text-black w-full"
								/>
							</div>

							<div className="flex justify-end mt-4">
								<button type="submit" className="bg-[#205457] text-white px-6 py-3 rounded-2xl">Save</button>
							</div>
						</form>
					</main>
				</div>
				</div>

				<div className="mt-6 border-t border-gray-200"></div>
				<div className="h-12"></div>
			</div>
		</div>
	)
}

export default Profile

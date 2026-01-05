import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	PlusCircle,
	Upload,
	ArrowLeft,
	Info,
	Image as ImageIcon,
	Tag,
	Type,
	DollarSign,
	Palette,
	Check,
	X,
	ChevronDown,
	Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const AddProduct = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [subCategoryId, setSubCategoryId] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [discount, setDiscount] = useState('0');
	const [deliveryTime, setDeliveryTime] = useState('0');
	const [rating, setRating] = useState('0');
	const [currentColor, setCurrentColor] = useState('');
	const [colors, setColors] = useState([]);
	const [images, setImages] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);

	const [categories, setCategories] = useState([]);
	const [subCategories, setSubCategories] = useState([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [storeId, setStoreId] = useState(null);
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);
	const [showErrorPopup, setShowErrorPopup] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [errorType, setErrorType] = useState('error'); // 'error' or 'session-expired'

	// Fetch Categories and Store on Mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const userEmail = localStorage.getItem('userEmail');

				const [catRes, storeRes] = await Promise.all([
					api.get('/Category'),
					api.get('/Store')
				]);

				setCategories(catRes.data);

				const stores = Array.isArray(storeRes.data) ? storeRes.data : [storeRes.data];
				const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());

				if (myStore) {
					const sid = myStore.storeId || myStore.id;
					setStoreId(sid);
					localStorage.setItem('storeId', sid.toString());
				} else {
					console.warn("No store found for this email. Redirecting...");
					navigate('/create-store');
				}
			} catch (err) {
				console.error("Failed to fetch initial data", err);
			} finally {
				setLoadingCategories(false);
			}
		};
		fetchData();
	}, [navigate]);

	// Fetch SubCategories when category changes using requested endpoint
	useEffect(() => {
		if (!category) {
			setSubCategories([]);
			setSubCategoryId('');
			return;
		}

		const fetchSubCategories = async () => {
			try {
				const res = await api.get(`/SubCategory/by-category/${category}`);
				setSubCategories(res.data);
			} catch (err) {
				console.error("Failed to fetch subcategories", err);
				setSubCategories([]);
			}
		};

		fetchSubCategories();
		setSubCategoryId(''); // Reset subcategory selection when category changes
	}, [category]);

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		if (files.length + images.length > 5) {
			alert("Maximum 5 images allowed");
			return;
		}

		const newImages = [...images, ...files];
		setImages(newImages);

		// Create previews
		const newPreviews = files.map(file => URL.createObjectURL(file));
		setImagePreviews([...imagePreviews, ...newPreviews]);
	};

	const removeImage = (index) => {
		const updatedImages = images.filter((_, i) => i !== index);
		const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
		setImages(updatedImages);
		setImagePreviews(updatedPreviews);
	};

	const addColor = (e) => {
		if (e.key === 'Enter' && currentColor.trim()) {
			e.preventDefault();
			if (!colors.includes(currentColor.trim())) {
				setColors([...colors, currentColor.trim()]);
			}
			setCurrentColor('');
		}
	};

	const removeColor = (colorToRemove) => {
		setColors(colors.filter(c => c !== colorToRemove));
	};

	const [errors, setErrors] = useState({});

	const resetForm = () => {
		setName('');
		setCategory('');
		setSubCategoryId('');
		setDescription('');
		setPrice('');
		setStock('');
		setDiscount('0');
		setDeliveryTime('0');
		setRating('0');
		setCurrentColor('');
		setColors([]);
		setImages([]);
		setImagePreviews([]);
		setErrors({});
	};

	const fileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleSave = async (e) => {
		e.preventDefault();

		// Custom Validation
		const newErrors = {};
		if (images.length === 0) newErrors.images = "At least one product image is required";
		if (colors.length === 0) newErrors.colors = "At least one color variation is required";
		if (!category) newErrors.category = "Category is required";
		if (!subCategoryId) newErrors.subCategoryId = "Subcategory is required";
		if (parseFloat(price) <= 0) newErrors.price = "Price must be greater than zero";
		if (parseInt(stock) < 0) newErrors.stock = "Quantity cannot be negative";
		if (parseFloat(rating) < 0 || parseFloat(rating) > 5) newErrors.rating = "Rating must be between 0 and 5";
		if (!storeId) newErrors.general = "Store session expired. Please refresh the page.";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}

		setErrors({});
		setIsSaving(true);

		try {
			// STEP 1: Create Product
			const productPayload = {
				name: name,
				description: description,
				colors: colors,
				price: parseFloat(price),
				rating: Math.round(parseFloat(rating)) || 0,
				quantity: parseInt(stock),
				discount: parseFloat(discount) || 0,
				deliveryTime: parseInt(deliveryTime) || 0,
				subCategoryId: parseInt(subCategoryId),
				categoryId: parseInt(category),
				storeId: parseInt(storeId)
			};

			console.log("🚀 Publishing Product...", productPayload);
			const productRes = await api.post('Product/Create', productPayload);
			console.log("✅ Product Created:", productRes.data);

			// Extract ID
			let finalId = null;
			if (typeof productRes.data === 'number') {
				finalId = productRes.data;
			} else if (productRes.data && typeof productRes.data === 'object') {
				finalId = productRes.data.productId || productRes.data.id || productRes.data.data?.id;
			}

			if (!finalId) {
				console.error("Could not determine Product ID", productRes.data);
				// Try to parse from response if it returned the full object including productId
				// Some APIs return the created object.
			}

			// STEP 2: Upload Images
			if (finalId && images.length > 0) {
				console.log(`🚀 Uploading ${images.length} images for Product ${finalId}...`);
				const formData = new FormData();
				formData.append('ProductId', finalId);
				images.forEach((file) => {
					formData.append('Images', file);
				});

				await api.post('ProductImages/upload', formData, {
					headers: { 'Content-Type': 'multipart/form-data' }
				});
				console.log("✅ Images Uploaded Successfully");
			}

			resetForm();
			setShowSuccessPopup(true);
		} catch (err) {
			console.error("❌ Product Creation Failed:", err);
			const errorData = err.response?.data;
			let errorMsg = err.message || "Failed to publish product.";

			if (err.response?.status === 401) {
				errorMsg = "Your session has expired. Please log in again.";
				setErrorType('session-expired');
			} else if (errorData) {
				if (typeof errorData === 'string') errorMsg = errorData;
				else if (errorData.message) errorMsg = errorData.message;
				else if (errorData.errors) errorMsg = Object.values(errorData.errors).flat().join(", ");
			}

			setErrorMessage(errorMsg);
			setShowErrorPopup(true);
		} finally {
			setIsSaving(false);
		}
	};

	const fadeInUp = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
		}
	};

	return (
		<div className="min-h-screen bg-[#FDFCFB] pt-[90px] lg:pt-[110px] px-6 lg:px-12 pb-24 font-outfit">
			<motion.div
				className="max-w-[1600px] mx-auto"
				initial="hidden"
				animate="visible"
				variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
			>
				{/* Header */}
				<motion.div variants={fadeInUp} className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
					<div>
						<button
							onClick={() => navigate('/seller-home')}
							className="flex items-center gap-2 text-gray-400 hover:text-[#205457] transition-colors mb-4 group text-sm font-medium"
						>
							<ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
							Back to Dashboard
						</button>
						<h1 className="text-5xl font-bold text-gray-900 tracking-tight">
							New <span className="text-[#205457]">Product</span>
						</h1>
						<p className="text-gray-400 mt-2 font-light">Create a professional showroom entry for your furniture.</p>
					</div>

					<div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-gray-100 shadow-sm">
						<button
							type="button"
							onClick={resetForm}
							className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-900 transition-all text-xs uppercase tracking-[0.2em]"
						>
							Discard
						</button>
						<button
							type="submit"
							form="product-form"
							disabled={isSaving}
							className="bg-[#205457] text-white px-10 py-5 rounded-[22px] font-bold flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-[#205457]/30 transition-all active:scale-95 disabled:opacity-50 text-sm shadow-xl"
						>
							{isSaving ? 'Publishing...' : 'Publish to Store'}
							{!isSaving && <Check size={18} />}
						</button>
					</div>
				</motion.div>

				<form id="product-form" onSubmit={handleSave}>
					<div className="grid grid-cols-1 gap-8">

						{/* SECTION 1: VISUALS (Full Width) */}
						<motion.div variants={fadeInUp} className={`bg-white p-8 rounded-[40px] shadow-sm border ${errors.images ? 'border-red-200' : 'border-gray-100'}`}>
							<div className="flex items-center gap-4 mb-8">
								<div className={`w-12 h-12 rounded-2xl ${errors.images ? 'bg-red-50 text-red-500' : 'bg-[#205457]/10 text-[#205457]'} flex items-center justify-center`}>
									<ImageIcon size={24} />
								</div>
								<div>
									<h3 className="text-xl font-bold text-gray-900">Showcase Gallery <span className="text-red-500">*</span></h3>
									<p className="text-gray-400 text-sm">Upload high-quality images to make your product stand out (Max 5).</p>
								</div>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
								<AnimatePresence>
									{imagePreviews.map((preview, index) => (
										<motion.div
											key={preview}
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											className="relative aspect-square rounded-2xl overflow-hidden shadow-md group border-2 border-transparent hover:border-[#205457]"
										>
											<img src={preview} className="w-full h-full object-cover" alt="Preview" />
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
											>
												<X size={16} />
											</button>
										</motion.div>
									))}
								</AnimatePresence>

								{images.length < 5 && (
									<label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#205457] hover:bg-[#205457]/5 transition-all gap-2 group">
										<input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
										<Upload size={24} className="text-gray-400 group-hover:text-[#205457] transition-colors" />
										<span className="text-[10px] font-bold text-gray-400 group-hover:text-[#205457] uppercase tracking-wider">Add Image</span>
									</label>
								)}
							</div>
							{errors.images && <p className="text-red-500 text-xs font-bold mt-4">{errors.images}</p>}
						</motion.div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

							{/* LEFT COLUMN: Identity & Organization */}
							<div className="space-y-8">
								<motion.div variants={fadeInUp} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
									<div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-6">
										<div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
											<Type size={20} />
										</div>
										<h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
									</div>

									<div className="space-y-6">
										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name <span className="text-red-500">*</span></label>
											<input
												required
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="e.g. Minimalist Sofa"
												className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl px-5 py-4 font-bold text-gray-900 outline-none transition-all"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description <span className="text-red-500">*</span></label>
											<textarea
												required
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												placeholder="Tell the story of your product..."
												rows={6}
												className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl px-5 py-4 text-gray-700 outline-none transition-all resize-none leading-relaxed"
											/>
										</div>
									</div>
								</motion.div>

								<motion.div variants={fadeInUp} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
									<div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-6">
										<div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
											<Tag size={20} />
										</div>
										<h3 className="text-lg font-bold text-gray-900">Organization</h3>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
											<div className="relative">
												<select
													required
													value={category}
													onChange={(e) => setCategory(e.target.value)}
													className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl px-5 py-4 font-bold text-gray-900 outline-none appearance-none cursor-pointer"
												>
													<option value="">Select...</option>
													{categories.map(cat => (
														<option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
													))}
												</select>
												<ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
											</div>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subcategory <span className="text-red-500">*</span></label>
											<div className="relative">
												<select
													required
													disabled={!category}
													value={subCategoryId}
													onChange={(e) => setSubCategoryId(e.target.value)}
													className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl px-5 py-4 font-bold text-gray-900 outline-none appearance-none cursor-pointer disabled:opacity-50"
												>
													<option value="">{category ? 'Select...' : 'Waiting for Category'}</option>
													{subCategories.map(sub => (
														<option key={sub.subCategoryId} value={sub.subCategoryId}>{sub.name}</option>
													))}
												</select>
												<ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
											</div>
										</div>
									</div>
								</motion.div>
							</div>

							{/* RIGHT COLUMN: Settings & Specs */}
							<div className="space-y-8">
								<motion.div variants={fadeInUp} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
									<div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-6">
										<div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
											<DollarSign size={20} />
										</div>
										<h3 className="text-lg font-bold text-gray-900">Pricing & Inventory</h3>
									</div>

									<div className="grid grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price <span className="text-red-500">*</span></label>
											<div className="relative">
												<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
												<input
													required
													type="number"
													value={price}
													onChange={(e) => setPrice(e.target.value)}
													placeholder="0.00"
													className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl pl-8 pr-4 py-4 font-black text-gray-900 outline-none transition-all"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discount %</label>
											<input
												type="number"
												min="0"
												max="100"
												value={discount}
												onChange={(e) => setDiscount(e.target.value)}
												placeholder="0"
												className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl px-5 py-4 font-bold text-gray-900 outline-none transition-all"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stock <span className="text-red-500">*</span></label>
											<input
												required
												type="number"
												value={stock}
												onChange={(e) => setStock(e.target.value)}
												placeholder="0"
												className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl px-5 py-4 font-bold text-gray-900 outline-none transition-all"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery (Days)</label>
											<input
												type="number"
												value={deliveryTime}
												onChange={(e) => setDeliveryTime(e.target.value)}
												placeholder="0"
												className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-2xl px-5 py-4 font-bold text-gray-900 outline-none transition-all"
											/>
										</div>
									</div>
								</motion.div>

								<motion.div variants={fadeInUp} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
									<div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-6">
										<div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
											<Palette size={20} />
										</div>
										<h3 className="text-lg font-bold text-gray-900">Attributes</h3>
									</div>

									<div className="space-y-6">
										<div className="space-y-3">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Colors <span className="text-red-500">*</span></label>
											<div className="flex flex-wrap gap-2">
												<AnimatePresence>
													{colors.map(c => (
														<motion.span
															key={c}
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															exit={{ opacity: 0, scale: 0.8 }}
															className="px-3 py-1 bg-[#205457] text-white rounded-lg text-xs font-bold flex items-center gap-2"
														>
															{c}
															<X size={12} className="cursor-pointer opacity-70 hover:opacity-100" onClick={() => removeColor(c)} />
														</motion.span>
													))}
												</AnimatePresence>
											</div>
											<div className="flex gap-2">
												<div className="relative flex-1">
													<input
														value={currentColor}
														onChange={(e) => setCurrentColor(e.target.value)}
														onKeyDown={addColor}
														placeholder="#000000"
														className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#205457]/30 rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all"
													/>
													<input
														type="color"
														value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#000000'}
														onChange={(e) => setCurrentColor(e.target.value)}
														className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
													/>
												</div>
												<button
													type="button"
													onClick={(e) => {
														const event = { key: 'Enter', preventDefault: () => { } };
														addColor(event);
													}}
													className="bg-[#205457] text-white p-3 rounded-xl hover:bg-[#1a4345] transition-colors"
												>
													<PlusCircle size={20} />
												</button>
											</div>
										</div>

										<div className="space-y-3">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Initial Rating</label>
											<div className="flex items-center gap-4">
												<div className="flex text-yellow-400">
													<Star size={20} className={parseInt(rating) >= 1 ? "fill-current" : "text-gray-200"} onClick={() => setRating('1')} />
													<Star size={20} className={parseInt(rating) >= 2 ? "fill-current" : "text-gray-200"} onClick={() => setRating('2')} />
													<Star size={20} className={parseInt(rating) >= 3 ? "fill-current" : "text-gray-200"} onClick={() => setRating('3')} />
													<Star size={20} className={parseInt(rating) >= 4 ? "fill-current" : "text-gray-200"} onClick={() => setRating('4')} />
													<Star size={20} className={parseInt(rating) >= 5 ? "fill-current" : "text-gray-200"} onClick={() => setRating('5')} />
												</div>
												<input
													type="number"
													min="0"
													max="5"
													step="1"
													value={rating}
													onChange={(e) => {
														const v = parseInt(e.target.value);
														if (v >= 0 && v <= 5) setRating(e.target.value);
													}}
													className="w-16 bg-gray-50 rounded-xl px-2 py-1 text-center font-bold text-gray-900 border-none outline-none"
												/>
											</div>
										</div>
									</div>
								</motion.div>
							</div>
						</div>
					</div>
				</form>
			</motion.div>

			{/* Success Popup */}
			<AnimatePresence>
				{showSuccessPopup && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.9, y: 20, opacity: 0 }}
							animate={{ scale: 1, y: 0, opacity: 1 }}
							exit={{ scale: 0.9, y: 20, opacity: 0 }}
							className="bg-white rounded-[40px] p-8 lg:p-12 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
						>
							{/* Background Decoration */}
							<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#205457] via-[#89917D] to-[#B19470]" />

							<div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
								<div className="absolute inset-0 bg-green-200 blur-2xl opacity-20 animate-pulse" />
								<Check size={48} className="text-green-500 relative z-10" />
							</div>

							<h3 className="text-3xl font-bold text-gray-900 mb-4">Product Published!</h3>
							<p className="text-gray-500 mb-10 leading-relaxed font-light">
								Your masterpiece has been successfully added to your store. It's now visible to potential buyers worldwide.
							</p>

							<div className="grid gap-3">
								<button
									onClick={() => navigate('/seller-home')}
									className="w-full bg-[#205457] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95"
								>
									Return to Dashboard
								</button>
								<button
									onClick={() => {
										setShowSuccessPopup(false);
										resetForm();
									}}
									className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
								>
									Add Another Piece
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Error Popup */}
			<AnimatePresence>
				{showErrorPopup && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.9, y: 20, opacity: 0 }}
							animate={{ scale: 1, y: 0, opacity: 1 }}
							exit={{ scale: 0.9, y: 20, opacity: 0 }}
							className="bg-white rounded-[40px] p-8 lg:p-12 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
						>
							{/* Background Decoration */}
							<div className={`absolute top-0 left-0 w-full h-2 ${errorType === 'session-expired' ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500' : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700'}`} />

							<div className={`w-24 h-24 ${errorType === 'session-expired' ? 'bg-orange-50' : 'bg-red-50'} rounded-3xl flex items-center justify-center mx-auto mb-8 relative`}>
								<div className={`absolute inset-0 ${errorType === 'session-expired' ? 'bg-orange-200' : 'bg-red-200'} blur-2xl opacity-20 animate-pulse`} />
								<X size={48} className={`${errorType === 'session-expired' ? 'text-orange-500' : 'text-red-500'} relative z-10`} />
							</div>

							<h3 className="text-3xl font-bold text-gray-900 mb-4">
								{errorType === 'session-expired' ? 'Session Expired' : 'Error Occurred'}
							</h3>
							<p className="text-gray-500 mb-10 leading-relaxed font-light">
								{errorMessage}
							</p>

							{errorType === 'session-expired' ? (
								<div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
									<p className="text-sm text-orange-700 font-medium">
										Redirecting to login in 3 seconds...
									</p>
								</div>
							) : (
								<div className="grid gap-3">
									<button
										onClick={() => setShowErrorPopup(false)}
										className="w-full bg-[#205457] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95"
									>
										Try Again
									</button>
									<button
										onClick={() => navigate('/seller-home')}
										className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
									>
										Return to Dashboard
									</button>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default AddProduct;

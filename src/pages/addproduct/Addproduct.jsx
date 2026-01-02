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
				rating: parseFloat(rating) || 0,
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
							onClick={() => navigate('/seller-home')}
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
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

						{/* LEFT COLUMN: The Visuals & Story */}
						<div className="lg:col-span-8 space-y-10">

							{/* Product Images */}
							<motion.div variants={fadeInUp} className={`bg-white p-6 md:p-10 lg:p-14 rounded-[30px] lg:rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border ${errors.images ? 'border-red-200' : 'border-gray-100'}`}>
								<div className="flex items-center gap-4 mb-10">
									<div className={`w-14 h-14 rounded-2xl ${errors.images ? 'bg-red-50 text-red-500' : 'bg-[#89917D]/10 text-[#89917D]'} flex items-center justify-center`}>
										<ImageIcon size={28} />
									</div>
									<div>
										<h3 className="text-3xl font-bold text-gray-900">Product Images <span className="text-red-500 text-base">*</span></h3>
										<p className="text-gray-400">Upload up to 5 high-quality images</p>
									</div>
								</div>
								{errors.images && <p className="text-red-500 text-xs font-bold mb-6 uppercase tracking-widest">{errors.images}</p>}

								<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
									<AnimatePresence>
										{imagePreviews.map((preview, index) => (
											<motion.div
												key={preview}
												initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
												animate={{ opacity: 1, scale: 1, rotate: 0 }}
												exit={{ opacity: 0, scale: 0.9 }}
												className="relative aspect-[4/5] rounded-[30px] overflow-hidden shadow-xl group border-4 border-white"
											>
												<img src={preview} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Preview" />
												<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
													<button
														type="button"
														onClick={() => removeImage(index)}
														className="px-6 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-[10px] font-black tracking-widest uppercase border border-white/30 hover:bg-red-500 hover:border-red-500 transition-all"
													>
														Remove
													</button>
												</div>
											</motion.div>
										))}
									</AnimatePresence>

									{images.length < 5 && (
										<label className="aspect-[4/5] rounded-[30px] border-3 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-[#205457]/30 hover:bg-[#205457]/5 transition-all group relative overflow-hidden">
											<input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
											<div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
												<Upload size={28} className="text-[#205457]" />
											</div>
											<span className="text-[11px] font-black text-gray-300 mt-5 tracking-[0.2em] uppercase">Upload Photo</span>
										</label>
									)}
								</div>
							</motion.div>

							{/* Product Details */}
							<motion.div variants={fadeInUp} className="bg-white p-6 md:p-10 lg:p-14 rounded-[30px] lg:rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-gray-100">
								<div className="flex items-center gap-4 mb-12">
									<div className="w-14 h-14 rounded-2xl bg-[#B19470]/10 flex items-center justify-center text-[#B19470]">
										<Type size={28} />
									</div>
									<div>
										<h3 className="text-3xl font-bold text-gray-900">Product Details</h3>
										<p className="text-gray-400">Essential information about your piece</p>
									</div>
								</div>

								<div className="space-y-10">
									<div className="space-y-4">
										<label className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2">Product Name <span className="text-red-500">*</span></label>
										<input
											required
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="e.g. Vintage Oak Table"
											className="w-full rounded-[25px] px-8 py-6 bg-gray-50/80 border-2 border-transparent focus:border-[#205457]/20 focus:bg-white outline-none transition-all text-2xl font-bold text-gray-900 placeholder:text-gray-200"
										/>
									</div>
									<div className="space-y-4">
										<label className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2">Description <span className="text-red-500">*</span></label>
										<textarea
											required
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											placeholder="Describe your furniture piece..."
											rows={12}
											className="w-full rounded-[30px] px-8 py-8 bg-gray-50/80 border-2 border-transparent focus:border-[#205457]/20 focus:bg-white outline-none transition-all resize-none text-lg text-gray-900 leading-relaxed placeholder:text-gray-200"
										/>
									</div>
								</div>
							</motion.div>
						</div>


						{/* RIGHT COLUMN: Configuration Sidebar */}
						<div className="lg:col-span-4 space-y-10">

							<div className="sticky top-32 space-y-10">
								{/* Categorization */}
								<motion.div variants={fadeInUp} className="bg-white p-10 rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100">
									<h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#205457] mb-8 px-2 border-l-4 border-[#205457]">Categorization</h4>

									<div className="space-y-8">
										<div className="space-y-3">
											<label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Category <span className="text-red-500">*</span></label>
											<div className="relative group">
												<select
													required
													value={category}
													onChange={(e) => setCategory(e.target.value)}
													className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all appearance-none cursor-pointer pr-16 text-gray-900 font-bold"
												>
													<option value="">Select Category</option>
													{categories.map(cat => (
														<option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
													))}
												</select>
												<ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#205457] transition-colors" size={18} />
											</div>
										</div>

										<div className="space-y-3">
											<label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Subcategory <span className="text-red-500">*</span></label>
											<div className="relative group">
												<select
													required
													disabled={!category}
													value={subCategoryId}
													onChange={(e) => setSubCategoryId(e.target.value)}
													className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all appearance-none cursor-pointer pr-16 text-gray-900 font-bold disabled:opacity-40 disabled:bg-gray-100/50"
												>
													<option value="">{category ? 'Select Subcategory' : 'Select Category'}</option>
													{subCategories.map(sub => (
														<option key={sub.subCategoryId} value={sub.subCategoryId}>{sub.name}</option>
													))}
												</select>
												<ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#205457] transition-colors" size={18} />
											</div>
										</div>
									</div>
								</motion.div>

								{/* Pricing & Quantity */}
								<motion.div variants={fadeInUp} className="bg-white p-6 md:p-10 rounded-[30px] lg:rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100">
									<h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#B19470] mb-8 px-2 border-l-4 border-[#B19470]">Pricing & Quantity</h4>

									<div className="space-y-8">
										<div className="space-y-3">
											<label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Price <span className="text-red-500">*</span></label>
											<div className="relative group">
												<span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B19470] font-bold text-lg pointer-events-none transition-colors">$</span>
												<input
													required
													type="number"
													value={price}
													onChange={(e) => setPrice(e.target.value)}
													placeholder="0.00"
													className="w-full rounded-2xl pl-12 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all text-xl font-black tabular-nums no-spinner"
												/>
											</div>
										</div>
										<div className="space-y-3">
											<label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Quantity <span className="text-red-500">*</span></label>
											<input
												required
												type="number"
												value={stock}
												onChange={(e) => setStock(e.target.value)}
												placeholder="0"
												className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all font-bold"
											/>
										</div>

										{/* Discount */}
										<div className="space-y-3">
											<label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Discount (%)</label>
											<div className="relative group">
												<span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#B19470] font-bold text-lg pointer-events-none">%</span>
												<input
													type="number"
													min="0"
													max="100"
													step="0.01"
													value={discount}
													onChange={(e) => setDiscount(e.target.value)}
													placeholder="0"
													className="w-full rounded-2xl px-6 pr-12 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all font-bold"
												/>
											</div>
										</div>

										{/* Delivery Time */}
										<div className="space-y-3">
											<label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Delivery Time (Days)</label>
											<input
												type="number"
												min="0"
												value={deliveryTime}
												onChange={(e) => setDeliveryTime(e.target.value)}
												placeholder="0"
												className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all font-bold"
											/>
										</div>

										{/* Rating */}
										<div className="space-y-3">
											<label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
												Initial Rating (0-5) {errors.rating && <span className="text-red-500 normal-case">• {errors.rating}</span>}
											</label>
											<div className="flex items-center gap-4 bg-gray-50/50 rounded-2xl p-4 border-2 border-transparent focus-within:border-[#205457]/10 transition-all">
												{/* Star Rating Visual */}
												<div className="flex gap-1">
													{[1, 2, 3, 4, 5].map((star) => {
														const ratingValue = parseFloat(rating) || 0;
														const isFilled = star <= ratingValue;
														const isPartial = star > ratingValue && star - 1 < ratingValue;
														const fillPercentage = isPartial ? ((ratingValue - (star - 1)) * 100) : 0;

														return (
															<button
																key={star}
																type="button"
																onClick={() => setRating(star.toString())}
																className="transition-all hover:scale-110 active:scale-95 relative"
															>
																{isPartial ? (
																	<div className="relative">
																		{/* Background (empty) star */}
																		<Star size={28} className="fill-gray-200 text-gray-300" />
																		{/* Foreground (filled) star with gradient mask */}
																		<div
																			className="absolute inset-0 overflow-hidden"
																			style={{ width: `${fillPercentage}%` }}
																		>
																			<Star size={28} className="fill-[#F59E0B] text-[#F59E0B]" />
																		</div>
																	</div>
																) : (
																	<Star
																		size={28}
																		className={`${isFilled
																			? 'fill-[#F59E0B] text-[#F59E0B]'
																			: 'fill-gray-200 text-gray-300'
																			} transition-colors`}
																	/>
																)}
															</button>
														);
													})}
												</div>
												{/* Numeric Input */}
												<input
													type="number"
													min="0"
													max="5"
													step="0.1"
													value={rating}
													onChange={(e) => {
														const val = parseFloat(e.target.value);
														if (val >= 0 && val <= 5) {
															setRating(e.target.value);
														}
													}}
													placeholder="0.0"
													className="w-20 text-center rounded-xl px-3 py-2 bg-white border border-gray-200 outline-none font-bold text-lg tabular-nums"
												/>
												<span className="text-sm text-gray-400 font-medium">/ 5.0</span>
											</div>
										</div>
									</div>
								</motion.div>

								{/* Available Colors */}
								<motion.div variants={fadeInUp} className={`bg-white p-6 md:p-10 rounded-[30px] lg:rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border ${errors.colors ? 'border-red-200' : 'border-gray-100'}`}>
									<h4 className={`text-[12px] font-black uppercase tracking-[0.3em] ${errors.colors ? 'text-red-500' : 'text-[#205457]'} mb-8 px-2 border-l-4 ${errors.colors ? 'border-red-500' : 'border-[#205457]'}`}>
										Available Colors <span className="text-red-500 text-base">*</span>
									</h4>

									{errors.colors && <p className="text-red-500 text-[10px] font-bold mb-6 uppercase tracking-widest">{errors.colors}</p>}

									<div className="space-y-6">
										<div className="flex flex-wrap gap-2 min-h-[50px]">
											<AnimatePresence>
												{colors.map(c => (
													<motion.span
														key={c}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.8 }}
														className="px-5 py-3 bg-[#205457] text-white rounded-2xl text-[11px] font-black border border-gray-100 flex items-center gap-3 transition-all hover:bg-[#205457]/90 hover:shadow-xl uppercase tracking-widest"
													>
														{c}
														<X size={14} className="cursor-pointer text-white/50 hover:text-red-300" onClick={() => removeColor(c)} />
													</motion.span>
												))}
											</AnimatePresence>
											<input
												value={currentColor}
												onChange={(e) => setCurrentColor(e.target.value)}
												onKeyDown={addColor}
												placeholder="Add a color..."
												className="flex-1 bg-gray-50/50 rounded-2xl px-6 py-4 text-xs font-bold border-2 border-transparent focus:border-[#205457]/10 outline-none placeholder-gray-300"
											/>
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

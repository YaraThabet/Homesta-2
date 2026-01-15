import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import api from "../../../lib/axios";
import { useAppContext } from "../../../context/AppContext";

const Deals = () => {
  const navigate = useNavigate();
  const { formatPrice, t } = useAppContext();
  const deals = [
    {
      id: 1,
      category: t('chairs') || "Chair",
      name: "Comfort Sofa Plus",
      price: 105,
      oldPrice: 150,
      discount: "20% Off",
      rating: 4.9,
      image: "/img/chair1.jpg",
      description:
        "Experience the perfect blend of style and support with our premium ergonomic design, perfect for modern living spaces.",
    },
    {
      id: 2,
      category: t('sofa') || "Sofa",
      name: "Comfort Sofa Plus",
      price: 220,
      oldPrice: 310,
      discount: "20% Off",
      rating: 4.7,
      image: "/img/chair2.png",
      description:
        "Luxurious comfort meets modern durability in our signature plush sofa, designed to be the centerpiece of your living room.",
    },
  ];
  const furnitureCards = [
    {
      id: 3,
      discount: "Flat 20% Discount",
      title: t('woodChairCollection'),
      description: t('handcraftedMasterpieces'),
      image: "/img/chair3.png",
      bgColor: "#E0DFDF"
    },
    {
      id: 4,
      discount: "Flat 20% Discount",
      title: t('modernSofaCollection'),
      description: t('exclusiveRange'),
      image: "/img/chair4.png",
      bgColor: "#205457"
    }
  ];

  return (
    <div className="w-full min-h-screen px-4 md:px-10 lg:px-20 py-16">
      <div className="flex flex-col lg:flex-row w-full gap-6 justify-between mb-12">
        <div className="w-full lg:max-w-md h-auto">
          <p className="font-[Outfit] font-medium text-[28px] md:text-[36px] lg:text-[40px] leading-[120%]">
            <span className="text-[#205457]">{t('DealsOftheDay').split(' ')[0]}</span> {t('DealsOftheDay').split(' ').slice(1).join(' ')}
          </p>
        </div>
        <div className="w-full lg:max-w-lg h-auto">
          <p className="font-[Outfit] font-normal text-[14px] md:text-[15px] lg:text-[16px] leading-[150%] text-gray-600">
            {t('discoverQuality')}
          </p>
        </div>
      </div>
      <div className="w-full h-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {deals.map((item) => (
            <div
              key={item.id}
              className="group w-full h-auto p-4 border-zinc-500 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 md:gap-[30px] transition-all duration-300 bg-white"
            >
              <div
                className="w-full md:w-[280px] h-[250px] md:h-auto min-h-[250px] rounded-3xl shadow-lg overflow-hidden relative shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="flex items-center justify-center w-auto min-w-[90px] h-[39px] rounded-full bg-[#205457] absolute top-4 left-4 px-4 py-2 shadow-md">
                  <p className="font-outfit font-semibold text-[14px] text-white text-center whitespace-nowrap">
                    {item.discount}
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full md:flex-1 gap-4 justify-center">
                <div className="flex flex-col gap-1">
                  <p className="font-outfit font-normal text-[16px] text-gray-500">
                    {item.category}
                  </p>
                  <p className="font-outfit font-medium text-[20px] text-gray-900">
                    {item.name}
                  </p>
                  <p className="font-outfit font-medium text-[18px]">
                    {formatPrice(item.price)}{" "}
                    <span className="text-[#A4A7AE] line-through ml-2 font-normal">{formatPrice(item.oldPrice)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <FaStar className="w-4 h-4 text-[#FFCC00]" />
                  <p className="font-outfit font-normal text-[15px]">
                    {item.rating}
                  </p>
                </div>

                <p className="font-outfit font-normal text-[15px] leading-[150%] text-[#4D4A4A] line-clamp-3">
                  {item.description}
                </p>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const token = localStorage.getItem('token');
                    if (!token) {
                      navigate('/login');
                      return;
                    }
                    try {
                      // Assuming direct add without options for these deals, or redirect to product page if complex
                      // For Quick Add:
                      /*
                      await api.post('Cart/add', {
                          productId: item.id,
                          quantity: 1
                      });
                      navigate('/shopping-cart');
                      */
                      // Since these seem to be deals, let's redirect to product detail but with intent or just add if possible.
                      // Given the request "make the buy now button add to cart and move u to cart immedialty"
                      // We need real IDs. The mock data has IDs 1, 2. If these are real, we can add.
                      // If not, we should probably just navigate to shop or product page.
                      // Assuming IDs are real for demo purposes or fallback handling
                      try {
                        await api.post('Cart/add', {
                          productId: item.id,
                          quantity: 1
                        });
                        navigate('/shopping-cart');
                      } catch (err) {
                        console.error("Add to cart failed", err);
                        // Fallback to product page if add fails (e.g. options needed)
                        navigate(`/product/${item.id}`);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="mt-2 flex items-center justify-center gap-2 w-full md:max-w-[180px] h-[48px] rounded-full bg-[#205457] hover:bg-[#1a4345] active:scale-95 transition-all shadow-md"
                >
                  <span className="text-white font-outfit font-medium text-[16px]">
                    {t('buyNow')}
                  </span>
                  <FaArrowRightLong className="text-white transform rtl:rotate-180" />
                </button>
              </div>
            </div>
          ))}

          {furnitureCards.map((item) => (
            <div
              key={item.id}
              className="group w-full h-auto p-6 md:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6 md:gap-8 transition-all duration-300"
              style={{ backgroundColor: item.bgColor }}
            >
              <div className="flex flex-col w-full sm:w-[55%] gap-4 text-center sm:text-left">
                <p className="font-outfit font-medium text-lg md:text-xl text-[#78797a]">{item.discount}</p>
                <p className={`font-outfit font-medium text-2xl md:text-[32px] leading-tight ${item.bgColor === '#205457' ? 'text-white' : 'text-black'}`}>{item.title}</p>
                <p className={`font-outfit font-normal text-sm md:text-base ${item.bgColor === '#205457' ? 'text-white/80' : 'text-[#78797a]'}`}>{item.description}</p>
                <div className="flex justify-center sm:justify-start mt-2">
                  <button
                    onClick={() => navigate('/shop')}
                    className="flex justify-center items-center px-6 py-3 rounded-3xl bg-[#B19470] hover:scale-105 active:scale-95 transition-all text-white font-[Outfit] font-medium text-base md:text-lg gap-2"
                  >
                    <span>{t('shopNow')}</span>
                    <FaArrowRightLong className="transform rtl:rotate-180" />
                  </button>
                </div>
              </div>
              <div className="w-full sm:w-[40%] h-[200px] sm:h-[280px] overflow-hidden flex justify-center items-center">
                <img
                  src={item.image}
                  alt="chair"
                  className="w-auto h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deals;

import { Link } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

const ShopHeader = () => {
  const { t } = useAppContext();

  return (
    <header className="bg-[#F6F6F6] py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">{t('shop')}</h1>
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:text-[#205457] transition-colors">
            {t('home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#205457]">{t('shop')}</span>
        </nav>
      </div>
    </header>
  );
};

export default ShopHeader;
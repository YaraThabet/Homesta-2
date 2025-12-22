
const FaqsFooter = () => {
  return (
    <div className="flex pt-12 justify-between">
      <div className="flex">
        <div> <img src="./src/assets/shipping-box.svg"/>  </div>
        <div className="ml-3">
          <p className="faqs-footer-p"> Free Shipping </p>
          <p className="faqs-footer-desc">Free shipping for order above $180</p>
        </div>
      </div>
      <div className="flex">
        <div> <img src="./src/assets/flexible-payment.svg"/>  </div>
        <div className="ml-3">
          <p className="faqs-footer-p"> Flexible Payment </p>
          <p className="faqs-footer-desc">Multiple secure payment options</p>
        </div>
      </div>
      <div className="flex">
        <div> <img src="./src/assets/support.svg"/> </div>
        <div className="ml-3">
          <p className="faqs-footer-p"> 24×7 Support </p>
          <p className="faqs-footer-desc"> We support online all days.</p>
        </div>
      </div>
    </div>
  );
};

export default FaqsFooter;

import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords}) => {
  return(
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
}

Meta.defaultProps = {
  title: "Welcome To TopShop",
  description: "We sell the best product for cheap",
  keywords: "electronics, buy electronics, cheap electronics"
}

export default Meta;
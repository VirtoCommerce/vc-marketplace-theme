import SeoUrl from "@core/seo-routes.enum";

export default {
  header: {
    main: [
      { id: "home", title: "Home", url: "/" },
      {
        id: "catalog",
        title: "All products",
        children: [
          { title: "Bolts", url: `/${SeoUrl.Catalog}/bolts` },
          { title: "- Carriage Bolts", url: `/${SeoUrl.Catalog}/bolts/carriage-bolts` },
          { title: "- Freight Car Bolts", url: `/${SeoUrl.Catalog}/bolts/freight-car-bolts` },
          { title: "- Flange Bolts", url: `/${SeoUrl.Catalog}/bolts/flange-bolts` },
          { title: "- Eyebolts", url: `/${SeoUrl.Catalog}/bolts/eyebolts` },
          { title: "Printers", url: `/${SeoUrl.Catalog}/printers` },
          { title: "- Inkjet Printers", url: `/${SeoUrl.Catalog}/printers/inkjet-printers2` },
          { title: "- Laser Printers", url: `/${SeoUrl.Catalog}/printers/laser-printers2` },
          { title: "Beer", url: `/${SeoUrl.Catalog}/beers/beer` },
          { title: "- Non-Alco", url: `/${SeoUrl.Catalog}/beers/beer/non-alco` },
          { title: "- Alco", url: `/${SeoUrl.Catalog}/beers/beer/alco` },
          { title: "Wines", url: `/${SeoUrl.Catalog}/wines2` },
        ],
      },
      { id: "bulk", title: "Bulk order pad", url: "/bulk-order" },
      { id: "checkout", title: "Cart", url: "/checkout" },
      { id: "contact", title: "Contact us", url: "/contact" },
    ],
  },
  footer: [],
};

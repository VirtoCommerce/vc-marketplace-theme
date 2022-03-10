import SeoUrl from "@core/seo-routes.enum";

export default {
  header: {
    main: [
      { id: "home", title: "Home", url: "/" },
      {
        id: "catalog",
        title: "Our assortment",
        children: [
          { title: "Beer, Cider & Wine", url: `/${SeoUrl.Catalog}/beer-wine` },
          { title: "Cider", url: `/${SeoUrl.Catalog}/cider` },
          { title: "Wine", url: `/${SeoUrl.Catalog}/wine` },
          { title: "Softdrinks & Water", url: `/${SeoUrl.Catalog}/softdrinks` },
          { title: "Coffee, Tea & Diary", url: `/${SeoUrl.Catalog}/coffee-tea-diary` },
          { title: "Distilled", url: `/${SeoUrl.Catalog}/distilled` },
          { title: "Juices & Syrups", url: `/${SeoUrl.Catalog}/juices-syrups` },
          { title: "Snacks & chips", url: `/${SeoUrl.Catalog}/snacks-chips` },
          { title: "Non-food", url: `/${SeoUrl.Catalog}/non-food` },
        ],
      },
      { id: "checkout", title: "Cart", url: "/checkout" },
      { id: "contact", title: "Contact us", url: "/contact" },
    ],
  },
  footer: [],
};

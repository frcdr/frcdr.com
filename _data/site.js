const basedomain = "frcdr.com";

export default {
  basedomain,
  url: `https://${basedomain}`,
  languagesorder: ["ru", "en"],
  languages: {
    ru: { switchlabel: "Читать по-русски" },
    en: { switchlabel: "Read in English" },
  },
  sectionsorder: ["webdev", "devops", "translation"],
  sections: {
    webdev: {
      label: {
        ru: "Веб-разработка",
        en: "Full Stack Web Development",
      },
      linkname: {
        ru: "веб-разработчика",
        en: "web developer",
      },
      teaser: {
        ru: "чтобы предоставлять людям более доступные сервисы",
        en: "to bring more accessible services to people",
      },
      urls: {
        ru: "/ru/webdev/",
        en: "/en/webdev/",
      },
    },
    devops: {
      label: {
        ru: "DevOps",
        en: "DevOps",
      },
      linkname: {
        ru: "DevOps-инженера",
        en: "DevOps engineer",
      },
      teaser: {
        ru: "чтобы помочь вам обеспечить безопасность и масштабирование бизнеса",
        en: "to help you secure and scale your business",
      },
      urls: {
        ru: "/ru/devops/",
        en: "/en/devops/",
      },
    },
    translation: {
      label: {
        ru: "Перевод и лингвистика",
        en: "Linguistics",
      },
      linkname: {
        ru: "переводчика",
        en: "translator",
      },
      teaser: {
        ru: "чтобы локализовать продукты для новых рынков",
        en: "to localize products for new markets",
      },
      urls: {
        ru: "/ru/translation/",
        en: "/en/translation/",
      },
    },
  },
};

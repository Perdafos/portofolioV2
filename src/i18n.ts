import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About",
        "skills": "Skills",
        "projects": "Projects",
        "videos": "Videos",
        "setup": "Setup",
        "blog": "Blog",
        "contact": "Contact"
      },
      "hero": {
        "discover": "Discover More About Me",
        "title1": "The World Without Art",
        "title2": "Its Just A Rock,",
        "title3": "building a website",
        "title4": "is the same as making",
        "title5": "a painting",
        "description": "Welcome to my portfolio. This website is designed to showcase my expertise in web development and video editing. As a web developer and video editor utilizing CapCut, After Effects, and Premiere Pro, I specialize in creating beautiful, functional websites and engaging video content.",
        "viewWork": "View My Work",
        "contactMe": "Contact Me"
      },
      "about": {
        "title": "About Me",
        "journey": "My Journey",
        "content": "Hello, my name is Dafa Ghaitsa. I am a website developer and video editor with a passion for creating beautiful and functional digital experiences. I have experience in frontend, backend, and video editing—specializing in tools like CapCut, After Effects, and Premiere Pro. I am always looking for new challenges to improve my skills and deliver premium results."
      },
      "skills": {
        "title": "Skills",
        "techSkills": "My Tech Skills",
        "frontend": "FrontEnd",
        "backend": "BackEnd",
        "database": "DataBase",
        "tools": "Tools"
      },
      "contact": {
        "title": "Contact",
        "getInTouch": "Get In Touch",
        "desc": "I'm always open to discussing new projects, creative ideas, or opportunities. Feel free to reach out through any of these channels.",
        "email": "EMAIL",
        "phone": "PHONE",
        "location": "LOCATION",
        "available": "Available for Work",
        "availableDesc": "Currently open to freelance projects and full-time opportunities. Let's build something great together.",
        "remote": "REMOTE",
        "freelance": "FREELANCE",
        "fulltime": "FULL-TIME",
        "contract": "CONTRACT",
        "sendMessage": "SEND MESSAGE"
      },
      "blog": {
        "title": "Blog",
        "latestArticles": "Latest Articles",
        "journal": "Journal",
        "allArticles": "All Articles",
        "allArticlesDesc": "All articles I have published. Click on an article to read the full version.",
        "readArticle": "Read Article",
        "viewAll": "View All Articles",
        "backToArticles": "Back to Articles",
        "minRead": "min read",
        "draft": "Draft",
        "noArticles": "No articles published yet.",
        "errorLoadList": "Failed to load blog list.",
        "errorLoadListHome": "Failed to load blog articles.",
        "errorInvalidSlug": "Invalid article slug.",
        "errorNotFoundHeader": "Article not found or not published.",
        "errorFetchArticle": "Failed to load article.",
        "errorNotFoundFallback": "Article not found."
      },
      "videos": {
        "title": "Videos",
        "workVideos": "Featured Videos",
        "errorLoadList": "Failed to load videos.",
        "noVideos": "No videos found."
      }
    }
  },
  id: {
    translation: {
      "nav": {
        "home": "Beranda",
        "about": "Tentang",
        "skills": "Keahlian",
        "projects": "Proyek",
        "videos": "Video",
        "setup": "Setup",
        "blog": "Blog",
        "contact": "Kontak"
      },
      "hero": {
        "discover": "Temukan Lebih Banyak Tentang Saya",
        "title1": "Dunia Tanpa Seni",
        "title2": "Hanyalah Sebuah Batu,",
        "title3": "membangun sebuah website",
        "title4": "sama halnya dengan membuat",
        "title5": "sebuah lukisan",
        "description": "Selamat datang di portofolio saya. Website ini dirancang untuk menunjukkan keahlian saya dalam pengembangan web dan pengeditan video. Sebagai seorang web developer dan video editor yang menggunakan CapCut, After Effects, dan Premiere Pro, saya berfokus menciptakan website yang fungsional serta konten video yang menarik.",
        "viewWork": "Lihat Karya Saya",
        "contactMe": "Hubungi Saya"
      },
      "about": {
        "title": "Tentang Saya",
        "journey": "Perjalanan Saya",
        "content": "Halo, nama saya Dafa Ghaitsa. Saya adalah seorang pengembang website dan editor video dengan passion untuk menciptakan karya digital yang indah dan fungsional. Saya memiliki pengalaman dalam pengembangan frontend, backend, serta pengeditan video—menggunakan perangkat lunak seperti CapCut, After Effects, dan Premiere Pro. Saya selalu mencari tantangan baru untuk meningkatkan keahlian saya."
      },
      "skills": {
        "title": "Keahlian",
        "techSkills": "Keahlian Teknologi Saya",
        "frontend": "FrontEnd",
        "backend": "BackEnd",
        "database": "Basis Data",
        "tools": "Alat"
      },
      "contact": {
        "title": "Kontak",
        "getInTouch": "Hubungi Saya",
        "desc": "Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang lainnya. Jangan ragu untuk menghubungi melalui salah satu saluran ini.",
        "email": "EMAIL",
        "phone": "TELEPON",
        "location": "LOKASI",
        "available": "Tersedia untuk Bekerja",
        "availableDesc": "Saat ini terbuka untuk proyek lepas dan peluang penuh waktu. Mari kita bangun sesuatu yang hebat bersama.",
        "remote": "JARAK JAUH",
        "freelance": "LEPAS",
        "fulltime": "PENUH WAKTU",
        "contract": "KONTRAK",
        "sendMessage": "KIRIM PESAN"
      },
      "blog": {
        "title": "Blog",
        "latestArticles": "Artikel Terbaru",
        "journal": "Jurnal",
        "allArticles": "Semua Artikel",
        "allArticlesDesc": "Semua artikel yang sudah saya publikasikan. Klik salah satu artikel untuk membaca versi lengkap.",
        "readArticle": "Baca Artikel",
        "viewAll": "Lihat Semua Artikel",
        "backToArticles": "Kembali ke Artikel",
        "minRead": "mnt baca",
        "draft": "Draf",
        "noArticles": "Belum ada artikel yang dipublikasikan.",
        "errorLoadList": "Gagal memuat daftar blog.",
        "errorLoadListHome": "Gagal memuat artikel blog.",
        "errorInvalidSlug": "Slug artikel tidak valid.",
        "errorNotFoundHeader": "Artikel tidak ditemukan atau belum dipublikasikan.",
        "errorFetchArticle": "Gagal memuat artikel.",
        "errorNotFoundFallback": "Artikel tidak ditemukan."
      },
      "videos": {
        "title": "Video",
        "workVideos": "Video Pekerjaan",
        "errorLoadList": "Gagal memuat daftar video.",
        "noVideos": "Belum ada video pekerjaan."
      }
    }
  }
};

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;

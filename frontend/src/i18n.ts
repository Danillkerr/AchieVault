import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        ranking: "Global Ranking",
        search: "Search",
        terms: "Terms",
        privacy: "Privacy",
        license: "License",
      },
      home: {
        title: "AchieVault",
        subtitle:
          "Track your achievements, compete with friends, complete games.",
        login: "Login via Steam",
        trending: "Trending Games",
        completionists: "Completionists",
        hunters: "Hunters",
        playing: "playing",
      },
      search: {
        title: "Search result",
        users: "Users",
        games: "Games",
        achievements: "Total",
        no_users: "No users found",
        no_games: "No games found",
        query_label: "Results for",
        rating: "Rating",
      },
      ranking: {
        title: "Global Ranking",
        subtitle: "Top players by completion and dedication",
        completionists: "Completionists Leaderboard",
        your_profile: "Your Profile",
        rank_completed: "Completionist Rank",
        rank_achievement: "Hunter Rank",
        hunters: "Achievement Hunters",
        table_rank: "Rank",
        table_user: "User",
        table_compl: "100% Compl.",
        table_total: "Achievements",
        perfect_games: "Perfect Games",
      },
      profile: {
        games: "Games",
        completed: "100% Completed",
        achievements: "Achievements",
        total: "Total",
        rank_perfect: "Rank #100%",
        rank_achievements: "Rank Achievs",
        friend_rating: "Friend Rating",
        view_full: "View Full List",
        recent_games: "Recent Games",
        settings: "Account Settings",
        logout: "Log Out",
        delete_account: "Delete Account",
        delete_confirm: "Are you sure? This is irreversible.",
        delete_prompt: "Type 'DELETE' to confirm:",
        you: "YOU",
        playtime: "Playtime",
        completion: "Completion",
        friends_ranking: "Full Friends Ranking",
        games_completed: "games completed",
        delete_cancelled: "Deletion cancelled.",
        delete_success: "Account deleted successfully.",
        delete_error: "Failed to delete account.",
        not_found: "Profile not found",
      },
      roadmap: {
        create_page_title: "New Roadmap",
        roadmap_name: "Roadmap Name",
        example_name: "e.g. Soulslike Marathon",
        select_games: "Select Games",
        done: "Done",
        search_library: "Search library...",
        loading_library: "Loading library...",
        no_games_found: "No games found matching your search.",
        create_btn: "Create Roadmap",
        creating: "Creating...",
        banner_title: "Start Your Journey",
        moving: "Moving...",
        next_recommended: "Next Recommended",
        banner_text:
          "Create a roadmap to track your backlog and completion goals.",
        empty_slot: "No games here yet",
        banner_btn: "+ Create Roadmap",
        progress: "Progress",
        est_time: "Est. Time",
        total_games: "Total Games",
        next_up: "Next Up",
        active: "Active",
        deferred: "Deferred",
        board_title: "Progress Board",
        view_mode: "View",
        edit_mode: "Edit",
        saving: "Saving...",
        delete_roadmap: "Delete Roadmap",
        game_list: "Game List",
        view_all: "View All",
        status: {
          planned: "Planned",
          in_progress: "In Progress",
          deferred: "Deferred",
          completed: "Completed",
        },
      },
      game: {
        rating: "Rating",
        time_to_beat: "Average time to beat",
        about: "About",
        steam_link: "Steam",
        igdb_link: "IGDB Info",
        no_desc: "No description available.",
        content_notice:
          "Note: Game content and achievements are available in English only.",
        tabs: {
          achievements: "Achievements",
          backlog: "Backlog",
          guide: "Guide",
        },
        guides: {
          title: "Community Guides",
          create: "Create Guide",
          no_guides: "No guides yet. Be the first!",
          by: "By",
          back: "Back to guides",
          edit: "Edit Guide",
          delete: "Delete Guide",
          form_title_create: "Write a new Guide",
          form_title_edit: "Edit Guide",
          input_placeholder: "Guide Title",
          publish: "Publish Guide",
          save: "Save Changes",
          min_chars: "Min {{count}} chars",
          max_size: "Max {{size}}",
          form_description:
            "Write your guide... Drag & drop images or paste YouTube links.",
          fill_all_fields: "Please fill in all fields.",
          form_invalid: "Please fix errors before submitting.",
        },
        achievements: {
          unlocked: "Unlocked",
          locked: "Locked",
          empty_backlog: "All achievements completed!",
        },
      },
      common: {
        loading: "Loading...",
        error: "Error",
        cancel: "Cancel",
        save: "Save",
        search_placeholder: "Search...",
        user: "User",
        not_found: "Not found",
        hours: "hours",
        hours_short: "h",
        saving: "Saving...",
      },
      footer: {
        data_provided: "Data provided by",
        disclaimer:
          "Steam and the Steam logo are trademarks of Valve Corporation. All other trademarks are property of their respective owners. Not affiliated with Valve.",
      },
      loading: {
        default: "Loading...",
        auth: "Verifying authentication...",
        profile: "Loading profile...",
        roadmap: "Loading roadmap...",
        game: "Loading game data...",
        library: "Loading library...",
        guides: "Loading guides...",
        rank: "Loading your rank...",
        home_data: "Loading homepage data...",
        searching: "Searching...",
      },
      pagination: {
        prev: "« Prev",
        next: "Next »",
        info: "Page {{page}} of {{total}}",
      },
      toasts: {
        roadmap_updated: "Updated {{count}} games",
        save_error: "Failed to save changes",
        roadmap_deleted: "Roadmap deleted",
        delete_error: "Failed to delete roadmap",
        roadmap_created: "Roadmap created successfully!",
        create_error: "Error creating roadmap",
        completed_revert_error: "Completed games cannot be moved back!",
        completion_requirement_error:
          'Cannot complete "{{title}}". Progress is {{percent}}% (Need 100%)',
        move_progress_error:
          "From 'In Progress' you can only move to 'Deferred' or 'Completed'",
        move_deferred_error:
          "From 'Deferred' you can only move to 'In Progress' or 'Completed'",
        moved_to: "Moved to {{status}}",
        sync_loading: "Updating data from Steam...",
        sync_success: "Data updated!",
        sync_error: "Sync failed",
        guide_published: "Guide published successfully!",
        guide_create_error: "Failed to create guide",
        guide_updated: "Guide updated!",
        guide_update_error: "Failed to update guide",
        guide_deleted: "Guide deleted!",
        guide_delete_error: "Failed to delete guide",
      },
      legal: {
        back_home: "Back to Home",
        last_updated: "Last Updated: November 27, 2025",
        terms: {
          title: "Terms of Use",
          intro_title: "1. Introduction",
          intro_text:
            "Welcome to <strong>AchieVault</strong>. By accessing or using our website, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree with any part of these terms, you must not use our service.",
          steam_title: "2. Steam Integration",
          steam_text:
            "AchieVault utilizes the Steam Web API to retrieve game and achievement data. By using our service, you acknowledge that:",
          steam_li1:
            "We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Valve Corporation or Steam.",
          steam_li2:
            'Your Steam profile data must be set to "Public" for our service to track your progress effectively.',
          steam_li3:
            "All game images, logos, and titles are property of their respective owners.",
          accounts_title: "3. User Accounts",
          accounts_text1:
            "When you create an account with us, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account.",
          accounts_text2:
            "We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
          ip_title: "4. Intellectual Property",
          ip_text1:
            "The AchieVault platform, including its original content, features, and functionality, is and will remain the exclusive property of AchieVault and its licensors.",
          ip_text2:
            "Game content and materials are trademarks and copyrights of their respective publishers and its licensors.",
          liability_title: "5. Limitation of Liability",
          liability_text:
            "In no event shall AchieVault, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
        },
        privacy: {
          title: "Privacy Policy",
          collect_title: "1. Information We Collect",
          collect_text:
            "AchieVault collects minimal data necessary to provide our achievement tracking service:",
          collect_li1_strong: "Steam Information:",
          collect_li1_text:
            "When you sign in via Steam, we receive your Steam ID, Display Name, and Avatar. We also access your public game library and achievement stats via the Steam Web API.",
          collect_li2_strong: "Usage Data:",
          collect_li2_text:
            "We may collect information on how the Service is accessed and used (e.g. page views, roadmaps created).",
          usage_title: "2. How We Use Your Data",
          usage_text: "We use the collected data for the following purposes:",
          usage_li1:
            "To provide and maintain our Service (tracking your progress).",
          usage_li2:
            "To allow you to participate in interactive features (Leaderboards, Friend Comparisons).",
          usage_li3: "To generate personalized Roadmaps and recommendations.",
          third_party_title: "3. Third-Party Services",
          third_party_text:
            "We use third-party services to function. Please review their privacy policies:",
          retention_title: "4. Data Retention & Deletion",
          retention_text1:
            "We retain your data only as long as your account is active. You have the right to delete your account at any time via the <strong>Profile Settings</strong>.",
          retention_text2:
            "Upon deletion, all your personal data stored on our servers (including roadmaps and ranking history) will be permanently removed. Note that we cannot delete data stored on Steam's servers.",
          cookies_title: "5. Cookies",
          cookies_text:
            "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information (e.g. keeping you logged in).",
        },
      },
    },
  },
  uk: {
    translation: {
      nav: {
        home: "Головна",
        ranking: "Рейтинг",
        search: "Пошук",
        terms: "Умови",
        privacy: "Приватність",
        license: "Ліцензія",
      },
      home: {
        title: "AchieVault",
        subtitle:
          "Відстежуй досягнення, змагайся з друзями, проходь ігри на 100%.",
        login: "Увійти через Steam",
        trending: "Популярні ігри",
        completionists: "Перфекціоністи",
        hunters: "Мисливці",
        playing: "грають",
      },
      search: {
        title: "Результати пошуку",
        users: "Користувачі",
        games: "Ігри",
        achievements: "Досягнення",
        no_users: "Користувачів не знайдено",
        no_games: "Ігор не знайдено",
        query_label: "Результати для",
        rating: "Рейтинг",
      },
      ranking: {
        title: "Глобальний рейтинг",
        subtitle: "Найкращі гравці за кількістю комплітів та досягнень",
        your_profile: "Ваш профіль",
        rank_completed: "Ранг перфекціоніста",
        rank_achievement: "Ранг мисливця",
        completionists: "Топ перфекціоністів",
        hunters: "Мисливці за досягненнями",
        table_rank: "Ранг",
        table_user: "Гравець",
        table_compl: "100% Ігор",
        table_total: "Досягнень",
        perfect_games: "Ідеальні ігри",
      },
      profile: {
        games: "Ігри",
        completed: "На 100%",
        achievements: "Досягнення",
        total: "Всього",
        rank_perfect: "Ранг 100%",
        rank_achievements: "Ранг Hunter",
        friend_rating: "Рейтинг друзів",
        view_full: "Весь список",
        recent_games: "Нещодавні ігри",
        settings: "Налаштування акаунту",
        logout: "Вийти",
        delete_account: "Видалити акаунт",
        delete_confirm: "Ви впевнені? Це неможливо скасувати.",
        delete_prompt: "Напишіть 'DELETE' для підтвердження:",
        delete_cancelled: "Видалення скасовано.",
        delete_success: "Акаунт успішно видалено.",
        delete_error: "Не вдалося видалити акаунт.",
        not_found: "Профіль не знайдено",
        you: "ВИ",
        playtime: "Час у грі",
        completion: "Прогрес",
        friends_ranking: "Повний рейтинг друзів",
        games_completed: "ігор завершено",
      },
      roadmap: {
        create_page_title: "Нова Мапа",
        roadmap_name: "Назва Мапи",
        example_name: "напр. Соулслайк Марафон",
        select_games: "Оберіть ігри",
        search_library: "Пошук у бібліотеці...",
        loading_library: "Завантаження бібліотеки...",
        no_games_found: "Ігор за вашим запитом не знайдено.",
        create_btn: "Створити Мапу",
        creating: "Створення...",
        banner_title: "Почни свою подорож",
        next_recommended: "Наступна рекомендована:",
        moving: "Переміщення...",
        empty_slot: "Тут поки що немає ігор",
        banner_text:
          "Створи мапу проходження, щоб розібрати беклог та досягти цілей.",
        banner_btn: "+ Створити Мапу",
        progress: "Прогрес",
        est_time: "Час",
        total_games: "Ігор",
        next_up: "Далі за планом",
        active: "Активні",
        deferred: "Відкладені",
        board_title: "Дошка прогресу",
        view_mode: "Перегляд",
        edit_mode: "Редагування",
        saving: "Збереження...",
        delete_roadmap: "Видалити Мапу",
        game_list: "Список ігор",
        view_all: "Дивитись усі",
        status: {
          planned: "У планах",
          in_progress: "В процесі",
          deferred: "Відкладено",
          completed: "Завершено",
        },
        done: "Завершено",
      },
      game: {
        rating: "Рейтинг",
        time_to_beat: "Час на проходження",
        about: "Про гру",
        steam_link: "Steam",
        igdb_link: "Інфо IGDB",
        no_desc: "Опис відсутній.",
        content_notice:
          "Примітка: Контент гри та досягнення доступні лише англійською мовою.",

        tabs: {
          achievements: "Досягнення",
          backlog: "Беклог",
          guide: "Гайди",
        },
        guides: {
          title: "Гайди спільноти",
          create: "Написати гайд",
          no_guides: "Гайдів ще немає. Стань першим!",
          by: "Автор:",
          back: "Назад до гайдів",
          edit: "Редагувати",
          delete: "Видалити",
          form_title_create: "Новий гайд",
          form_title_edit: "Редагування гайду",
          input_placeholder: "Заголовок гайду",
          publish: "Опублікувати",
          save: "Зберегти зміни",
          min_chars: "Мін. {{count}} символів",
          max_size: "Макс. {{size}}",
          form_description:
            "Напишіть свій гайд... Перетягуйте зображення або вставляйте посилання на YouTube.",
          fill_all_fields: "Будь ласка, заповніть усі поля.",
          form_invalid: "Будь ласка, виправте помилки перед публікацією.",
        },
        achievements: {
          unlocked: "Отримано",
          locked: "Закрито",
          empty_backlog: "Всі досягнення отримано!",
        },
      },
      common: {
        loading: "Завантаження...",
        error: "Помилка",
        cancel: "Скасувати",
        save: "Зберегти",
        search_placeholder: "Пошук...",
        user: "Користувач",
        not_found: "Не знайдено",
        hours: "год",
        hours_short: "г",
        saving: "Збереження...",
      },
      footer: {
        data_provided: "Дані надані",
        disclaimer:
          "Steam та логотип Steam є торговельними марками Valve Corporation. Усі інші торговельні марки є власністю відповідних власників. Не пов'язано з Valve.",
      },
      loading: {
        default: "Завантаження...",
        auth: "Перевірка авторизації...",
        profile: "Завантаження профілю...",
        roadmap: "Завантаження мапи...",
        game: "Завантаження даних гри...",
        library: "Завантаження бібліотеки...",
        guides: "Завантаження гайдів...",
        rank: "Завантаження рейтингу...",
        home_data: "Завантаження даних...",
        searching: "Пошук...",
      },
      pagination: {
        prev: "« Назад",
        next: "Далі »",
        info: "Сторінка {{page}} з {{total}}",
      },
      toasts: {
        roadmap_updated: "Оновлено ігор: {{count}}",
        save_error: "Не вдалося зберегти зміни",
        roadmap_deleted: "Мапу видалено",
        delete_error: "Не вдалося видалити мапу",
        roadmap_created: "Мапу успішно створено!",
        create_error: "Помилка при створенні мапи",
        completed_revert_error: "Завершені ігри не можна повертати назад!",
        completion_requirement_error:
          'Не можна завершити "{{title}}". Прогрес {{percent}}% (Потрібно 100%)',
        move_progress_error:
          "З 'В процесі' можна перемістити тільки у 'Відкладені' або 'Завершено'",
        move_deferred_error:
          "З 'Відкладених' можна перемістити тільки у 'В процесі' або 'Завершено'",
        moved_to: "Переміщено у {{status}}",
        sync_loading: "Оновлення даних зі Steam...",
        sync_success: "Дані оновлено!",
        sync_error: "Помилка синхронізації",
        guide_published: "Гайд успішно опубліковано!",
        guide_create_error: "Не вдалося створити гайд",
        guide_updated: "Гайд оновлено!",
        guide_update_error: "Не вдалося оновити гайд",
        guide_deleted: "Гайд видалено!",
        guide_delete_error: "Не вдалося видалити гайд",
      },
      legal: {
        back_home: "На головну",
        last_updated: "Останнє оновлення: 27 листопада 2025",
        terms: {
          title: "Умови використання",
          intro_title: "1. Вступ",
          intro_text:
            "Вітаємо в <strong>AchieVault</strong>. Отримуючи доступ до нашого веб-сайту або використовуючи його, ви погоджуєтесь дотримуватися цих Умов використання та нашої Політики конфіденційності. Якщо ви не згодні з будь-якою частиною цих умов, ви не повинні користуватися нашим сервісом.",
          steam_title: "2. Інтеграція зі Steam",
          steam_text:
            "AchieVault використовує Steam Web API для отримання даних про ігри та досягнення. Використовуючи наш сервіс, ви визнаєте, що:",
          steam_li1:
            "Ми не є філією, не пов'язані, не уповноважені та не схвалені Valve Corporation або Steam будь-яким офіційним чином.",
          steam_li2:
            'Ваш профіль Steam повинен мати статус "Публічний", щоб наш сервіс міг ефективно відстежувати ваш прогрес.',
          steam_li3:
            "Усі зображення, логотипи та назви ігор є власністю їх відповідних власників.",
          accounts_title: "3. Облікові записи",
          accounts_text1:
            "Створюючи обліковий запис у нас, ви повинні надати точну та повну інформацію. Ви несете повну відповідальність за дії, що відбуваються у вашому обліковому записі.",
          accounts_text2:
            "Ми залишаємо за собою право негайно припинити або призупинити дію вашого облікового запису без попереднього повідомлення з будь-якої причини, включаючи, без обмежень, порушення Умов.",
          ip_title: "4. Інтелектуальна власність",
          ip_text1:
            "Платформа AchieVault, включаючи її оригінальний контент, функції та функціональність, є і залишатиметься виключною власністю AchieVault та її ліцензіарів.",
          ip_text2:
            "Ігровий контент та матеріали є торговими марками та об'єктами авторського права відповідних видавців та їхніх ліцензіарів.",
          liability_title: "5. Обмеження відповідальності",
          liability_text:
            "За жодних обставин AchieVault, а також його директори, співробітники, партнери, агенти, постачальники або афілійовані особи не несуть відповідальності за будь-які непрямі, випадкові, спеціальні, побічні або штрафні збитки, включаючи, без обмежень, втрату прибутку, даних, використання, гудвілу або інших нематеріальних втрат.",
        },
        privacy: {
          title: "Політика конфіденційності",
          collect_title: "1. Інформація, яку ми збираємо",
          collect_text:
            "AchieVault збирає мінімальну кількість даних, необхідних для надання сервісу відстеження досягнень:",
          collect_li1_strong: "Інформація Steam:",
          collect_li1_text:
            "Коли ви входите через Steam, ми отримуємо ваш Steam ID, відображуване ім'я та аватар. Ми також отримуємо доступ до вашої публічної бібліотеки ігор та статистики досягнень через Steam Web API.",
          collect_li2_strong: "Дані використання:",
          collect_li2_text:
            "Ми можемо збирати інформацію про те, як здійснюється доступ до Сервісу та як він використовується (наприклад, перегляди сторінок, створені мапи).",
          usage_title: "2. Як ми використовуємо ваші дані",
          usage_text: "Ми використовуємо зібрані дані для наступних цілей:",
          usage_li1:
            "Для надання та підтримки нашого Сервісу (відстеження вашого прогресу).",
          usage_li2:
            "Щоб дозволити вам брати участь в інтерактивних функціях (Рейтинги, Порівняння з друзями).",
          usage_li3: "Для створення персоналізованих Мап та рекомендацій.",
          third_party_title: "3. Сторонні сервіси",
          third_party_text:
            "Ми використовуємо сторонні сервіси для функціонування. Будь ласка, ознайомтеся з їхніми політиками конфіденційності:",
          retention_title: "4. Збереження та видалення даних",
          retention_text1:
            "Ми зберігаємо ваші дані лише доти, доки ваш обліковий запис активний. Ви маєте право видалити свій обліковий запис у будь-який час через <strong>Налаштування профілю</strong>.",
          retention_text2:
            "Після видалення всі ваші персональні дані, що зберігаються на наших серверах (включаючи мапи та історію рейтингів), будуть назавжди видалені. Зауважте, що ми не можемо видалити дані, що зберігаються на серверах Steam.",
          cookies_title: "5. Cookies",
          cookies_text:
            "Ми використовуємо файли cookie та аналогічні технології відстеження для відстеження активності на нашому Сервісі та зберігання певної інформації (наприклад, для підтримки вашого входу в систему).",
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
